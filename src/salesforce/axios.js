import axios from "axios";
import env from "../config/env.js";
import { TokenManager } from "./tokenManager.js";

const { SALESFORCE_BASE_URL } = env;

const axiosInstance = axios.create({
    baseURL: SALESFORCE_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add Authorization before each request
axiosInstance.interceptors.request.use((config) => {
    const token = TokenManager.getAccessToken();;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Retry on token expiration
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                const newToken = await TokenManager.refreshAccessToken();
                error.config.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(error.config); // Retry original request
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
