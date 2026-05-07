import Camp from "../models/Camp.model.js";
import User from "../models/User.model.js";
import Notification from "../models/Notification.model.js";
import AuditLog from "../models/AuditLog.model.js";

// Get Pending Camps
export const getPendingCamps = async (req, res) => {
  try {
    const camps = await Camp.find({ status: "pending", deletedAt: null })
      .populate("managerId", "fullName firstName lastName")
      .sort({ createdAt: -1 });
    res.json(camps);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Active Camps
export const getActiveCamps = async (req, res) => {
  try {
    const camps = await Camp.find({ status: { $in: ["approved", "inactive"] }, deletedAt: null })
      .populate("managerId", "fullName firstName lastName")
      .sort({ createdAt: -1 });
    res.json(camps);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Camp Status (Approve, Reject, Block, Ban)
export const updateCampStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const camp = await Camp.findById(id);
    if (!camp) return res.status(404).json({ message: "Camp not found" });

    // Ensure status is valid according to schema (pending, approved, rejected, inactive)
    if (status === "banned") {
      // Treat banned as soft delete or inactive
      camp.status = "inactive";
      camp.deletedAt = new Date();
    } else {
      camp.status = status;
    }

    await camp.save();

    // Create Audit Log
    await AuditLog.create({
      actor: req.user._id,
      action: `CAMP_${status.toUpperCase()}`,
      targetCollection: "camps",
      targetId: camp._id,
      metadata: { campName: camp.name, reason }
    });

    // Notify the manager
    try {
      await Notification.create({
        userId: camp.managerId,
        type: "system_alert",
        subject: `Camp Status Updated: ${status.toUpperCase()}`,
        body: `Your camp "${camp.name}" has been marked as ${status}. ${reason ? `Reason: ${reason}` : ''}`,
        meta: { campId: camp._id }
      });
    } catch (notifErr) {
      console.warn("Could not send notification", notifErr);
    }

    res.json({ message: `Camp status updated to ${status}`, camp });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Send mock warning to camp
export const sendCampWarning = async (req, res) => {
  try {
    const { id } = req.params;
    const { warningMessage } = req.body;

    const camp = await Camp.findById(id).select("managerId name");
    if (!camp) return res.status(404).json({ message: "Camp not found" });

    // Send Notification
    await Notification.create({
      userId: camp.managerId,
      type: "warning",
      subject: `Warning from Admin regarding Camp "${camp.name}"`,
      body: warningMessage,
      meta: { campId: camp._id }
    });

    // Create Audit Log
    await AuditLog.create({
      actor: req.user._id,
      action: "CAMP_WARNING",
      targetCollection: "camps",
      targetId: camp._id,
      metadata: { campName: camp.name, message: warningMessage }
    });

    res.json({ message: "Warning sent to camp manager successfully", warningMessage });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// === KYC Management (Users with businessInfo) ===

// Get KYC Queue
export const getKYCQueue = async (req, res) => {
  try {
    // Managers whose KYC is pending
    const queue = await User.find({
      role: { $in: ["manager", "camp_manager"] },
      "businessInfo.status": { $in: ["pending", "submitted"] }
    }).select("fullName firstName lastName businessInfo createdAt").sort({ "businessInfo.submittedAt": -1, createdAt: -1 });
    res.json(queue);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update KYC Status
export const updateKYCStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // should be 'approved' or 'rejected'

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.businessInfo) {
      user.businessInfo = { status: status };
    } else {
      user.businessInfo.status = status;
    }

    await user.save();

    // Create Audit Log
    await AuditLog.create({
      actor: req.user._id,
      action: `CAMP_KYC_${status.toUpperCase()}`,
      targetCollection: "users",
      targetId: user._id,
      metadata: { managerEmail: user.email, status }
    });

    // Notify the user about KYC update
    try {
      await Notification.create({
        userId: user._id,
        type: "system_alert",
        subject: `KYC Document ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        body: `Your business verification document has been ${status}.`,
      });
    } catch (notifErr) {
      console.warn("Could not send KYC notification", notifErr);
    }

    res.json({ message: `KYC verified & set to ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get recent camp moderation logs
export const getCampLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({
      action: { $regex: /^CAMP_/ }
    })
    .populate("actor", "fullName")
    .sort({ createdAt: -1 })
    .limit(10);
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
