import Setting from "../models/Setting.model.js";

// Default settings matching frontend defaults
const DEFAULTS = {
  platform: {
    registration: true,
    deletion: false,
    verification: false,
    emailNotifications: false,
    smsNotifications: false,
  },
  payment: {
    payouts: true,
    partialRefunds: true,
    defaultGateway: "Stripe",
    commissionRate: 15,
    minBookingAmount: 500,
    refundProcessingDays: 7,
    stripe: { publishableKey: "", secretKey: "" },
  },
  notification: {
    email: { booking: true, cancellation: true, payment: true, registration: false },
    sms: { booking: true, reminders: true, receipts: false },
    push: { updates: true, alerts: true, marketing: false },
    adminEmail: "admin@ethiocampground.com",
    frequency: "realtime",
  },
  security: {
    twoFactor: true,
    forcePasswordReset: false,
    sessionTimeout: false,
    ipLogging: false,
    loginAttemptsLogging: false,
  },
  general: {
    platformName: "ETHIOCAMPGROUND",
    contactEmail: "contact@ethiocampground.com",
    supportPhone: "+251 911 234 567",
    timezone: "East Africa Time (EAT)",
    description:
      "Leading camping and outdoor event platform in Ethiopia, connecting nature enthusiasts with premium camping experiences.",
    currency: "Ethiopian Birr (ETB)",
    language: "English",
  },
};

export const getSettings = async (req, res) => {
  try {
    let doc = await Setting.findOne({ name: "global" });
    if (!doc) {
      doc = await Setting.create({ name: "global", data: DEFAULTS });
    }
    return res.json({ settings: doc.data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load settings" });
  }
};

// Merge update for nested objects (shallow merge per-top-level key)
export const updateSettings = async (req, res) => {
  try {
    const payload = req.body || {};

    let doc = await Setting.findOne({ name: "global" });
    if (!doc) {
      doc = await Setting.create({ name: "global", data: DEFAULTS });
    }

    const newData = { ...(doc.data || {}) };
    for (const key of Object.keys(payload)) {
      if (
        payload[key] &&
        typeof payload[key] === "object" &&
        !Array.isArray(payload[key]) &&
        newData[key] &&
        typeof newData[key] === "object"
      ) {
        newData[key] = { ...newData[key], ...payload[key] };
      } else {
        newData[key] = payload[key];
      }
    }

    doc.data = newData;
    await doc.save();

    return res.json({ message: "Settings updated", settings: doc.data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update settings" });
  }
};

export default { getSettings, updateSettings };
