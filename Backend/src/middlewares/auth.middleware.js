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
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

// ✅ Check for Admin or SuperAdmin roles
export const isAdmin = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "superadmin") {
    return next();
  }
  return res.status(403).json({ error: "Access denied. Admin privileges required." });
};

// ✅ Check for Camp Manager role
export const isManager = (req, res, next) => {
  if (req.user.role === "manager") {
    return next();
  }
  return res.status(403).json({ error: "Access denied. Manager privileges required." });
};
