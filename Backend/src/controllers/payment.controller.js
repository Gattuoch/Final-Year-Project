import axios from "axios";
import dotenv from "dotenv";
import Stripe from "stripe"; 
import Booking from "../models/Booking.model.js";
import User from "../models/User.model.js";
import * as emailService from "../services/email.service.js";

dotenv.config();

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
const BASE_URL = "https://api.chapa.co/v1";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 

/* =============================================
   💰 PAYMENT CONTROLLER
============================================= */

//
// 1️⃣ INITIALIZE CHAPA (Ethiopian Payment)
//
export const initializeChapaPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    // Validate Input
    if (!bookingId) return res.status(400).json({ error: "Booking ID is required." });

    // Fetch Booking & Populate Camper/Tent
    const booking = await Booking.findById(bookingId).populate("camperId tentId");
    
    if (!booking) return res.status(404).json({ error: "Booking not found." });
    if (!booking.camperId) return res.status(404).json({ error: "User/Camper not found linked to this booking." });

    const camper = booking.camperId;
    const tx_ref = `ECAMP-${booking._id}-${Date.now()}`;

    // ✅ FIX: Robust Name Handling (Chapa fails if last_name is empty)
    // Try firstName/lastName fields first, then fallback to splitting fullName
    let firstName = camper.firstName || "Guest";
    let lastName = camper.lastName || "User";

    if (!camper.firstName && camper.fullName) {
      const parts = camper.fullName.split(" ");
      firstName = parts[0] || "Guest";
      lastName = parts.length > 1 ? parts.slice(1).join(" ") : "User"; // Ensure last name isn't empty
    }

    const chapaPayload = {
      amount: booking.totalPrice.toString(),
      currency: "ETB",
      email: camper.email,
      first_name: firstName,
      last_name: lastName, // ✅ Must not be empty
      tx_ref,
      callback_url: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/payment/verify/${booking._id}`,
      // ✅ FIX: Ensure this matches your Vite frontend port (usually 5173)
      return_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/camper-dashboard/reservations`,
      customization: {
        title: "EthioCamps Booking",
        description: `Payment for ${booking.tentId?.name || "Campsite"}`,
      },
    };

    console.log("🚀 Sending to Chapa:", chapaPayload); // Log payload for debugging

    const response = await axios.post(`${BASE_URL}/transaction/initialize`, chapaPayload, {
      headers: { Authorization: `Bearer ${CHAPA_SECRET_KEY}` },
    });

    if (response.data.status !== "success") {
      return res.status(400).json({ error: "Failed to initialize Chapa payment." });
    }

    booking.paymentOption = "chapa";
    booking.paymentStatus = "unpaid";
    booking.paymentMeta = { tx_ref };
    await booking.save();

    return res.status(200).json({
      success: true, // Frontend expects this flag
      message: "Chapa session created.",
      paymentUrl: response.data.data.checkout_url, // Matches frontend expectation (was checkout_url)
      checkout_url: response.data.data.checkout_url, // Keep for backward compatibility
    });

  } catch (err) {
    // ✅ FIX: Log the actual error response from Chapa
    console.error("❌ Chapa Init Error Details:", err.response?.data || err.message);
    res.status(500).json({ 
      error: "Failed to initiate Chapa payment.",
      details: err.response?.data || err.message
    });
  }
};

//
// 2️⃣ CREATE STRIPE INTENT
//
export const createStripeIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate("camperId");

    if (!booking) return res.status(404).json({ error: "Booking not found." });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalPrice * 100), 
      currency: "usd", 
      metadata: {
        bookingId: booking._id.toString(),
        camperEmail: booking.camperId.email,
      },
    });

    booking.paymentOption = "stripe";
    booking.paymentStatus = "unpaid";
    booking.paymentMeta = { provider: "stripe", paymentIntentId: paymentIntent.id };
    await booking.save();

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });

  } catch (err) {
    console.error("Stripe init error:", err.message);
    res.status(500).json({ error: "Failed to create Stripe intent." });
  }
};

//
// 3️⃣ STRIPE WEBHOOK
//
export const stripeWebhook = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.rawBody || req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object;
      const bookingId = pi.metadata?.bookingId;
      if (bookingId) await finalizeBooking(bookingId);
    }

    res.status(200).send({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

//
// 4️⃣ VERIFY CHAPA PAYMENT
//
export const verifyPayment = async (req, res) => {
  try {
    const { bookingId } = req.params; 
    const booking = await Booking.findById(bookingId);
    
    if (!booking) return res.status(404).json({ error: "Booking not found." });

    // If already paid, just return success
    if (booking.paymentStatus === "paid") {
       return res.status(200).json({ message: "Payment already verified.", booking });
    }

    const response = await axios.get(`${BASE_URL}/transaction/verify/${booking.paymentMeta.tx_ref}`, {
      headers: { Authorization: `Bearer ${CHAPA_SECRET_KEY}` },
    });

    if (response.data.status !== "success") {
      return res.status(400).json({ error: "Payment verification failed or pending." });
    }

    await finalizeBooking(bookingId);

    return res.status(200).json({ message: "Payment verified successfully.", booking });
  } catch (err) {
    console.error("Verification error:", err.message);
    res.status(500).json({ error: "Error verifying payment." });
  }
};

//
// 5️⃣ COMPLETE STAY (Admin/Manager) - RESTORED
//
export const completeStay = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId).populate("camperId");
    if (!booking) return res.status(404).json({ error: "Booking not found." });

    booking.status = "completed";
    await booking.save();

    const camper = booking.camperId;
    camper.trustScore += 1;
    // Assuming updateTrustEligibility is a method on your User model
    if (camper.updateTrustEligibility) await camper.updateTrustEligibility(); 
    await camper.save();

    return res.status(200).json({ message: "Stay completed.", camper });
  } catch (err) {
    console.error("Complete stay error:", err);
    res.status(500).json({ error: "Failed to complete stay." });
  }
};

//
// 6️⃣ HANDLE ABUSE (Admin) - RESTORED
//
export const handleAbuse = async (req, res) => {
  try {
    const { camperId, type } = req.body;
    const camper = await User.findById(camperId);
    if (!camper) return res.status(404).json({ error: "Camper not found." });

    camper.cashEligible = false;
    camper.cashBanUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    await camper.save();

    return res.status(200).json({ message: "Penalty applied.", camper });
  } catch (err) {
    console.error("Abuse handling error:", err);
    res.status(500).json({ error: "Error applying penalty." });
  }
};

//
// 🛠 HELPER: FINALIZE BOOKING
//
const finalizeBooking = async (bookingId) => {
  const booking = await Booking.findById(bookingId).populate("camperId tentId");
  if (!booking || booking.paymentStatus === "paid") return;

  booking.paymentStatus = "paid";
  booking.status = "confirmed";
  await booking.save();

  try {
    await emailService.sendPaymentSuccess(booking);
    await emailService.sendBookingConfirmed(booking);
    
    // Attempt dynamic import for notifications to avoid circular dependency
    const notificationService = await import("../services/notification.service.js");
    
    await notificationService.sendEmailNotification({
      userId: booking.camperId._id,
      to: booking.camperId.email,
      type: "payment_success",
      subject: `Payment Received - ${booking._id}`,
      html: `<p>Payment received for booking ${booking._id}</p>`,
      meta: { bookingId: booking._id }
    });
  } catch (e) {
    console.error("Post-payment notification error:", e.message);
  }
};