import express from "express";
import { camps } from "../data/camps.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { location, checkIn, checkOut, guests } = req.body;

  if (!location || !checkIn || !checkOut || !guests) {
    return res.status(400).json({
      success: false,
      message: "All fields (location, checkIn, checkOut, guests) are required.",
    });
  }

  const results = camps.filter((camp) =>
    camp.location.toLowerCase().includes(location.toLowerCase())
  );

  return res.json({
    success: true,
    query: { location, checkIn, checkOut, guests },
    results,
  });
});

export default router;
