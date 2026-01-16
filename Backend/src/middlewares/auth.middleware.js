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
    // Try multiple locations for the token: Authorization header, cookie, or query param
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
      if (process.env.DEBUG_AUTH === "true") console.debug("authenticateJWT: token from Authorization header");
    }

    // Some clients send the header in different casings or without the 'Bearer ' prefix.
    // Try a few more fallbacks before giving up.
    if (!token) {
      const altAuth = req.get && req.get("Authorization");
      if (altAuth && altAuth.startsWith("Bearer ")) {
        token = altAuth.split(" ")[1];
        if (process.env.DEBUG_AUTH === "true") console.debug("authenticateJWT: token from req.get('Authorization')");
      } else if (altAuth && !altAuth.startsWith("Bearer ")) {
        // some proxies or clients may send the raw token
        token = altAuth;
        if (process.env.DEBUG_AUTH === "true") console.debug("authenticateJWT: token from req.get('Authorization') without Bearer prefix");
      }
    }

    // support query param as fallback: ?access_token=...
    if (!token && req.query && req.query.access_token) {
      token = req.query.access_token;
      if (process.env.DEBUG_AUTH === "true") console.debug("authenticateJWT: token from query param");
    }

    // support cookie fallback (if cookie-parser used)
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
      if (process.env.DEBUG_AUTH === "true") console.debug("authenticateJWT: token from cookie");
    }

    if (!token) {
      // Helpful debug logging to diagnose why requests are unauthenticated.
      if (process.env.DEBUG_AUTH === "true") {
        console.debug("authenticateJWT: no token found. headers.authorization=", req.headers.authorization);
        console.debug("authenticateJWT: cookies present=", !!req.cookies);
        console.debug("authenticateJWT: query.access_token=", req.query && req.query.access_token);
      }
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (verifyErr) {
      if (process.env.DEBUG_AUTH === "true") {
        try {
          console.debug("authenticateJWT: verify error", verifyErr.message, {
            tokenPreview: token ? token.slice(0, 10) + "..." : null,
            tokenLength: token ? token.length : 0,
          });
        } catch (e) {
          console.debug("authenticateJWT: failed to log verifyErr details", e.message);
        }
      }
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    if (process.env.DEBUG_AUTH === "true") {
      try {
        // avoid logging the full token string in production
        console.debug("authenticateJWT: decoded payload", { id: decoded.id || decoded.sub, role: decoded.role });
      } catch (e) {
        console.debug("authenticateJWT: failed to log decoded payload", e.message);
      }
    }

    // Support both "id" and "sub" for compatibility
    const userId = decoded.id || decoded.sub;
    if (!userId) {
      if (process.env.DEBUG_AUTH === "true") console.debug("authenticateJWT: no id/sub in decoded payload", decoded);
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

// Also exporting verifyToken as an alias for authenticateJWT to prevent breaking other files
export const verifyToken = authenticateJWT;

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

export default {
  authenticateJWT,
  verifyToken,
  isAdmin,
  isManager,
  authorizeRoles,
  protect,
  adminOnly,
};