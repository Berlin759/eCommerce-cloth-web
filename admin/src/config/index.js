// Admin Configuration
const ENV = import.meta.env.MODE || "development";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const CLIENT_URL = import.meta.env.VITE_CLIENT_BASE_URL;
const ADMIN_URL = import.meta.env.VITE_ADMIN_BASE_URL;

const config = {
    development: {
        API_BASE_URL: API_URL,
        CLIENT_BASE_URL: CLIENT_URL,
        ADMIN_BASE_URL: ADMIN_URL,
        NODE_ENV: "development",
        DEBUG: true,
        LOG_LEVEL: "debug",
    },
    production: {
        API_BASE_URL: API_URL,
        CLIENT_BASE_URL: CLIENT_URL,
        ADMIN_BASE_URL: ADMIN_URL,
        NODE_ENV: "production",
        DEBUG: false,
        LOG_LEVEL: "error",
    },
};

// Export the configuration based on current environment
const currentConfig = config[ENV] || config.development;

export const {
    API_BASE_URL,
    CLIENT_BASE_URL,
    ADMIN_BASE_URL,
    NODE_ENV,
    DEBUG,
    LOG_LEVEL,
} = currentConfig;

// Legacy support for existing serverUrl import
export const serverUrl = API_BASE_URL;

// Environment check utilities
export const isDevelopment = ENV === "development";
export const isProduction = ENV === "production";

// Logger utility
export const logger = {
    debug: (...args) => {
        if (DEBUG) {
            console.log("[DEBUG]", ...args);
        }
    },
    info: (...args) => {
        if (DEBUG || LOG_LEVEL === "info") {
            console.info("[INFO]", ...args);
        }
    },
    warn: (...args) => {
        console.warn("[WARN]", ...args);
    },
    error: (...args) => {
        console.error("[ERROR]", ...args);
    },
};

export default currentConfig;
