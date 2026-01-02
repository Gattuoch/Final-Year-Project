import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Verify token
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded; // Attach decoded user to request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

// ✅ Role-based access: Super Admin or Admin
export const isAdmin = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "superadmin") {
    return next();
  }
  return res.status(403).json({ error: "Access denied. Admin privileges required." });
};

// ✅ Role-based access: Camp Manager
export const isManager = (req, res, next) => {
  if (req.user.role === "manager") {
    return next();
  }
  return res.status(403).json({ error: "Access denied. Manager privileges required." });
};

// ✅ Combined middleware for routes
export const protect = (roles = []) => {
  return [verifyToken, (req, res, next) => {
    if (roles.length === 0) return next(); // No role restriction
    if (roles.includes(req.user.role)) return next();
    return res.status(403).json({ error: "Access denied. Insufficient privileges." });
  }];
};

export default {
  verifyToken,
  isAdmin,
  isManager,
  protect,
};
