import express from "express";
const router = express.Router()

import { createSalesFroceLead, updateSalesforceLead } from "../salesforce/leads/lead.js";
import { getOpportunityDetails, updateOpportunityStageByNameOrId, closeOpportunityByName } from "../salesforce/opportunity/opportunity.js";
import { lookupAccount } from "../salesforce/accounts/account.js";
import { getSalesforceReportByName } from "../salesforce/reports/report.js";
import { createOutlookNotification } from "../salesforce/outlookMails/createNotification.js";

// Leads router
router.post("/create-lead", createSalesFroceLead)
router.patch("/update-lead", updateSalesforceLead)


// Opportunity router
router.get("/opportunity", getOpportunityDetails)
router.patch("/update-opportunity-stage", updateOpportunityStageByNameOrId)
router.patch("/close-opportunity", closeOpportunityByName)

// Accounts router
router.get("/accounts", lookupAccount)

// Reports router
router.get("/reports", getSalesforceReportByName)

router.post("/notifications", createOutlookNotification)


export default router;

