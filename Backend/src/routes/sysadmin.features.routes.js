import express from "express";
import protect from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
    getFeaturesData,
    toggleFeature,
    deployFeature,
    startABTest,
    stopABTest,
    applyUpdates,
    createFeatureFlag,
    deleteABTest,
    editFeatureFlag,
    deleteFeatureFlag,
    editABTest,
    editUpdate,
    deleteUpdate,
    createUpdate
} from "../controllers/sysadmin.features.controller.js";

const router = express.Router();

router.use(protect, authorizeRoles("system_admin", "admin", "super_admin"));

router.get("/", getFeaturesData);
router.post("/", createFeatureFlag);
router.put("/flag/:id", editFeatureFlag);
router.delete("/flag/:id", deleteFeatureFlag);
router.post("/toggle/:id", toggleFeature);
router.post("/deploy", deployFeature);
router.post("/abtest/start", startABTest);
router.put("/abtest/:id", editABTest);
router.post("/abtest/stop/:id", stopABTest);
router.delete("/abtest/:id", deleteABTest);
router.post("/updates", createUpdate);
router.put("/updates/:id", editUpdate);
router.delete("/updates/:id", deleteUpdate);

export default router;

