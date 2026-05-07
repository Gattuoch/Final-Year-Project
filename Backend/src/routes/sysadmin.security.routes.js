import express from "express";
import protect from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { 
  getSecurityData, 
  updatePasswordPolicy, 
  blockIP, 
  unblockIP,
  resolveIncident,
  deleteIncident,
  scheduleScan,
  deleteScan
} from "../controllers/sysadmin.security.controller.js";

const router = express.Router();

router.use(protect, authorizeRoles("system_admin", "admin", "super_admin"));

router.get("/", getSecurityData);
router.put("/policy", updatePasswordPolicy);
router.post("/ip", blockIP);
router.post("/ip/unblock", unblockIP);
router.put("/incidents/:id/resolve", resolveIncident);
router.delete("/incidents/:id", deleteIncident);
router.post("/scans", scheduleScan);
router.delete("/scans/:id", deleteScan);

export default router;
