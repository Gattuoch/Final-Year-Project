import express from "express";
import protect from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
    getLogs,
    searchLogs,
    manageAlert,
    deleteAlert,
    toggleAlertStatus
} from "../controllers/sysadmin.logs.controller.js";

const router = express.Router();

router.use(protect, authorizeRoles("system_admin", "super_admin"));

router.get("/", getLogs);
router.post("/search", searchLogs);
router.post("/alert", manageAlert);
router.delete("/alert/:id", deleteAlert);
router.patch("/alert/toggle/:id", toggleAlertStatus);

export default router;
