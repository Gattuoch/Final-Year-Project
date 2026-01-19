import Booking from "../models/Booking.model.js";
import Tent from "../models/Tent.model.js";
import Camp from "../models/Camp.model.js";
import * as emailService from "../services/email.service.js";

// ✅ CREATE BOOKING (Step 1 of Flow)
export const createBooking = async (req, res) => {
  try {
    const { tentId, checkIn, checkOut, guests, idDocumentUrl } = req.body;
    const camperId = req.user.id; // From middleware

    // 1. Validate Dates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // Basic format check
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ success: false, error: "Invalid date format." });
    }

    // Constraint: Check-in cannot be in the past
    // We normalize 'start' to midnight to ignore the exact time the user clicked
    const startNormalized = new Date(start);
    startNormalized.setHours(0, 0, 0, 0);

    if (startNormalized < today) {
      return res.status(400).json({ success: false, error: "Check-in date cannot be in the past." });
    }

    // Constraint: Check-out must be strictly after Check-in
    if (end <= start) {
      return res.status(400).json({ success: false, error: "Check-out date must be after check-in date." });
    }

    // 2. Fetch Tent & Camp
    const tent = await Tent.findById(tentId);
    if (!tent) return res.status(404).json({ success: false, error: "Tent not found." });

    const camp = await Camp.findById(tent.campId);
    if (!camp) return res.status(404).json({ success: false, error: "Camp not found." });

    // 3. Availability Check (Prevent Overlapping)
    const existingBooking = await Booking.findOne({
      tentId,
      status: { $in: ["confirmed", "pending", "paid"] }, // Exclude cancelled/expired
      $or: [
        { checkInDate: { $lt: end }, checkOutDate: { $gt: start } } // Overlap logic
      ]
    });

    if (existingBooking) {
      return res.status(409).json({ success: false, error: "This tent is already booked for these dates." });
    }

    // 4. Calculate Price (ETB)
    const oneDay = 1000 * 60 * 60 * 24;
    const nights = Math.ceil((end - start) / oneDay);
    const totalPrice = nights * tent.pricePerNight; // Assumes pricePerNight is in ETB

    // 5. Create Booking (Status: Unpaid/Pending)
    const newBooking = new Booking({
      camperId,
      tentId,
      campId: camp._id,
      checkInDate: start,
      checkOutDate: end,
      guests,
      totalPrice,
      idDocumentUrl,
      status: "pending",
      paymentStatus: "unpaid"
    });

    // Set grace period for payment
    newBooking.setGracePeriods();
    
    await newBooking.save();

    // 6. Return response
    // We populate minimal fields to return to frontend
    await newBooking.populate("tentId", "name");
    
    return res.status(201).json({ 
      success: true, 
      message: "Booking initiated. Please complete payment.",
      booking: newBooking 
    });

  } catch (err) {
    console.error("Create Booking Error:", err);
    res.status(500).json({ success: false, error: "Server error during booking creation." });
  }
};

// ✅ GET ALL BOOKINGS (Admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("camperId", "fullName email")
      .populate("tentId", "name pricePerNight")
      .populate("campId", "name location")
      .sort({ createdAt: -1 });
      
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch bookings." });
  }
};

// ✅ GET MY BOOKINGS (Camper)
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ camperId: req.user.id })
      .populate("tentId", "name pricePerNight images")
      .populate("campId", "name location")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch your bookings." });
  }
};

// ✅ CANCEL BOOKING
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, error: "Booking not found." });

    // Authorization: Owner or Admin
    if (booking.camperId.toString() !== req.user.id && req.user.role !== "super_admin") {
      return res.status(403).json({ success: false, error: "Not authorized." });
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    booking.cancelReason = req.body.reason || "Cancelled by user";
    
    await booking.save();

    res.json({ success: true, message: "Booking cancelled successfully." });
  } catch (err) {
    console.error("Cancel Error:", err);
    res.status(500).json({ success: false, error: "Failed to cancel booking." });
  }
};