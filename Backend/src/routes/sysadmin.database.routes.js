import express from "express";
import protect from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { 
    getDatabaseData, 
    optimizeQuery, 
    createIndex, 
    runMigration, 
    archiveData, 
    validateIntegrity,
    generateExecutionPlan,
    rebuildIndex,
    getMigrationDetails
} from "../controllers/sysadmin.database.controller.js";

const router = express.Router();

// Apply auth and role protection
router.use(protect, authorizeRoles("system_admin", "admin", "super_admin"));

router.get("/", getDatabaseData);
router.post("/optimize/:id", optimizeQuery);
router.post("/index", createIndex);
router.post("/index/rebuild", rebuildIndex);
router.post("/migration", runMigration);
router.get("/migration/:id", getMigrationDetails);
router.post("/archive", archiveData);
router.post("/integrity", validateIntegrity);
router.post("/analysis-plans", generateExecutionPlan);

export default router;
