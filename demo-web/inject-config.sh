#!/bin/sh

# This file gets executed as part of the container startup process; it
# injects runtime env vars into config.js

if [ -z "$CONF_TMP_DIR" ]; then
  echo "Error: CONF_TMP_DIR environment variable is not set."
  exit 1
fi

: ${CONF_OUT_DIR:=$CONF_TMP_DIR}

envsubst < $CONF_TMP_DIR/config.template.js > $CONF_OUT_DIR/config.js

echo Configuration injected into $CONF_OUT_DIR/config.js
echo Rendered config.js:
cat $CONF_OUT_DIR/config.js
