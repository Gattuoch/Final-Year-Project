import User from "../models/User.model.js";
import { verifyAccessToken } from "../utils/jwt.js";

// Protect middleware for routes
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = verifyAccessToken(token);

    // Find user by ID in token
    const user = await User.findById(decoded.sub).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
