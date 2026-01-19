import express from "express";
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  cancelBooking,
} from "../controllers/booking.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";
import Booking from "../models/Booking.model.js";

const router = express.Router();

// ✅ Create a new booking
router.post("/", verifyToken, createBooking);

// ✅ Get logged-in user's bookings
router.get("/my-bookings", verifyToken, getMyBookings);

// ✅ Admin: Get ALL bookings
router.get("/all", verifyToken, isAdmin, getAllBookings);

// ✅ Cancel a booking
router.patch("/:id/cancel", verifyToken, cancelBooking);

// ✅ Get bookings for a specific tent (Availability Check)
router.get("/tent/:tentId", verifyToken, async (req, res) => {
  try {
    const { tentId } = req.params;
    
    // Return engaged dates to help frontend disable calendar days
    const bookings = await Booking.find({
      tentId,
      status: { $in: ["confirmed", "pending", "paid"] } 
    }).select("checkInDate checkOutDate status");

    return res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Failed to fetch tent bookings." });
  }
});

export default router;