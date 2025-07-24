import axiosClient from "../axios.js";

export const lookupAccount = async (req, res) => {
    try {
        const { search } = req.query;

        if (!search) {
            return res.status(400).json({ status: false, message: "Search parameter is required" });
        }

        const escapedSearch = search.replace(/'/g, "\\'"); // escape single quotes
        const query = `
            SELECT Id, Name, BillingCity, BillingCountry, Phone, Industry
            FROM Account 
            WHERE Name LIKE '%${escapedSearch}%' 
            OR Phone LIKE '%${escapedSearch}%'
            LIMIT 10
        `.trim();

        const encodedQuery = encodeURIComponent(query);
        const response = await axiosClient.get(`/query?q=${encodedQuery}`);

        return res.json({
            status: true,
            records: response.data.records
        });

    } catch (error) {
        console.error("Account Lookup Error:", error?.response?.data || error.message);
        return res.status(500).json({
            status: false,
            message: error?.response?.data?.[0]?.message || error.message
        });
    }
};
