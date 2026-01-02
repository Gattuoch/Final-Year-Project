import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const authMiddleware = (role) => async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // support both "id" and "sub"
    const userId = decoded.id || decoded.sub;
    if (!userId) return res.status(401).json({ error: "Invalid token payload" });

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: "User not found" });

    if (role && user.role !== role)
      return res.status(403).json({ error: "Forbidden" });

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);
    return res.status(401).json({ error: err.message });
  }
};


export default authMiddleware;
