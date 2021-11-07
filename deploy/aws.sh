#!/usr/bin/env bash

# for script to fail if any other command fail
set -e

ENVIRONMENT=production
BASE_NAME=keys
NAMESPACE=${BASE_NAME}-${ENVIRONMENT}

GLANZ_MONGO_PORT=27017
GLANZ_MONGO_HOST=mongo

LAST_COMMIT=`git rev-parse --short HEAD`
PORT=3000
NODE_ENV=${ENVIRONMENT}

CONTAINER_IMAGE=012567118424.dkr.ecr.eu-central-1.amazonaws.com/${BASE_NAME}:v${LAST_COMMIT}

# Build image
docker build --build-arg node_env=${NODE_ENV} -t ${CONTAINER_IMAGE} .
docker push ${CONTAINER_IMAGE}

IF=./kube.db.yaml
OF=./kube.db-ready.yaml
eval "echo \"$(cat ${IF})\" > ${OF}"
kubectl apply --record --namespace=${NAMESPACE} -f ${OF}
rm ${OF}

IF=./kube.app.yaml
OF=./kube.app-ready.yaml
eval "echo \"$(cat ${IF})\" > ${OF}"
kubectl apply --record --namespace=${NAMESPACE} -f ${OF}
rm ${OF}
