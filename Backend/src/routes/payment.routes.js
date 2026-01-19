import express from "express";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";
import {
  initializeChapaPayment, // Changed from initiatePayment
  createStripeIntent,     // New
  verifyPayment,
  completeStay,
  handleAbuse,
  stripeWebhook,
} from "../controllers/payment.controller.js";

const router = express.Router();

// ✅ NEW: Specific endpoints for Frontend (matches NewBooking.js)
router.post("/chapa-init", verifyToken, initializeChapaPayment);
router.post("/create-intent", verifyToken, createStripeIntent);

// Verify payment after Chapa callback
router.get("/verify/:bookingId", verifyPayment); // Token optional for callback

// Stripe webhook (Raw body required)
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// Manager/Admin Admin routes (Restored)
router.patch("/complete/:bookingId", verifyToken, isAdmin, completeStay);
router.post("/penalty", verifyToken, isAdmin, handleAbuse);

export default router;