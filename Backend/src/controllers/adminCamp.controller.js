import Camp from "../models/Camp.js";

// Helper: build filters from query
const buildFilters = (query) => {
  const { status, region, search } = query;
  const filters = { deletedAt: null };

  if (status) {
    // accept either lowercase or proper-cased values
    const s = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    filters.status = s;
  }

  if (region) {
    filters["location.region"] = region;
  }

  if (search) {
    const re = new RegExp(search, "i");
    filters.$or = [{ name: re }, { description: re }];
  }

  return filters;
};

// GET /api/camps/admin - list camps for admin with filters, sort, pagination
export const getAdminCamps = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || "20", 10)));
    const sortBy = req.query.sort || "-createdAt"; // default newest first

    const filters = buildFilters(req.query);

    const total = await Camp.countDocuments(filters);
    const totalPages = Math.ceil(total / limit);

    const camps = await Camp.find(filters)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.status(200).json({
      message: "Admin camps retrieved successfully",
      camps,
      page,
      totalPages,
      total,
    });
  } catch (err) {
    console.error("❌ Error fetching admin camps:", err);
    return res.status(500).json({ error: "Failed to fetch camps for admin." });
  }
};

// GET /api/camps/admin/stats - quick counts for dashboard
export const getCampStats = async (req, res) => {
  try {
    const total = await Camp.countDocuments({ deletedAt: null });
    const active = await Camp.countDocuments({ status: "Active", deletedAt: null });
    const pending = await Camp.countDocuments({ status: "Pending", deletedAt: null });
    const inactive = await Camp.countDocuments({ status: "Inactive", deletedAt: null });

    return res.status(200).json({
      message: "Camp stats retrieved",
      stats: { total, active, pending, inactive },
    });
  } catch (err) {
    console.error("❌ Error computing camp stats:", err);
    return res.status(500).json({ error: "Failed to compute camp stats." });
  }
};

// PATCH /api/camps/admin/:id/status - change status (approve/reject/activate/deactivate)
export const updateCampStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "status is required in body" });

    const allowed = ["Active", "Pending", "Inactive", "Rejected"];
    const normalized = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    if (!allowed.includes(normalized)) {
      return res.status(400).json({ error: `status must be one of: ${allowed.join(", ")}` });
    }

    const camp = await Camp.findById(req.params.id);
    if (!camp || camp.deletedAt) return res.status(404).json({ error: "Camp not found" });

    camp.status = normalized;
    await camp.save();

    return res.status(200).json({ message: "Camp status updated", camp });
  } catch (err) {
    console.error("❌ Error updating camp status:", err);
    return res.status(500).json({ error: "Failed to update camp status." });
  }
};

// DELETE /api/camps/admin/:id - permanent delete (admin)
export const adminDeleteCamp = async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) return res.status(404).json({ error: "Camp not found" });

    await camp.remove();

    return res.status(200).json({ message: "Camp permanently deleted." });
  } catch (err) {
    console.error("❌ Error deleting camp:", err);
    return res.status(500).json({ error: "Failed to delete camp." });
  }
};

export default {
  getAdminCamps,
  getCampStats,
  updateCampStatus,
  adminDeleteCamp,
};
