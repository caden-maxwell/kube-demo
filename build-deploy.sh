#!/usr/bin/env bash
# build-deploy.sh - Builds API or web Docker image and upgrades Helm release

minikube status > /dev/null
rc=$?
if (( ($rc & 1) != 0 )); then
    echo Minikube is not up!
    exit 1
fi

IMAGE_TAG=$1
HELM_RELEASE=demo
CHART_PATH=./helm
IMAGE_TYPE=$2

if [[ -z "$IMAGE_TAG" || -z "$IMAGE_TYPE" ]]; then
    echo "Usage: $0 <image-tag> <[web|api]>"
    exit 1
fi

IMAGE_REPO=demo-$IMAGE_TYPE

# Use minikube's docker environment
eval $(minikube -p minikube docker-env)

# Check if image tag already exists locally
if [[ -n "$(docker images -q ${IMAGE_REPO}:${IMAGE_TAG})" ]]; then
    echo "Error: Docker image tag '${IMAGE_TAG}' already exists locally."
    echo "Please bump the version before building."
    exit 1
fi

echo "Building Docker image ${IMAGE_REPO}:${IMAGE_TAG}"
docker build -t ${IMAGE_REPO}:${IMAGE_TAG} ${IMAGE_REPO}

# Update tag in helm values
echo "Updating Helm values for image ${IMAGE_REPO}:${IMAGE_TAG}"
section=$( [ "$IMAGE_TYPE" = "web" ] && echo "frontend" || echo "backend" )
yq -iy ".${section}.image.tag = \"${IMAGE_TAG}\"" ${CHART_PATH}/values.yaml

echo "Upgrading Helm release ${HELM_RELEASE} with image tag ${IMAGE_TAG}"
helm upgrade ${HELM_RELEASE} ${CHART_PATH}

echo "Deployment complete. New pods will be rolled out with image ${IMAGE_TAG}"
