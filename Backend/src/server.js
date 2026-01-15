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
import tentRoutes from "./routes/tent.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import contactRoutes from "./routes/contactRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({ contentSecurityPolicy: false })); // Helmet can sometimes block cross-origin requests
app.use(morgan("dev"));

// ====== ROUTES ======
// These MUST come before the 404/Not Found middleware
app.get('/', (req, res) => res.json({ message: 'EthioCamps API Running' }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/camps", campRoutes); 
app.use("/api/tents", tentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/dashboard", dashboardRoutes);

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