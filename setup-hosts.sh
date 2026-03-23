#!/usr/bin/env bash
# setup-hosts.sh - Adds demo host entries to /etc/hosts. This is particularly useful
#   in WSL, where /etc/hosts is regenerated on restart

minikube status > /dev/null
rc=$?
if (( ($rc & 1) != 0 )); then
    echo Minikube is not up!
    exit 1
fi

MINIKUBE_IP=$(minikube ip)
echo $MINIKUBE_IP demo.home | sudo tee -a /etc/hosts
echo $MINIKUBE_IP grafana.home | sudo tee -a /etc/hosts
echo $MINIKUBE_IP prometheus.home | sudo tee -a /etc/hosts
