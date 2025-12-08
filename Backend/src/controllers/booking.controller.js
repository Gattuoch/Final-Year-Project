import Booking from "../models/Booking.model.js";
import Tent from "../models/Tent.model.js";
import Camp from "../models/Camp.model.js";

// 📦 Create Booking
export const createBooking = async (req, res) => {
  try {
    const { tentId, startDate, endDate, guests, paymentOption, idDocumentUrl } = req.body;
    const camperId = req.user.id;

    // Check tent validity
    const tent = await Tent.findById(tentId);
    if (!tent) return res.status(404).json({ error: "Tent not found." });

    // Check if camp is approved
    const camp = await Camp.findById(tent.campId);
    if (!camp || camp.status !== "approved") {
      return res.status(403).json({ error: "Cannot book a tent from an unapproved camp." });
    }

    // Calculate total price
    const nights = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * tent.pricePerNight;

    const booking = await Booking.create({
      camperId,
      tentId,
      startDate,
      endDate,
      guests,
      totalPrice,
      paymentOption,
      idDocumentUrl,
    });

    res.status(201).json({
      message: "Booking created successfully.",
      booking,
    });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Server error during booking." });
  }
};

// 🧾 Get All Bookings (Admin only)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("camperId", "fullName email")
      .populate("tentId", "name pricePerNight");
    res.json({ message: "Bookings retrieved successfully.", bookings });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings." });
  }
};

// 👤 Get My Bookings (Camper)
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ camperId: req.user.id })
      .populate("tentId", "name pricePerNight");
    res.json({ message: "Your bookings retrieved successfully.", bookings });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user bookings." });
  }
};

// ❌ Cancel Booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found." });

    if (booking.camperId.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ error: "Not authorized to cancel this booking." });

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    await booking.save();

    res.json({ message: "Booking cancelled successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel booking." });
  }
};
