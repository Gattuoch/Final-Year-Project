import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import * as notificationService from "../services/notification.service.js";

const router = express.Router();

// Get my notifications
router.get("/my", verifyToken, async (req, res) => {
  try {
    const notes = await notificationService.getUserNotifications(req.user.id);
    return res.json({ success: true, notifications: notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch notifications." });
  }
});

// Mark notification as read
router.patch("/:id/read", verifyToken, async (req, res) => {
  try {
    const note = await notificationService.markAsRead(req.params.id);
    return res.json({ success: true, notification: note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to mark notification read." });
  }
});

export default router;
