import Camp from "../models/Camp.model.js";
import User from "../models/User.model.js";

// ================================
// CAMP MANAGER CONTROLS
// ================================

// ✅ Create new camp
export const createCamp = async (req, res) => {
  try {
    const managerId = req.user.id;
    const manager = await User.findById(managerId);

    if (!manager || manager.role !== "manager") {
      return res.status(403).json({ error: "Only camp managers can create camps." });
    }

    if (manager.businessInfo.status !== "approved") {
      return res.status(403).json({ error: "Your manager account is not approved yet." });
    }

    const { name, description, location, amenities, basePrice, images, videoLink } = req.body;

    const newCamp = await Camp.create({
      managerId,
      name,
      description,
      location,
      amenities,
      basePrice,
      images,
      videoLink,
      status: "pending",
    });

    return res.status(201).json({
      message: "Camp created successfully and sent for admin approval.",
      camp: newCamp,
    });
  } catch (err) {
    console.error("❌ Error creating camp:", err);
    return res.status(500).json({ error: "Failed to create camp." });
  }
};

// ✅ Get all approved camps (public)
export const getAllApprovedCamps = async (req, res) => {
  try {
    const camps = await Camp.find({
      status: "approved",
      deletedAt: null,
    }).populate("managerId", "fullName email");

    return res.status(200).json({
      message: "Approved camps retrieved successfully.",
      camps,
    });
  } catch (err) {
    console.error("❌ Error fetching camps:", err);
    return res.status(500).json({ error: "Failed to fetch camps." });
  }
};

// ✅ Get single camp
export const getCampById = async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id).populate("managerId", "fullName email");
    if (!camp || camp.deletedAt) {
      return res.status(404).json({ error: "Camp not found." });
    }
    return res.status(200).json(camp);
  } catch (err) {
    console.error("❌ Error fetching camp:", err);
    return res.status(500).json({ error: "Failed to fetch camp details." });
  }
};

// ✅ Edit camp (manager only)
export const editCamp = async (req, res) => {
  try {
    const managerId = req.user.id;
    const camp = await Camp.findById(req.params.id);

    if (!camp) return res.status(404).json({ error: "Camp not found." });
    if (camp.managerId.toString() !== managerId) {
      return res.status(403).json({ error: "You can only edit your own camps." });
    }

    const oldData = camp.toObject();
    const updates = req.body;

    Object.assign(camp, updates);
    await camp.save();

    const changedFields = Object.keys(updates)
      .map((key) => `${key} updated`)
      .join(", ");
    camp.upgradeHistory.push({ changes: changedFields });
    await camp.save();

    return res.status(200).json({
      message: "Camp updated successfully.",
      camp,
    });
  } catch (err) {
    console.error("❌ Error updating camp:", err);
    return res.status(500).json({ error: "Failed to update camp." });
  }
};

// ✅ Soft delete
export const softDeleteCamp = async (req, res) => {
  try {
    const managerId = req.user.id;
    const camp = await Camp.findById(req.params.id);

    if (!camp) return res.status(404).json({ error: "Camp not found." });
    if (camp.managerId.toString() !== managerId) {
      return res.status(403).json({ error: "Unauthorized to delete this camp." });
    }

    camp.deletedAt = new Date();
    await camp.save();

    return res.status(200).json({ message: "Camp deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting camp:", err);
    return res.status(500).json({ error: "Failed to delete camp." });
  }
};

// ================================
// ADMIN CONTROLS
// ================================

// ✅ Get all pending camps
export const getPendingCamps = async (req, res) => {
  try {
    const pending = await Camp.find({ status: "pending", deletedAt: null }).populate(
      "managerId",
      "fullName email"
    );

    if (pending.length === 0)
      return res.status(200).json({ message: "No pending camps found." });

    return res.status(200).json({
      message: "Pending camps retrieved successfully.",
      camps: pending,
    });
  } catch (err) {
    console.error("❌ Error fetching pending camps:", err);
    return res.status(500).json({ error: "Failed to fetch pending camps." });
  }
};

// ✅ Approve camp
export const approveCamp = async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) return res.status(404).json({ error: "Camp not found." });

    camp.status = "approved";
    await camp.save();

    return res.status(200).json({
      message: `${camp.name} has been approved successfully.`,
      camp,
    });
  } catch (err) {
    console.error("❌ Error approving camp:", err);
    return res.status(500).json({ error: "Failed to approve camp." });
  }
};

// ✅ Reject camp
export const rejectCamp = async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) return res.status(404).json({ error: "Camp not found." });

    camp.status = "rejected";
    await camp.save();

    return res.status(200).json({
      message: `${camp.name} has been rejected.`,
      camp,
    });
  } catch (err) {
    console.error("❌ Error rejecting camp:", err);
    return res.status(500).json({ error: "Failed to reject camp." });
  }
};
