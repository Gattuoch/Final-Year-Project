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
<<<<<<< HEAD
import dashboardRoutes from "./routes/dashboardRoutes.js";
=======
import CampRoutes from "./routes/campRoutes.js";
import campHomeRoutes from "./routes/campHomeRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import managerRoutes from "./routes/manager.routes.js";
import userRoutes from "./routes/userRoutes.js";
import auth1Routes from './routes/auth.js';
import  admin1Routes from './routes/admin.js';
import dashboardRoutes from "./controllers/dashboardController.js";
import camproutes from "./routes/camp.routes.js";
// import dashboardRoutes from "./routes/dashboard.routes.js";
// Seeder utility
import  seedSuperAdmin  from "./utils/createSuperAdmin.js";
import  createSystemAdmin  from "./routes/createSystemAdmin.js";
import usersuperadmindashboard from "./routes/dashboard.routes.js";
import adminuser  from "./routes/admin.user.routes.js"
import createuserRoutes from "./routes/createuser.controller.js";


>>>>>>> all change here

// --- UTILS ---
import seedSuperAdmin from "./utils/createSuperAdmin.js";

dotenv.config();
const app = express();

// ====== MIDDLEWARES ======
<<<<<<< HEAD
// Set CORS to be permissive for testing
app.use(cors({ 
  origin: "*", 
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true,
}));

=======
app.use(cors(
  { 
    origin: "http://localhost:5173", // your React frontend
    methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"],
    credentials:true,
  }
));
>>>>>>> all change here
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

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/camps", campRoutes); 
app.use("/api/tents", tentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/contact", contactRoutes);
<<<<<<< HEAD
app.use("/api/dashboard", dashboardRoutes);

=======
// app.use("/api/CampRoutes", CampRoutes);
app.use("/api/campHomeRoutes", campHomeRoutes);
app.use("/api/search", searchRoutes);
app.use('/api/auth', auth1Routes);
app.use('/api/admin', admin1Routes);
app.use("/api/manager", managerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/usersuperadmindashboard", usersuperadmindashboard);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/system-admin", createSystemAdmin);
app.use("/api/adminuser", adminuser)
app.use("/api/usersadmin", adminuser)
app.use("/api/createusers", createuserRoutes);
// static images (optional) - serve images placed under ./public/images
>>>>>>> all change here
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