import User from "../models/User.model.js";

// ✅ Get all pending camp managers
export const getPendingManagers = async (req, res) => {
  try {
    const pendingManagers = await User.find({
      role: "manager",
      "businessInfo.status": "pending",
    }).select("-password");

    if (pendingManagers.length === 0) {
      return res.status(200).json({ message: "No pending camp managers found." });
    }

    return res.status(200).json({
      message: "Pending camp managers retrieved successfully.",
      managers: pendingManagers,
    });
  } catch (err) {
    console.error("❌ Error fetching pending managers:", err);
    return res.status(500).json({ error: "Failed to fetch pending managers." });
  }
};

// ✅ Approve a camp manager
export const approveManager = async (req, res) => {
  try {
    const { id } = req.params;
    const manager = await User.findById(id);

    if (!manager || manager.role !== "manager") {
      return res.status(404).json({ error: "Manager not found." });
    }

    if (manager.businessInfo.status === "approved") {
      return res.status(400).json({ error: "Manager is already approved." });
    }

    manager.businessInfo.status = "approved";
    await manager.save();

    return res.status(200).json({
      message: `${manager.fullName} has been approved successfully.`,
      manager: {
        id: manager._id,
        email: manager.email,
        status: manager.businessInfo.status,
      },
    });
  } catch (err) {
    console.error("❌ Error approving manager:", err);
    return res.status(500).json({ error: "Failed to approve manager." });
  }
};

// ✅ Reject a camp manager
export const rejectManager = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const manager = await User.findById(id);
    if (!manager || manager.role !== "manager") {
      return res.status(404).json({ error: "Manager not found." });
    }

    if (manager.businessInfo.status === "rejected") {
      return res.status(400).json({ error: "Manager is already rejected." });
    }

    manager.businessInfo.status = "rejected";
    manager.businessInfo.rejectionReason = reason || "Not specified";
    await manager.save();

    return res.status(200).json({
      message: `${manager.fullName} has been rejected.`,
      manager: {
        id: manager._id,
        email: manager.email,
        status: manager.businessInfo.status,
        reason: manager.businessInfo.rejectionReason,
      },
    });
  } catch (err) {
    console.error("❌ Error rejecting manager:", err);
    return res.status(500).json({ error: "Failed to reject manager." });
  }
};
