import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url"; // ✅ Added for path resolution

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

// --- UTILS ---
import seedSuperAdmin from "./utils/createSuperAdmin.js";

dotenv.config();

// ✅ FIX: Setup __dirname for ES Modules
// This is required to reliably find folders like 'public' regardless of where you start the server
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ====== MIDDLEWARES ======
app.use(cors({ 
  origin: ["http://localhost:5173", "http://localhost:3000"], // Support Vite & Create React App ports
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({ 
  contentSecurityPolicy: false, // Disable CSP to allow loading external images/scripts if needed
  crossOriginResourcePolicy: { policy: "cross-origin" } // ✅ Allow images to be loaded by frontend
})); 
app.use(morgan("dev"));
app.disable("etag");

// ====== ROUTES ======
app.get('/', (req, res) => res.json({ message: 'EthioCamps API Running' }));

// Auth & Admin
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/users", userRoutes);

// Core Features
app.use("/api/camps", campRoutes); 
app.use("/api/campHomeRoutes", campRoutes); // Legacy Alias
app.use("/api/tents", tentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/eventvenues", eventvenuesRoutes);

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

// ✅ FIX: Robust Static Image Serving
// Assuming structure: Backend/src/server.js and Backend/public/images
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// ====== ERROR HANDLING ======
// 404 Handler
app.use((req, res) => {
  console.log(`404 Attempted on: ${req.originalUrl}`);
  res.status(404).json({ error: "Route not found on server." });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ success: false, message });
});

// ====== DATABASE & START ======
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    seedSuperAdmin();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
  });