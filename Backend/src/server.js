import dotenv from "dotenv";
dotenv.config();
import express from "express";
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
import supportRoutes from "./routes/supportRoutes.js";

import usersProfileRoutes from "./routes/users.js"
import ticketRoutes from "./routes/ticketRoutes.js";
import aiRoutes from "./routes/ai.routes.js";
import sysadminCampRoutes from "./routes/sysadmin.camp.routes.js";
import sysadminUserRoutes from "./routes/sysadmin.user.routes.js";
import sysadminDashboardRoutes from "./routes/sysadmin.dashboard.routes.js";
import sysadminSecurityRoutes from "./routes/sysadmin.security.routes.js";
import sysadminDatabaseRoutes from "./routes/sysadmin.database.routes.js";
import sysadminBackupRoutes from "./routes/sysadmin.backup.routes.js";
import sysadminLogsRoutes from "./routes/sysadmin.logs.routes.js";
import sysadminFinanceRoutes from "./routes/sysadmin.finance.routes.js";
import sysadminReportsRoutes from "./routes/sysadmin.reports.routes.js";
import sysadminConfigRoutes from "./routes/sysadmin.config.routes.js";
import sysadminFeaturesRoutes from "./routes/sysadmin.features.routes.js";
import sysadminProfileRoutes from "./routes/sysadmin.profile.routes.js";
import backupService from "./services/backup.service.js";
import reportScheduler from "./services/reportScheduler.service.js";



// --- UTILS ---
import seedSystemAdmin from "./utils/createSystemAdmin.js";

// --- MIDDLEWARES ---
import { metricsMiddleware } from "./middlewares/metrics.middleware.js";

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// DEBUG LOGGER - MUST BE FIRST
app.use((req, res, next) => {
  console.log(`[TOP-LEVEL-DEBUG] ${req.method} ${req.url}`);
  next();
});

const stripe = new Stripe(process.env.STRIPE_SECRET_TEST);

// ====== MIDDLEWARES ======
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(morgan("dev"));
app.use(metricsMiddleware);
app.disable("etag");

// ====== STATIC FILES ======
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// ====== ROUTES ======

// Health check
app.get('/', (req, res) => res.json({ message: 'EthioCamps API Running' }));

// Auth & Admin
app.use("/api/sysadmin/users", sysadminUserRoutes); // MOVED UP
app.use("/api/db-management", sysadminDatabaseRoutes);
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
app.use("/api/ai", aiRoutes);

// Dashboards & Settings
app.use("/api/superadmin/settings", settingsRoutes);
app.use("/api/usersuperadmindashboard", usersuperadmindashboard);
app.use("/api/system-admin", createSystemAdmin);
app.use("/api/sysadmin/finance", sysadminFinanceRoutes);
app.use("/api/sysadmin/camps", sysadminCampRoutes);
app.use("/api/sysadmin/dashboard", sysadminDashboardRoutes);
app.use("/api/sysadmin/security", sysadminSecurityRoutes);
app.use("/api/sysadmin/backup", sysadminBackupRoutes);
app.use("/api/sysadmin/logs", sysadminLogsRoutes);
app.use("/api/sysadmin/reports", sysadminReportsRoutes);
app.use("/api/sysadmin/config", sysadminConfigRoutes);
app.use("/api/sysadmin/features", sysadminFeaturesRoutes);
app.use("/api/sysadmin", sysadminProfileRoutes);

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
        return_url: "",
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
    seedSystemAdmin();
    backupService.start();
    reportScheduler.init(); // Initialize report scheduler
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

  })
  .catch(err => console.error("❌ Database connection error:", err.message));
