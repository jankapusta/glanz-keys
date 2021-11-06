#!/usr/bin/env bash

set -e

NAMESPACE=glanz-production
PROJECT=jans-sandbox
BASE_NAME=nginx-proxy

LAST_COMMIT=`git rev-parse --short HEAD`
NGINX_IMAGE=gcr.io/${PROJECT}/${NAMESPACE}-${BASE_NAME}:cmt${LAST_COMMIT}

NGINX_IF=./nginx/host-glanz.conf
NGINX_OF=./nginx/host-glanz-ready.conf
eval "cat ${NGINX_IF} > ${NGINX_OF}"
docker build -t ${NGINX_IMAGE} --platform linux/x86_64 ./nginx/
docker -- push ${NGINX_IMAGE}
rm ${NGINX_OF}

eval "echo \"$(cat ./deploy/kube.nginx.yaml)\"" | kubectl apply --record --namespace=${NAMESPACE} -f -
