import express from "express";
import upload from "../middlewares/upload.js";
import { managerSignup } from "../controllers/manager.controller.js";

const router = express.Router();

router.post(
  "/signup",
  upload.fields([
    { name: "govId", maxCount: 1 },
    { name: "businessLicense", maxCount: 1 },
  ]),
  managerSignup
);

export default router;
