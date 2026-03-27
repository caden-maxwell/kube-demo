// This file is used to inject K8s environment variables into the frontend application at runtime
// It will be renamed to config.js during container startup
// Be sure to update /src/types/globals.d.ts when adding new variables here

window.APP_CONFIG = {
    API_BASE_URL: "${API_BASE_URL}"
}
