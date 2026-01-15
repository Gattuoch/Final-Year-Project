import express from "express";
import { 
  register, 
  login, 
  verifyOTP, 
  createInternalUser, 
  logout 
} from "../controllers/authController.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.js"; 

const router = express.Router();

// ✅ Use .fields to accept both "license" and "govId"
router.post("/register", upload.fields([
  { name: "license", maxCount: 1 },
  { name: "govId", maxCount: 1 }
]), register);

router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/create-internal", verifyToken, isAdmin, createInternalUser);
router.post("/logout", verifyToken, logout);

export default router;