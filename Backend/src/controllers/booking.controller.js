import Booking from "../models/Booking.model.js";
import Tent from "../models/Tent.model.js";
import Camp from "../models/Camp.model.js";

// ✅ CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const { tentId, startDate, endDate, guests, paymentOption, idDocumentUrl } = req.body;
    const camperId = req.user.id;

    // Check tent validity
    const tent = await Tent.findById(tentId);
    if (!tent) return res.status(404).json({ success: false, error: "Tent not found." });

    // Check if camp is approved using the unified Camp model
    const camp = await Camp.findById(tent.campId);
    if (!camp || camp.status !== "approved") {
      return res.status(403).json({ success: false, error: "Cannot book a tent from an unapproved camp." });
    }

    // Calculate total price
    const nights = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * tent.pricePerNight;

    const booking = new Booking({
      camperId,
      tentId,
      startDate,
      endDate,
      guests,
      totalPrice,
      paymentOption,
      idDocumentUrl,
    });

    // Trigger Grace Period calculation defined in the model
    if (typeof booking.setGracePeriods === 'function') {
      booking.setGracePeriods();
    }

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      booking,
    });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ success: false, error: "Server error during booking." });
  }
};

// ✅ GET ALL BOOKINGS (Admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("camperId", "fullName email")
      .populate("tentId", "name pricePerNight");
    res.json({ success: true, message: "Bookings retrieved successfully.", bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch bookings." });
  }
};

// ✅ GET MY BOOKINGS (Camper)
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ camperId: req.user.id })
      .populate("tentId", "name pricePerNight");
    res.json({ success: true, message: "Your bookings retrieved successfully.", bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch user bookings." });
  }
};

// ✅ CANCEL BOOKING
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, error: "Booking not found." });

    // Check authorization
    if (booking.camperId.toString() !== req.user.id && req.user.role !== "super_admin")
      return res.status(403).json({ success: false, error: "Not authorized to cancel this booking." });

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    booking.cancelReason = req.body.reason || "Cancelled by user";
    
    await booking.save();

    res.json({ success: true, message: "Booking cancelled successfully." });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to cancel booking." });
  }
};