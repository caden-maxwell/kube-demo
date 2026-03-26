// This file is used to inject K8s environment variables into the frontend application at runtime
// Be sure to update /src/types/globals.d.ts adding new variables here

window.APP_CONFIG = {
    API_BASE_URL: "${API_BASE_URL}"
}
