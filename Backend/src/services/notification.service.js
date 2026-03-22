import Notification from "../models/Notification.model.js";
import * as emailService from "./email.service.js";

export const createNotification = async ({ userId, type, subject, body, meta = {} }) => {
  const note = await Notification.create({ userId, type, subject, body, meta });
  return note;
};

export const sendEmailNotification = async ({ userId, to, type, subject, html, text, meta = {} }) => {
  try {
    await emailService.sendMail({ to, subject, html, text });
  } catch (err) {
    console.error("Email send failed for notification:", err);
  }
  try {
    const note = await createNotification({ userId, type, subject, body: html || text, meta });
    return note;
  } catch (err) {
    console.error("Failed to record notification:", err);
    return null;
  }
};

export const getUserNotifications = async (userId, { limit = 50, skip = 0 } = {}) => {
  return Notification.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
};

export const markAsRead = async (notificationId) => {
  return Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
};
