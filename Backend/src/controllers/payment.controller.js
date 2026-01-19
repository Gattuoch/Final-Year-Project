import axios from "axios";
import dotenv from "dotenv";
import Booking from "../models/Booking.model.js";
import User from "../models/User.model.js";
import * as emailService from "../services/email.service.js";
import {
  createStripePaymentIntent,
  createStripeCheckoutSession,
  constructStripeEvent,
} from "../services/payment.service.js";

dotenv.config();

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
const BASE_URL = "https://api.chapa.co/v1";

/* 
=============================================
   💰 PAYMENT CONTROLLER - ETHIOCAMP SYSTEM
=============================================
*/

//
// 1️⃣ CREATE PAYMENT SESSION (Prepaid / Postpaid)
//
export const initiatePayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentOption } = req.body;

    const booking = await Booking.findById(bookingId).populate("camperId tentId");
    if (!booking) return res.status(404).json({ error: "Booking not found." });

    const camper = booking.camperId;

    // ❌ Block untrusted campers from using cash_on_arrival
    if (paymentOption === "cash_on_arrival" && !camper.cashEligible) {
      return res.status(403).json({
        error:
          "You are not eligible for cash on arrival due to previous no-shows or late cancellations.",
      });
    }

    // 🟠 Handle Stripe options
    if (paymentOption === "stripe") {
      // create a Stripe PaymentIntent and return client_secret
      const paymentIntent = await createStripePaymentIntent(booking);

      booking.paymentOption = paymentOption;
      booking.paymentStatus = "unpaid";
      booking.paymentMeta = { provider: "stripe", paymentIntentId: paymentIntent.id };
      await booking.save();

      return res.status(200).json({
        message: "Stripe payment initiated.",
        client_secret: paymentIntent.client_secret,
      });
    }

    if (paymentOption === "stripe_checkout") {
      const successUrl = `${process.env.FRONTEND_URL}/payment/success`;
      const cancelUrl = `${process.env.FRONTEND_URL}/payment/cancel`;
      const session = await createStripeCheckoutSession(booking, successUrl, cancelUrl);

      booking.paymentOption = paymentOption;
      booking.paymentStatus = "unpaid";
      booking.paymentMeta = { provider: "stripe", sessionId: session.id };
      await booking.save();

      return res.status(200).json({
        message: "Stripe checkout session created.",
        checkout_url: session.url,
      });
    }

    // 🟢 Handle Prepaid and Postpaid (Chapa)
    if (paymentOption === "prepaid" || paymentOption === "postpaid") {
      const tx_ref = `ECAMP-${booking._id}-${Date.now()}`;

      const chapaPayload = {
        amount: booking.totalPrice.toString(),
        currency: "ETB",
        email: camper.email,
        first_name: camper.fullName.split(" ")[0],
        last_name: camper.fullName.split(" ")[1] || "",
        tx_ref,
        callback_url: `${process.env.FRONTEND_URL}/payment/verify/${booking._id}`,
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        customization: {
          title: "EthioCamps Booking Payment",
          description: `Booking for ${booking.tentId.name}`,
        },
      };

      const response = await axios.post(`${BASE_URL}/transaction/initialize`, chapaPayload, {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        },
      });

      if (response.data.status !== "success") {
        return res.status(400).json({ error: "Failed to initialize Chapa payment." });
      }

      // Update booking payment details
      booking.paymentOption = paymentOption;
      booking.paymentStatus = "unpaid";
      await booking.save();

      return res.status(200).json({
        message: "Payment session created successfully.",
        checkout_url: response.data.data.checkout_url,
        tx_ref,
      });
    }

    // 🟡 Cash on Arrival (no Chapa needed)
    booking.paymentOption = "cash_on_arrival";
    booking.paymentStatus = "unpaid";
    booking.setGracePeriods();
    await booking.save();

    return res.status(200).json({
      message: "Booking reserved for cash payment on arrival.",
      graceExpiry: booking.graceExpiry,
    });
  } catch (err) {
    console.error("Payment initialization error:", err);
    res.status(500).json({ error: "Failed to initiate payment." });
  }
};


