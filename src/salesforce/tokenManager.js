import env from "../config/env.js";
import axios from "axios";

const { ACCESS_TOKEN, REFRESH_TOKEN, CLIENT_SECRET, CLIENT_ID } = env;

let accessToken = ACCESS_TOKEN;
let refreshToken = REFRESH_TOKEN;

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
                client_id: CLIENT_SECRET,
                client_secret: CLIENT_ID,
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
