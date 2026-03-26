#!/bin/sh

# This file gets executed as part of the container startup process; it
# injects runtime env vars defined by k8s into the config.js file

NGINX_ROOT=/usr/share/nginx/html
envsubst < $NGINX_ROOT/config.js > $NGINX_ROOT/config.js.tmp
mv $NGINX_ROOT/config.js.tmp $NGINX_ROOT/config.js
rm -f $NGINX_ROOT/config.js.tmp
