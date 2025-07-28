import microsoftApi from "../microsoftAxios.js";
import axiosClient from "../axios.js"; // Salesforce Axios instance

// Fetch full email message
const fetchEmailMessage = async (messageId) => {
    const response = await microsoftApi.get(`/me/messages/${messageId}`);
    return response.data;
};

// Create a new Salesforce lead
const createSalesforceLead = async (data) => {
    const response = await axiosClient.post("/sobjects/Lead", data);
    return response.data;
};

export const createOutlookNotification = async (req, res) => {
    try {
        const { validationToken } = req.query;

        if (validationToken) {
            return res.status(200).send(validationToken);
        }

        const notifications = req.body?.value || [];

        for (const notification of notifications) {
            const messageId = notification?.resourceData?.id;

            if (messageId) {
                const email = await fetchEmailMessage(messageId);

                const leadData = {
                    LastName: email.from?.emailAddress?.name || "Outlook User",
                    Company: email.from?.emailAddress?.address || "Unknown Company",
                    Email: email.from?.emailAddress?.address,
                    Description: `New lead from Outlook email:\nSubject: ${email.subject}\nBody: ${email.bodyPreview}`
                };

                console.log("leadData:", leadData)
                const result = await createSalesforceLead(leadData);

                console.log("✅ Lead created in Salesforce:", result.id);
            }
        }

        return res.status(202).end();
    } catch (error) {
        console.error("Outlook Notification Error:", error?.response?.data || error.message);
        return res.status(500).json({
            status: false,
            message: error?.response?.data?.[0]?.message || error.message,
        });
    }
};
