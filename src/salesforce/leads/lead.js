import axiosClient from "../axios.js";


export const createSalesFroceLead = async (req, res) => {
    try {

        const data = req.body;
        const response = await axiosClient.post("/sobjects/Lead", data);
        return res.status(200).json({ status: true, statusCode: 200, message: "Lead created successfully.", data: response.data });
    } catch (error) {
        console.error("Error in crearting lead:", error)
        return res.status(500).json({ status: false, statusCode: 500, message: error.message })
    }
}


export const updateSalesforceLead = async (req, res) => {
    try {
        const { email, company, updateFields } = req.body;

        // 1. Search lead by Email or Company
        const query = `SELECT Id FROM Lead WHERE ${email ? `Email = '${email}'` : `Company = '${company}'`} LIMIT 1`;
        const encodedQuery = encodeURIComponent(query);
        const searchResponse = await axiosClient.get(`/query?q=${encodedQuery}`);

        if (!searchResponse.data.records.length) {
            return res.status(404).json({ status: false, message: "Lead not found" });
        }

        const leadId = searchResponse.data.records[0].Id;

        // 2. Update lead by ID
        await axiosClient.patch(`/sobjects/Lead/${leadId}`, updateFields);

        return res.status(200).json({ status: true, message: "Lead updated successfully", data: leadId });
    } catch (error) {
        console.error("Error updating lead qualification:", error?.response?.data || error.message);
        return res.status(500).json({
            status: false,
            message: error?.response?.data?.[0]?.message || error.message,
        });
    }
};
