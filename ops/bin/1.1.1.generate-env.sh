#!/bin/bash
set -e
set -x
VAR_FILE="ops/bin/vars.properties"
source ${VAR_FILE}

# ## Environmentfile Generation
# rm -rf .env || true
# cp .env-template .env
# sed -i "s/{ENV}/${ENV}/g" .env
# sed -i "s/environment/${ENV}/g" .env

# rm -rf tmpfile || true
# grep -o "{.*}" .env >> tmpfile

# for TEMP in $(cat tmpfile);
# do
# KEYNAME=`echo ${TEMP} | cut -f 1 -d '}'| cut -f 2 -d '{' |cut -f 2 -d '.'`
# VALUE=`aws ssm get-parameters --name "/${ENV}/${KEYNAME}"  --with-decryption --region ${REGION} --profile ${PROFILE} --output text | awk '{print $6}'`
# sed -i "s/${TEMP}/${VALUE}/g" .env
# done

mv .env-${ENV} .env
cat .env || true
