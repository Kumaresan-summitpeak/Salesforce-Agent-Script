import env from "../config/env.js";
import axios from "axios";

const { ACCESS_TOKEN, REFRESH_TOKEN, CLIENT_SECRET, CLIENT_ID,
    MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET, MICROSOFT_ACCESS_TOKEN, MICROSOFT_REFRESH_TOKEN } = env;

let accessToken = ACCESS_TOKEN;
let refreshToken = REFRESH_TOKEN;

let microsoftAccessToken = MICROSOFT_ACCESS_TOKEN;
let microsoftRefreshToken = MICROSOFT_REFRESH_TOKEN;

export const TokenManager = {
    getAccessToken() {
        return accessToken;
    },

    setAccessToken(token) {
        accessToken = token;
    },

    async refreshAccessToken() {

        const response = await axios.post(
            'https://login.salesforce.com/services/oauth2/token',
            new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                refresh_token: refreshToken,
            }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );

        accessToken = response.data.access_token;
        return accessToken;
    }
};


export const MicrosoftTokenManager = {
    getAccessToken() {
        return microsoftAccessToken;
    },

    setAccessToken(token) {
        microsoftAccessToken = token;
    },

    async refreshAccessToken() {
        try {
            const params = new URLSearchParams({
                client_id: MICROSOFT_CLIENT_ID,
                scope: "https://graph.microsoft.com/.default",
                refresh_token: microsoftRefreshToken,
                grant_type: "refresh_token",
                client_secret: MICROSOFT_CLIENT_SECRET
            });

            const response = await axios.post(
                `https://login.microsoftonline.com/common/oauth2/v2.0/token`,
                params,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            microsoftAccessToken = response.data.access_token;
            microsoftRefreshToken = response.data.refresh_token; // Optional: Update if changed

            return microsoftAccessToken;
        } catch (error) {
            console.error("Microsoft Token Refresh Error:", error.response?.data || error.message);
            throw error;
        }
    }
};