#!/bin/bash
set -e
set -x
VAR_FILE="ops/bin/vars.properties"

if [ "X${ENV}" = "X" ]
then
        echo "ENV_DEPLOY is not set"
        exit 1
fi

cat /dev/null > ${VAR_FILE}

## App Config
SERVICE_NAME="web"
echo SERVICE_NAME="${SERVICE_NAME}" >> ${VAR_FILE}
PROJECT_NAME="thinkn"
echo PROJECT_NAME="${PROJECT_NAME}" >> ${VAR_FILE}
COMPANY_NAME="nexlesoft"
echo COMPANY_NAME="${COMPANY_NAME}" >> ${VAR_FILE}

## AWS Config
echo ENV="${ENV}" >> ${VAR_FILE}
echo PROFILE="${PROJECT_NAME}-${ENV}" >> ${VAR_FILE}
echo REGION="ap-southeast-1" >> ${VAR_FILE}

## Docker Config
echo REPOSITORY_DOCKER_HUB="${DOCKERHUB_REGISTRY}${COMPANY_NAME}${PROJECT_NAME}/${PROJECT_NAME}-project:" >> ${VAR_FILE}
BRANCH_NAME=$(echo ${BRANCH_NAME} | sed 's/\//-/')
echo BRANCH_NAME="${BRANCH_NAME}" >> ${VAR_FILE}
TAG_NAME="${BRANCH_NAME}-${HEAD_COMMIT_ID}"
echo TAG_NAME="${BRANCH_NAME}-${HEAD_COMMIT_ID}" >> ${VAR_FILE}
IMAGE_NAME="${PROJECT_NAME}-${SERVICE_NAME}-${ENV}-${TAG_NAME}"
CONTAINER_NAME="${PROJECT_NAME}-${SERVICE_NAME}-${ENV}"
echo IMAGE_NAME=${IMAGE_NAME} >> ${VAR_FILE}
echo CONTAINER_NAME=${CONTAINER_NAME} >> ${VAR_FILE}
echo REPLICAS_NUMBER="1" >> ${VAR_FILE}
echo DEPLOY_YAML_PATH="/root/docker-deploy/${COMPANY_NAME}/${PROJECT_NAME}" >> ${VAR_FILE}
echo DEPLOY_YAML_FILE="docker-deploy-${SERVICE_NAME}-${ENV}.yml" >> ${VAR_FILE}

## Cache build config
CACHE_FOLDER_PATH="/var/lib/jenkins/${COMPANY_NAME}-config/${PROJECT_NAME}-config/${SERVICE_NAME}/cache-folder"
echo CACHE_FOLDER_PATH=${CACHE_FOLDER_PATH} >> ${VAR_FILE}
echo CACHE_FILE='"package.json package-lock.json"' >> ${VAR_FILE}
CACHE_IMAGE_NAME="${PROJECT_NAME}-${SERVICE_NAME}-${ENV}-cache"
echo CACHE_IMAGE_NAME=${CACHE_IMAGE_NAME} >> ${VAR_FILE}

## Server Config
echo CONTAINER_PORT="80" >> ${VAR_FILE}
echo EXTERNAL_PORT_dev="10004" >> ${VAR_FILE}
echo EXTERNAL_PORT_stg="10005" >> ${VAR_FILE}
echo EXTERNAL_PORT_prd="10006" >> ${VAR_FILE}

echo REMOTE_HOST_dev="192.168.45.6" >> ${VAR_FILE}
echo REMOTE_HOST_stg="192.168.45.6" >> ${VAR_FILE}
echo REMOTE_HOST_prd="manager.docker-swarm.nexlesoft.com" >> ${VAR_FILE}

echo DOCKER_SWARM_NODE_LABEL_dev="nexle-dev-local" >> ${VAR_FILE}
echo DOCKER_SWARM_NODE_LABEL_stg="nexle-dev-local" >> ${VAR_FILE}
echo DOCKER_SWARM_NODE_LABEL_prd="thinkn-prd" >> ${VAR_FILE}

## Env config
ENV_FILE_PATH="/var/lib/jenkins/${COMPANY_NAME}-config/${PROJECT_NAME}-config/${SERVICE_NAME}/env-${ENV}"
echo ENV_FILE_PATH=${ENV_FILE_PATH} >> ${VAR_FILE}

## Bastion Config
echo BASTION_HOST="bastion.datacenter.nexlesoft.com" >> ${VAR_FILE}