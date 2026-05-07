import express from "express";
import protect from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
    getBackupData,
    createBackup,
    restoreBackup,
    downloadBackup,
    pitrRestore,
    scheduleRestoreTest,
    initiateDRDrill
} from "../controllers/sysadmin.backup.controller.js";

const router = express.Router();

router.use(protect, authorizeRoles("system_admin", "super_admin"));

router.get("/", getBackupData);
router.post("/", createBackup);
router.post("/restore", restoreBackup);
router.get("/download/:id", downloadBackup);
router.post("/pitr", pitrRestore);
router.post("/test", scheduleRestoreTest);
router.post("/dr-drill", initiateDRDrill);




export default router;
