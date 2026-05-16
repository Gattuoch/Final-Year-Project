import express from "express";
import { getPublicSettings } from "../controllers/sysadmin.config.controller.js";

const router = express.Router();

// Publicly accessible system settings
router.get("/system", getPublicSettings);

export default router;
