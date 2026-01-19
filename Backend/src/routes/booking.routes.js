import express from "express";
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  cancelBooking,
} from "../controllers/booking.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";
import Tent from "../models/tent.model.js";

const router = express.Router();

// Camper/Manager can create booking
router.post("/", verifyToken, createBooking);

// Camper: get their bookings
router.get("/my", verifyToken, getMyBookings);

// Admin: see all bookings
router.get("/", verifyToken, isAdmin, getAllBookings);

// Cancel booking
router.patch("/:id/cancel", verifyToken, cancelBooking);

// Add route to get bookings by tent
router.get("/:tentId", verifyToken, async (req, res) => {
  const { tentId } = req.params;
  const tent = await Tent.findById(tentId).populate("bookings");
  if (!tent)
    return res
      .status(404)
      .json({ success: false, error: "Tent not found." });
  return res.status(200).json({ success: true, data: tent.bookings });
});

export default router;
