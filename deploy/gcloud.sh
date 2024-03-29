#!/usr/bin/env bash

# for script to fail if any other command fail
set -e

PROJECT=jans-sandbox
ENVIRONMENT=production
BASE_NAME=keys
NAMESPACE=glanz-production

GLANZ_MONGO_PORT=27017
GLANZ_MONGO_HOST=mongo.storage

LAST_COMMIT=`git rev-parse --short HEAD`
PORT=3000
NODE_ENV=${ENVIRONMENT}

CONTAINER_IMAGE=gcr.io/${PROJECT}/glanz-${ENVIRONMENT}-${BASE_NAME}:v${LAST_COMMIT}

# Build image
docker build --build-arg node_env=${NODE_ENV} -t ${CONTAINER_IMAGE} --platform linux/x86_64 .
docker push ${CONTAINER_IMAGE}

IF=./deploy/kube.app.yaml
OF=./deploy/kube.app-ready.yaml
eval "echo \"$(cat ${IF})\" > ${OF}"
kubectl apply --record --namespace=${NAMESPACE} -f ${OF}
rm ${OF}
