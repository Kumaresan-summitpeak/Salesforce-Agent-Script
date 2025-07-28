// services/microsoftApi.js
import axios from "axios";
import { MicrosoftTokenManager } from "./tokenManager.js";

const microsoftApi = axios.create({
    baseURL: "https://graph.microsoft.com/v1.0"
});

// Request interceptor: Attach access token
microsoftApi.interceptors.request.use(
    async config => {
        const token = MicrosoftTokenManager.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor: Refresh token on 401
microsoftApi.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await MicrosoftTokenManager.refreshAccessToken();
                MicrosoftTokenManager.setAccessToken(newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return microsoftApi(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default microsoftApi;
