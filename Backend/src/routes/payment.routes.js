import express from "express";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";
import {
  initiatePayment,
  verifyPayment,
  completeStay,
  handleAbuse,
} from "../controllers/payment.controller.js";

const router = express.Router();

// Camper initiates a payment (prepaid/postpaid/cash)
router.post("/initiate/:bookingId", verifyToken, initiatePayment);

// Verify payment after Chapa callback
router.get("/verify/:bookingId", verifyToken, verifyPayment);

// Manager/Admin confirms stay completion
router.patch("/complete/:bookingId", verifyToken, isAdmin, completeStay);

// Admin manually applies penalties (no-show or abuse)
router.post("/penalty", verifyToken, isAdmin, handleAbuse);

export default router;
