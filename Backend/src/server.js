import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Stripe from "stripe";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";

// --- ROUTES ---
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/admin.js';
import campRoutes from "./routes/camp.routes.js";
import eventvenuesRoutes from "./routes/eventvenues.routes.js";
import tentRoutes from "./routes/tent.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import contactRoutes from "./routes/contactRoutes.js";
import notificationRoutes from "./routes/notification.routes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import settingsRoutes from "./routes/settings.routes.js";
import userRoutes from "./routes/userRoutes.js";
import createSystemAdmin from "./routes/createSystemAdmin.js";
import usersuperadmindashboard from "./routes/dashboard.routes.js";
import adminuser from "./routes/admin.user.routes.js";
import createuserRoutes from "./routes/createuser.controller.js";
import supportRoutes from "./routes/support.js"
import usersProfileRoutes from "./routes/users.js"

// --- UTILS ---
import seedSuperAdmin from "./utils/createSuperAdmin.js";

dotenv.config();

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_TEST);

// ====== MIDDLEWARES ======
app.use(cors({ 
  origin: ["http://localhost:5173", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: "cross-origin" } })); 
app.use(morgan("dev"));
app.disable("etag");

// ====== STATIC FILES ======
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// ====== ROUTES ======

// Health check
app.get('/', (req, res) => res.json({ message: 'EthioCamps API Running' }));

// Auth & Admin
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/support", supportRoutes);

// Core Features
app.use("/api/camps", campRoutes); 
app.use("/api/campHomeRoutes", campRoutes); // Legacy Alias
app.use("/api/tents", tentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/eventvenues", eventvenuesRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/usersProfile", usersProfileRoutes);

// Support & Notifications
app.use("/api/contact", contactRoutes);
app.use("/api/notifications", notificationRoutes);

// Dashboards & Settings
app.use("/api/superadmin/settings", settingsRoutes);
app.use("/api/usersuperadmindashboard", usersuperadmindashboard);
app.use("/api/system-admin", createSystemAdmin);
app.use("/api/adminuser", adminuser);
app.use("/api/usersadmin", adminuser);
app.use("/api/createusers", createuserRoutes);

// ====== STRIPE PAYMENT ======
app.post("/payment", async (req, res) => {
  const { amount, id } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Spatula company",
      payment_method: id,
      confirm: true
    });
    res.json({ message: "Payment successful", success: true });
  } catch (error) {
    console.error(error);
    res.json({ message: "Payment failed", success: false });
  }
});

// ====== CHAPA PAYMENT ======

// Initialize Payment
app.post("/api/chapa/initialize", async (req, res) => {
  const { amount, currency = "ETB", email, first_name, last_name, phone_number, tx_ref } = req.body;
  if (!amount || !email || !tx_ref) return res.status(400).json({ success: false, message: "Missing fields" });

  try {
    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount, currency, email, first_name, last_name, phone_number, tx_ref,
        return_url: `${process.env.FRONTEND_URL}/payment-success?tx_ref=${tx_ref}`,
        customization: { title: "EthioCampsPay", description: "Camp Reservation Payment" },
      },
      { headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`, "Content-Type": "application/json" } }
    );
    res.json({ success: true, checkout_url: response.data.data.checkout_url });
  } catch (error) {
    console.error("Chapa Init Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Payment initialization failed" });
  }
});

// Verify Payment
app.get("/api/chapa/verify/:tx_ref", async (req, res) => {
  const { tx_ref } = req.params;
  try {
    const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
      headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
    });
    res.json({ success: true, data: response.data.data });
  } catch (error) {
    console.error("Chapa Verify Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

// ====== 404 HANDLER (LAST) ======
app.use((req, res) => {
  console.log(`404 Attempted on: ${req.originalUrl}`);
  res.status(404).json({ error: "Route not found on server." });
});

// ====== GLOBAL ERROR HANDLER ======
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ success: false, message });
});

// ====== DATABASE & START SERVER ======
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    seedSuperAdmin();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ Database connection error:", err.message));
