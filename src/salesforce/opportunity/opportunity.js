import axiosClient from "../axios.js";

export const getOpportunityDetails = async (req, res) => {
    try {
        const { name, id } = req.query;

        if (!name && !id) {
            return res.status(400).json({ status: false, message: "Opportunity name or id is required" });
        }

        let query;
        if (id) {
            query = `SELECT Id, Name, StageName, CloseDate, Amount FROM Opportunity WHERE Id = '${id}' LIMIT 1`;
        } else {
            query = `SELECT Id, Name, StageName, CloseDate, Amount FROM Opportunity WHERE Name LIKE '%${name}%' LIMIT 1`;
        }

        const encodedQuery = encodeURIComponent(query);
        const response = await axiosClient.get(`/query?q=${encodedQuery}`);

        if (!response.data.records.length) {
            return res.status(404).json({ status: false, message: "Opportunity not found" });
        }

        return res.json({ status: true, opportunity: response.data.records[0] });
    } catch (error) {
        console.error("Error fetching opportunity details:", error?.response?.data || error.message);
        return res.status(500).json({ status: false, message: error?.response?.data?.[0]?.message || error.message });
    }
};



export const updateOpportunityStageByNameOrId = async (req, res) => {
    try {
        const { name, opportunityId, stageName } = req.body;

        if (!stageName || (!name && !opportunityId)) {
            return res.status(400).json({
                status: false,
                message: "Provide either opportunityId or name along with stageName",
            });
        }

        let targetId = opportunityId;

        // Step 1: If ID not given, search by name
        if (!targetId) {
            const query = `SELECT Id FROM Opportunity WHERE Name LIKE '%${name}%' LIMIT 1`;
            const encodedQuery = encodeURIComponent(query);
            const result = await axiosClient.get(`/query?q=${encodedQuery}`);

            const record = result.data.records?.[0];
            if (!record) {
                return res.status(404).json({
                    status: false,
                    message: `Opportunity with name "${name}" not found`,
                });
            }

            targetId = record.Id;
        }

        // Step 2: Update the Opportunity stage
        await axiosClient.patch(`/sobjects/Opportunity/${targetId}`, {
            StageName: stageName,
        });

        return res.json({
            status: true,
            message: "Opportunity stage updated successfully",
            opportunityId: targetId,
            updatedStage: stageName,
        });

    } catch (error) {
        console.error("Error updating opportunity:", error?.response?.data || error.message);
        return res.status(500).json({
            status: false,
            message: error?.response?.data?.[0]?.message || error.message,
        });
    }
};



export const closeOpportunityByName = async (req, res) => {
    try {
        const { name, stageName = "Closed Won", closeDate } = req.body;

        if (!name) {
            return res.status(400).json({ status: false, message: "Opportunity name is required" });
        }

        // Step 1: Find Opportunity by Name
        const query = `SELECT Id, Name FROM Opportunity WHERE Name LIKE '%${name}%' LIMIT 1`;
        const encodedQuery = encodeURIComponent(query);

        const searchRes = await axiosClient.get(`/query?q=${encodedQuery}`);
        const opportunity = searchRes.data.records?.[0];

        if (!opportunity) {
            return res.status(404).json({ status: false, message: `No Opportunity found with name "${name}"` });
        }

        const opportunityId = opportunity.Id;

        // Step 2: Update Opportunity Stage to Closed
        const payload = {
            StageName: stageName,
            CloseDate: closeDate || new Date().toISOString().split("T")[0], // default: today
        };

        await axiosClient.patch(`/sobjects/Opportunity/${opportunityId}`, payload);

        return res.json({
            status: true,
            message: `Opportunity "${opportunity.Name}" updated to ${stageName}`,
            opportunityId,
            updatedFields: payload,
        });

    } catch (error) {
        console.error("Close Opportunity Error:", error?.response?.data || error.message);
        return res.status(500).json({
            status: false,
            message: error?.response?.data?.[0]?.message || error.message,
        });
    }
};

