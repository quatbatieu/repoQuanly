#!/bin/bash
set -e
set -x
VAR_FILE="ops/bin/vars.properties"
source ${VAR_FILE}
STACK_NAME=${CONTAINER_NAME}
PWD=$(pwd)

##### Deploy on server #####

## Server deploy information
EXTERNAL_PORT=$(eval "echo \${"EXTERNAL_PORT_${ENV}"}")
REMOTE_HOST=$(eval "echo \${"REMOTE_HOST_${ENV}"}")
DOCKER_SWARM_NODE_LABEL=$(eval "echo \${"DOCKER_SWARM_NODE_LABEL_${ENV}"}")

## Replace template
env REPOSITORY_DOCKER_HUB=${REPOSITORY_DOCKER_HUB} \
env IMAGE_NAME=${IMAGE_NAME} \
env EXTERNAL_PORT=${EXTERNAL_PORT} \
env ENV=${ENV} \
env REPLICAS_NUMBER=${REPLICAS_NUMBER} \
env CONTAINER_PORT=${CONTAINER_PORT} \
env DOCKER_SWARM_NODE_LABEL=${DOCKER_SWARM_NODE_LABEL} \
envsubst < ops/config/deploy-template.yml > ${DEPLOY_YAML_FILE}
cat ${DEPLOY_YAML_FILE}

## Deploy prd through bastion
if [ "${ENV}" == "prd" ]
then
{
    DEPLOY_WITH_BASTION='-o ProxyCommand="ssh -W %h:%p -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no root@'${BASTION_HOST}'"'
}
fi

## Create deploy directory on remote host
bash -c "ssh $(echo ${DEPLOY_WITH_BASTION}) -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no root@${REMOTE_HOST} 'mkdir -p ${DEPLOY_YAML_PATH} && cp ${DEPLOY_YAML_PATH}/${DEPLOY_YAML_FILE} ${DEPLOY_YAML_PATH}/${DEPLOY_YAML_FILE}.rollback || true'"

## Copy the deploy file
bash -c "scp $(echo ${DEPLOY_WITH_BASTION}) ${DEPLOY_YAML_FILE} root@${REMOTE_HOST}:${DEPLOY_YAML_PATH}"

## Deploy with deploy file
rm -rf remote-command.txt || true
echo '
## Docker login
for i in {1..10}
do
    echo "Docker login the ${i} time"
    DOCKER_LOGIN_SUCCESS=$(docker login -u '${DOCKERHUB_USERNAME}' -p '${DOCKERHUB_PASSWORD}' '${DOCKERHUB_REGISTRY}' | grep "Login Succeeded" || true )

    if [ "${DOCKER_LOGIN_SUCCESS}" != "" ]
    then
    {
        echo "Login Succeeded"
        break
    }
    elif [ "${i}" -eq "10" ]
    then
        {
        echo "Login fail"
        exit 1
        }    
    else
    {
        ## Login again after 15s
        sleep 15
    }
    fi
done

#docker pull '${REPOSITORY_DOCKER_HUB}''${IMAGE_NAME}'
docker stack deploy --with-registry-auth -c '${DEPLOY_YAML_PATH}'/'${DEPLOY_YAML_FILE}' '${STACK_NAME}'

## Healthcheck
sleep 30
for i in {1..20}
do
    echo "Healthcheck the $i time"
    ENVIRONMENT_STATUS_SUCCESS=$(docker service inspect '${STACK_NAME}'_app --format "{{.UpdateStatus.State}}" | grep "completed" || true )
    ENVIRONMENT_STATUS_ERROR=$(docker service inspect '${STACK_NAME}'_app --format "{{.UpdateStatus.State}}" | grep "paused" || true )

    if [ "${ENVIRONMENT_STATUS_SUCCESS}" != "" ]
    then
    {
        echo "Environment is up and running"
        break
    }
    elif [ "${ENVIRONMENT_STATUS_ERROR}" != "" -o  "${i}" -eq "20" ]
    then
        {
        echo "Deploy fail."
        docker service inspect '${STACK_NAME}'_app --format "{{.UpdateStatus.Message}}"
        echo "Rollback"
        cp '${DEPLOY_YAML_PATH}'/'${DEPLOY_YAML_FILE}'.rollback '${DEPLOY_YAML_PATH}'/'${DEPLOY_YAML_FILE}'
        docker stack deploy --with-registry-auth -c '${DEPLOY_YAML_PATH}'/'${DEPLOY_YAML_FILE}' '${STACK_NAME}'        
        exit 1
        } 
    else
    {
        echo "Environment is still not healthy"
        ## Check again after 10s
        sleep 10
    }
    fi
done
' >> ${PWD}/remote-command.txt
bash -c "ssh $(echo ${DEPLOY_WITH_BASTION}) -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no root@${REMOTE_HOST} < ${PWD}/remote-command.txt"