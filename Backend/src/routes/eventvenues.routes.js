import express from "express";
import EventVenue from "../models/EventVenue.model.js";

const router = express.Router();

// Public: list event venues. Supports ?limit=, ?page=, and simple search
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const items = await EventVenue.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await EventVenue.countDocuments(filter);

    return res.json({ success: true, data: items, total });
  } catch (err) {
    console.error("/eventvenues error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch event venues" });
  }
});

export default router;
