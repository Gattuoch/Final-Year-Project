import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.model.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * ✅ CORE VERIFICATION (Renamed to match your route imports)
 * Decodes token and verifies user existence in Database
 */
export const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Support both "id" and "sub" for compatibility
    const userId = decoded.id || decoded.sub;
    if (!userId) {
      return res.status(401).json({ error: "Invalid token payload." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    // Ensure account is active and not banned
    if (user.isActive === false) {
      return res.status(403).json({ error: "Account deactivated." });
    }
    if (user.isBanned === true) {
        return res.status(403).json({ error: "Account banned." });
    }

    req.user = user; 
    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

/**
 * ✅ ROLE: Admin or Super Admin
 */
export const isAdmin = (req, res, next) => {
  // Fixed: super_admin (matches model)
  if (req.user.role === "admin" || req.user.role === "super_admin") {
    return next();
  }
  return res.status(403).json({ error: "Access denied. Admin privileges required." });
};

/**
 * ✅ ROLE: Camp Manager
 */
export const isManager = (req, res, next) => {
  if (req.user.role === "camp_manager") {
    return next();
  }
  return res.status(403).json({ error: "Access denied. Manager privileges required." });
};

/**
 * ✅ ROLE CHECK FACTORY (Added to fix admin.js import error)
 */
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden — insufficient role' });
    }
    next();
  };
}

/**
 * ✅ DYNAMIC PROTECT
 */
export const protect = (roles = []) => {
  return [
    authenticateJWT,
    (req, res, next) => {
      if (roles.length === 0) return next();
      if (roles.includes(req.user.role)) return next();
      
      return res.status(403).json({ error: "Access denied. Insufficient privileges." });
    }
  ];
};

<<<<<<< HEAD
// Also exporting verifyToken as an alias for authenticateJWT to prevent breaking other files
export const verifyToken = authenticateJWT;
=======

/* ================= ADMIN ONLY ================= */
export const adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const allowedRoles = ["admin", "super_admin"];

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied: Admins only",
      });
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: "Admin access failed" });
  }
};
>>>>>>> all change here

export default {
  authenticateJWT,
  verifyToken,
  isAdmin,
  isManager,
  authorizeRoles,
  protect,
};