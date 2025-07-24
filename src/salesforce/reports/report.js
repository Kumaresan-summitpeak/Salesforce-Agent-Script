import axiosClient from "../axios.js";

export const getSalesforceReportByName = async (req, res) => {
    try {
        const { reportName } = req.query;

        if (!reportName) {
            return res.status(400).json({ status: false, message: "Missing reportName in query." });
        }

        // 1. Fetch list of available reports
        const reportsResponse = await axiosClient.get(`/analytics/reports`);
        const reports = reportsResponse?.data || [];

        // 2. Find the report by name (case-insensitive)
        const matchedReport = reports.find(
            (report) => report.name?.toLowerCase() === reportName.toLowerCase()
        );

        if (!matchedReport) {
            return res.status(404).json({ status: false, message: "Report not found by name." });
        }

        // 3. Get detailed report result
        const reportDetailsResponse = await axiosClient.get(
            `/analytics/reports/${matchedReport.id}?includeDetails=true`
        );

        return res.status(200).json({
            status: true,
            message: "Report fetched successfully",
            reportId: matchedReport.id,
            reportName: matchedReport.name,
            data: reportDetailsResponse.data,
        });

    } catch (error) {
        console.error("Error fetching Salesforce report:", error?.response?.data || error.message);
        return res.status(500).json({
            status: false,
            message: error?.response?.data?.[0]?.message || error.message,
        });
    }
};
