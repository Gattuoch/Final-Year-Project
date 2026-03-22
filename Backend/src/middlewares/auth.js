import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/User.model.js';
import jwt from "jsonwebtoken";

export  async function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Missing authorization header' });

    const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);
  const userId = payload.id || payload.sub;
  const user = await User.findById(userId);
    if (!user || user.isBanned) return res.status(403).json({ message: 'Invalid user' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
  }
}

// role check middleware factory
 export  function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthenticated' });
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden — insufficient role' });
    }
    next();
  };
}


const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing authorization token" });
    }

    const token = authHeader.split(" ")[1];
  const payload = verifyAccessToken(token);
  const userId = payload.id || payload.sub;

  const user = await User.findById(userId);
    if (!user || user.isBanned) {
      return res.status(403).json({ message: "Invalid or banned user" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

export default protect;
