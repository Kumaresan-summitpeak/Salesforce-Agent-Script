import dotenv from "dotenv";
dotenv.config()

const environmentVariables = {
    PORT: process?.env?.PORT ?? 3000,
    SALESFORCE_BASE_URL: process?.env?.SALESFORCE_BASE_URL,
    ACCESS_TOKEN: process?.env?.ACCESS_TOKEN,
    REFRESH_TOKEN: process?.env?.REFRESH_TOKEN,
    CLIENT_ID: process?.env?.CLIENT_ID,
    CLIENT_SECRET: process?.env?.CLIENT_SECRET
}


export default environmentVariables;