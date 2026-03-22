// src/routes/users.js

import express from "express";
import multer from "multer";
import path from "path";
import User from "../models/User.js";
import auth from "../middlewares/User.auth.js";

const router = express.Router();

// ---- Multer Setup for Image Uploads ----
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ---- GET USER PROFILE ----
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---- UPDATE USER PROFILE ----
router.patch(
  "/:id",
  auth,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const updateData = { ...req.body };

      // Handle uploaded files
      if (req.files.profilePicture) {
        updateData.profilePicture = `http://localhost:5000/uploads/${req.files.profilePicture[0].filename}`;
      }
      if (req.files.coverPicture) {
        updateData.coverPicture = `http://localhost:5000/uploads/${req.files.coverPicture[0].filename}`;
      }

      const user = await User.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      }).select("-password");

      if (!user) return res.status(404).json({ message: "User not found" });

      res.json({ success: true, data: user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

export default router;
