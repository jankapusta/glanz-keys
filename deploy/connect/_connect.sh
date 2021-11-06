#!/usr/bin/env bash

gcloud config configurations activate ${NAME}
kubectl config use-context  ${NAME}