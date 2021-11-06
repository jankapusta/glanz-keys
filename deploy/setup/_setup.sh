#!/usr/bin/env bash

echo "Setting up new configuration named: ${NAME}"
echo "  - with project: ${PROJECT}"
echo "  - with cluster: ${CLUSTER}"
echo "  - with namespace: ${NAMESPACE}"

echo "Enter your account login which you used in 'gcloud auth login' command (e.g. peter@gmail.com):"
read ACCOUNT_LOGIN

#Create gcloud configuration
gcloud config configurations delete ${NAME}
gcloud config configurations create ${NAME}
gcloud config set account ${ACCOUNT_LOGIN}
gcloud config set project ${PROJECT}
gcloud config set compute/region ${REGION}
gcloud config set compute/zone ${ZONE}

#Setup user/auth for the cluster for kubectl (it also switches the context)
gcloud container clusters get-credentials ${CLUSTER}

#Rename current kubectl context to human readable one
kubectl config delete-context ${NAME}
kubectl config rename-context $(kubectl config current-context) ${NAME}

#Set default namespace so you do not repeat it later
kubectl config set-context ${NAME} --namespace=${NAMESPACE}

echo "Setup done"