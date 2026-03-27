const runtimeConfig = window.APP_CONFIG;

export const API_BASE_URL =
  runtimeConfig?.API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL
