import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";

// Routes
// import authRoutes from "./routes/auth.routes.js";
// import adminRoutes from "./routes/admin.routes.js";
import campRoutes from "./routes/camp.routes.js";
import tentRoutes from "./routes/tent.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import contactRoutes from "./routes/contactRoutes.js";
import CampRoutes from "./routes/campRoutes.js";
import campHomeRoutes from "./routes/campHomeRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";

import auth1Routes from './routes/auth.js';
import  admin1Routes from './routes/admin.js';

// Seeder utility
import { createSuperAdmin } from "./utils/createSuperAdmin.js";

dotenv.config();

const app = express();

// ====== MIDDLEWARES ======
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// ====== ROUTES ======
// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
app.use("/api/camps", campRoutes);
app.use("/api/tents", tentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/CampRoutes", CampRoutes);
app.use("/api/campHomeRoutes", campHomeRoutes);
app.use("/api/search", searchRoutes);
app.use('/api/auth', auth1Routes);
app.use('/api/admin', admin1Routes);

// static images (optional) - serve images placed under ./public/images
app.use("/images", express.static("public/images"));


// ====== DATABASE CONNECTION ======
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB connected successfully");

    // Create Super Admin if not exists
    await createSuperAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  });

// ====== FALLBACK ROUTE ======
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});
