#!/bin/bash
set -e
set -x
VAR_FILE="ops/bin/vars.properties"
source ${VAR_FILE}

## Checking to use cache image or not by checksum
for i in ${CACHE_FILE};do
{
    MD5_NEW_FILE=$(md5sum ${i} | awk '{print $1}' )
    MD5_OLD_FILE=$(md5sum ${CACHE_FOLDER_PATH}/${BRANCH_NAME}/${i} | awk '{print $1}' )
    if [ "${MD5_NEW_FILE}" != "${MD5_OLD_FILE}" ] ; then
        {
            REBUILD_CACHE_IMAGE="true"
            break
        }
    fi
}
done

## Check cache image exist
CACHE_IMAGE_EXIST=$(sudo docker images | grep "${CACHE_IMAGE_NAME}" || true )

if [ "${REBUILD_CACHE_IMAGE}" = "true" -o "${CACHE_IMAGE_EXIST}" = "" ] ; then
    {
        echo "Package files have changed or cache image was deleted. Rebuild cache image"
        sudo mkdir -p ${CACHE_FOLDER_PATH}/${BRANCH_NAME}
        
        ## Build cache images
        sudo docker build --no-cache --force-rm=true --target cache-image -f Dockerfile -t ${CACHE_IMAGE_NAME} .
        
        ## Sync file
        for i in ${CACHE_FILE};do
            {
                sudo rsync -avu --delete ${i} ${CACHE_FOLDER_PATH}/${BRANCH_NAME}/${i}
            }
        done
    }
else
    {
        echo "Package files have not changed. Use cache image"
    }
fi

## Build deploy image
sudo docker build --force-rm=true --target deploy-image --cache-from=${CACHE_IMAGE_NAME} -f Dockerfile -t ${IMAGE_NAME} .

## Push to Docker Hub
## Docker login
for i in {1..10}
do
    echo "Docker login the ${i} time"
    DOCKER_LOGIN_SUCCESS=$(sudo docker login -u ${DOCKERHUB_USERNAME} -p ${DOCKERHUB_PASSWORD} ${DOCKERHUB_REGISTRY} | grep "Login Succeeded" || true )

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
sudo docker tag ${IMAGE_NAME}:latest ${REPOSITORY_DOCKER_HUB}${IMAGE_NAME}
sudo docker push ${REPOSITORY_DOCKER_HUB}${IMAGE_NAME}

## Remove images after push
sudo docker rmi ${IMAGE_NAME} || true
sudo docker rmi ${REPOSITORY_DOCKER_HUB}${IMAGE_NAME} || true