// Stripe webhook handler (expects raw body). Verifies signature and updates booking.
export const stripeWebhook = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    const event = constructStripeEvent(req.rawBody || req.body, sig);

    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object;
      const bookingId = pi.metadata?.bookingId;
      if (bookingId) {
        const booking = await Booking.findById(bookingId);
        if (booking) {
          booking.paymentStatus = "paid";
          booking.status = "confirmed";
          await booking.save();
          try {
            await booking.populate("camperId", "fullName email");
            await booking.populate({ path: "tentId", populate: { path: "managerId", select: "fullName email" } });
            await emailService.sendPaymentSuccess(booking);
            await emailService.sendBookingConfirmed(booking);
            const camperId = booking.camperId?._id || booking.camperId;
            await (await import("../services/notification.service.js")).sendEmailNotification({
              userId: camperId,
              to: booking.camperId?.email || booking.camperEmail,
              type: "payment_success",
              subject: `Payment Received - ${booking._id}`,
              html: `<p>Payment received for booking ${booking._id}</p>`,
              meta: { bookingId: booking._id }
            });

            // notify manager as well
            const manager = booking.tentId?.managerId;
            if (manager && manager.email) {
              await (await import("../services/notification.service.js")).sendEmailNotification({
                userId: manager._id,
                to: manager.email,
                type: "payment_received_manager",
                subject: `Payment received for booking ${booking._id}`,
                html: `<p>Payment received for booking <strong>${booking._id}</strong> on tent <strong>${booking.tentId?.name}</strong>.</p>`,
                meta: { bookingId: booking._id, tentId: booking.tentId?._id }
              });
            }
          } catch (e) { console.error("Stripe post-payment email error:", e); }
        }
      }
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;
      if (bookingId) {
        const booking = await Booking.findById(bookingId);
        if (booking) {
          booking.paymentStatus = "paid";
          booking.status = "confirmed";
          await booking.save();
          try {
            await booking.populate("camperId", "fullName email");
            await booking.populate("tentId", "name");
            await emailService.sendPaymentSuccess(booking);
            await emailService.sendBookingConfirmed(booking);
            const camperId = booking.camperId?._id || booking.camperId;
            await (await import("../services/notification.service.js")).sendEmailNotification({
              userId: camperId,
              to: booking.camperId?.email || booking.camperEmail,
              type: "payment_success",
              subject: `Payment Received - ${booking._id}`,
              html: `<p>Payment received for booking ${booking._id}</p>`,
              meta: { bookingId: booking._id }
            });
          } catch (e) { console.error("Stripe checkout post-payment email error:", e); }
        }
      }
    }

    res.status(200).send({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err.message || err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};


//
// 2️⃣ VERIFY PAYMENT STATUS (Chapa Callback)
//
export const verifyPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate("camperId");
    if (!booking) return res.status(404).json({ error: "Booking not found." });

    const response = await axios.get(`${BASE_URL}/transaction/verify/${bookingId}`, {
      headers: { Authorization: `Bearer ${CHAPA_SECRET_KEY}` },
    });

    if (response.data.status !== "success") {
      return res.status(400).json({ error: "Payment verification failed." });
    }

    // ✅ Mark booking as paid
    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    await booking.save();

      try {
      await booking.populate("camperId", "fullName email");
      await booking.populate({ path: "tentId", populate: { path: "managerId", select: "fullName email" } });
      await emailService.sendPaymentSuccess(booking);
      await emailService.sendBookingConfirmed(booking);
      // also record notifications for camper
      const camperId = booking.camperId?._id || booking.camperId;
      await (await import("../services/notification.service.js")).sendEmailNotification({
        userId: camperId,
        to: booking.camperId?.email || booking.camperEmail,
        type: "payment_success",
        subject: `Payment Received - ${booking._id}`,
        html: `<p>Payment received for booking ${booking._id}</p>`,
        meta: { bookingId: booking._id }
      });

      // notify manager as well
      const manager = booking.tentId?.managerId;
      if (manager && manager.email) {
        await (await import("../services/notification.service.js")).sendEmailNotification({
          userId: manager._id,
          to: manager.email,
          type: "payment_received_manager",
          subject: `Payment received for booking ${booking._id}`,
          html: `<p>Payment received for booking <strong>${booking._id}</strong> on tent <strong>${booking.tentId?.name}</strong>.</p>` ,
          meta: { bookingId: booking._id, tentId: booking.tentId?._id }
        });
      }
    } catch (e) {
      console.error("Post-payment email error:", e);
    }

    return res.status(200).json({
      message: "Payment verified successfully.",
      booking,
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ error: "Error verifying payment." });
  }
};


//
// 3️⃣ COMPLETE STAY (Manager/Admin confirms checkout)
//
export const completeStay = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate("camperId");
    if (!booking) return res.status(404).json({ error: "Booking not found." });

    booking.status = "completed";
    await booking.save();

    // 🟩 Reward camper’s trust score
    const camper = booking.camperId;
    camper.trustScore += 1;
    await camper.updateTrustEligibility();

    return res.status(200).json({
      message: "Stay completed and trust score updated.",
      camper: {
        name: camper.fullName,
        trustScore: camper.trustScore,
        cashEligible: camper.cashEligible,
      },
    });
  } catch (err) {
    console.error("Complete stay error:", err);
    res.status(500).json({ error: "Failed to complete stay." });
  }
};


//
// 4️⃣ HANDLE LATE CANCELLATION OR NO-SHOW
//
export const handleAbuse = async (req, res) => {
  try {
    const { camperId, type } = req.body;

    const camper = await User.findById(camperId);
    if (!camper) return res.status(404).json({ error: "Camper not found." });

    // 🟥 Ban for 1 year
    camper.cashEligible = false;
    camper.cashBanUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    await camper.save();

    return res.status(200).json({
      message:
        type === "no-show"
          ? "Camper marked as no-show and banned from cash payments for 1 year."
          : "Late cancellation detected; cash payment privilege revoked for 1 year.",
      camper,
    });
  } catch (err) {
    console.error("Handle abuse error:", err);
    res.status(500).json({ error: "Error applying camper penalty." });
  }
};
