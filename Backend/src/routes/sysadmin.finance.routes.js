import express from "express";
import protect from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { getFinancialData, updateFinanceSettings, processRefund, processPayout, runReconciliation, exportReport } from "../controllers/sysadmin.finance.controller.js";

const router = express.Router();

router.use(protect, authorizeRoles("system_admin", "admin", "super_admin"));

router.get("/", getFinancialData);
router.put("/settings", updateFinanceSettings);
router.post("/refund", processRefund);
router.post("/refund/:id", processRefund);
router.post("/payout", processPayout);
router.post("/payout/:id", processPayout);
router.post("/reconcile", runReconciliation);
router.post("/export", exportReport);

export default router;
