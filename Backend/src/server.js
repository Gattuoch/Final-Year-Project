import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import path from "path";

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
// managerRoutes import removed — no `manager.routes.js` file present in repo
import userRoutes from "./routes/userRoutes.js";
import createSystemAdmin from "./routes/createSystemAdmin.js";
import usersuperadmindashboard from "./routes/dashboard.routes.js";
import adminuser  from "./routes/admin.user.routes.js";
import createuserRoutes from "./routes/createuser.controller.js";

// --- UTILS ---
import seedSuperAdmin from "./utils/createSuperAdmin.js";

dotenv.config();
const app = express();

// ====== MIDDLEWARES ======
// Set CORS to be permissive for testing
app.use(cors({ 
  origin: "*", 
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true,
}));

app.use(cors(
  { 
    origin: "http://localhost:5173", // your React frontend
    methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"],
    credentials:true,
  }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({ contentSecurityPolicy: false })); // Helmet can sometimes block cross-origin requests
app.use(morgan("dev"));

// Disable ETag/conditional GET responses for API endpoints to avoid 304
// responses with empty bodies. APIs typically should return fresh JSON.
app.disable("etag");

// ====== ROUTES ======
// These MUST come before the 404/Not Found middleware
app.get('/', (req, res) => res.json({ message: 'EthioCamps API Running' }));

// Temporary debug endpoint to inspect incoming request headers and cookies.
// Useful to verify the Authorization header from the frontend. Remove in production.
app.get('/api/debug/headers', (req, res) => {
  res.json({
    headers: req.headers,
    cookiesPresent: !!req.cookies,
    ip: req.ip,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/camps", campRoutes); 
// Alias used by the frontend (keeps old name for backward compatibility)
app.use("/api/campHomeRoutes", campRoutes);
// New event venues listing endpoint
app.use("/api/eventvenues", eventvenuesRoutes);
app.use("/api/tents", tentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/superadmin/settings", settingsRoutes);
app.use("/api/usersuperadmindashboard", usersuperadmindashboard);
// app.use("/api/CampRoutes", CampRoutes);
app.use("/api/system-admin", createSystemAdmin);
app.use("/api/adminuser", adminuser)
app.use("/api/usersadmin", adminuser)
app.use("/api/createusers", createuserRoutes);
// static images (optional) - serve images placed under ./public/images
app.use("/images", express.static("public/images"));

// ====== ERROR HANDLING ======
// This MUST come AFTER all routes
app.use((req, res) => {
  console.log(`404 Attempted on: ${req.originalUrl}`);
  res.status(404).json({ error: "Route not found on server." });
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