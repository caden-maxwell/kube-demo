#!/bin/sh

# This file gets executed as part of the container startup process; it
# injects runtime env vars defined by k8s into the config.js file

NGINX_ROOT=/usr/share/nginx/html
envsubst < $NGINX_ROOT/config.template.js > $NGINX_ROOT/config.js
