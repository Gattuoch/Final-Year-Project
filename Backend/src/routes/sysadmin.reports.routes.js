import express from "express";
import protect from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { 
    getReportsData, 
    generateReport, 
    sendAlert, 
    createAlertTemplate,
    sendReport,
    exportReport,
    generateShareLink,
    getSharedReport,
    createSchedule,
    updateScheduleStatus,
    deleteSchedule,
    updateAlertTemplate,
    deleteAlertTemplate
} from "../controllers/sysadmin.reports.controller.js";

const router = express.Router();

// Public route for shared reports (must be before auth middleware)
router.get("/shared/:hash", getSharedReport);

router.use(protect, authorizeRoles("system_admin", "admin", "super_admin"));

router.get("/", getReportsData);
router.post("/generate/:id", generateReport);
router.post("/send", sendReport);
router.get("/export/:id", exportReport);
router.post("/share/:id", generateShareLink);

// Scheduling
router.post("/schedule", createSchedule);
router.patch("/schedule/:id/status", updateScheduleStatus);
router.delete("/schedule/:id", deleteSchedule);

// Alerts & Templates
router.post("/alert", sendAlert);
router.post("/alert-template", createAlertTemplate);
router.patch("/alert-template/:id", updateAlertTemplate);
router.delete("/alert-template/:id", deleteAlertTemplate);

export default router;

