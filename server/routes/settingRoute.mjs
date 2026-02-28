import { Router } from "express";
import {
    getAdminProfile,
    getSettingDetails,
    changePassword,
    updateDiscountedPercentage,
} from "../controllers/adminSettingController.mjs";
import adminAuth from "../middleware/adminAuth.js";

const router = Router();

const routeValue = "/api/setting/";

// Check WhatsApp configuration status
router.get(`/whatsapp-status`, (req, res) => {
    const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
    const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const OWNER_WHATSAPP_NUMBER = process.env.OWNER_WHATSAPP_NUMBER;

    const isConfigured = WHATSAPP_TOKEN && WHATSAPP_TOKEN !== "" && 
                        WHATSAPP_PHONE_NUMBER_ID && WHATSAPP_PHONE_NUMBER_ID !== "" &&
                        OWNER_WHATSAPP_NUMBER && OWNER_WHATSAPP_NUMBER !== "";

    res.json({
        success: true,
        configured: isConfigured,
        message: isConfigured 
            ? "WhatsApp is configured" 
            : "WhatsApp is not configured. Please add WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, and OWNER_WHATSAPP_NUMBER in .env file",
    });
});

// Admin Setting routes
router.get(`${routeValue}details`, adminAuth, getAdminProfile);
router.get(`${routeValue}list`, adminAuth, getSettingDetails);

// Admin Setting routes
router.put(`${routeValue}change-password`, adminAuth, changePassword);
router.put(`${routeValue}update-discounted-percentage`, adminAuth, updateDiscountedPercentage);

export default router;
