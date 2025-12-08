import express from "express";
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  cancelBooking,
} from "../controllers/booking.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Camper/Manager can create booking
router.post("/", verifyToken, createBooking);

// Camper: get their bookings
router.get("/my", verifyToken, getMyBookings);

// Admin: see all bookings
router.get("/", verifyToken, isAdmin, getAllBookings);

// Cancel booking
router.patch("/:id/cancel", verifyToken, cancelBooking);

export default router;
