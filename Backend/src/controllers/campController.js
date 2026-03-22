import Camp from "../models/Camp.model.js";
import Joi from "joi";

// ✅ 1. VALIDATOR
const campValidator = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow("").optional(),
  managerId: Joi.string().optional(), // Injected by controller
  location: Joi.object({
    address: Joi.string().required(),
    region: Joi.string().allow("").optional(),
    coordinates: Joi.object({
      lat: Joi.number().optional(),
      lng: Joi.number().optional(),
    }).optional(),
  }).required(),
  basePrice: Joi.number().min(0).required(),
  amenities: Joi.array().items(Joi.string()).default([]),
  images: Joi.array().items(Joi.string()).default([]),
  status: Joi.string().valid("pending", "approved", "rejected").default("pending"),
}).unknown(true);

// ✅ 2. CREATE CAMP
export const createCamp = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    // 1. Attach Manager ID
    if (req.user && req.user._id) {
      payload.managerId = String(req.user._id);
    }

    // 2. Normalize Price (Frontend sends 'price', Model wants 'basePrice')
    if (payload.price !== undefined) {
      payload.basePrice = Number(payload.price) || 0;
    }

    // 3. Normalize Location (Allow string input)
    if (payload.location && typeof payload.location === "string") {
      payload.location = { address: payload.location };
    }

    // 4. Validate
    const { error, value: validated } = campValidator.validate(payload, { stripUnknown: true });
    if (error) return res.status(400).json({ success: false, message: error.message });

    const camp = new Camp(validated);
    await camp.save();

    res.status(201).json({
      success: true,
      message: "Camp created successfully. Pending approval.",
      data: camp,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ 3. LIST CAMPS (Search & Filter)
export const listCamps = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, location, minPrice, maxPrice, search } = req.query;
    
    // Only show approved and non-deleted camps for general booking
    const filter = { status: "approved", deletedAt: null };

    if (location) filter["location.address"] = { $regex: location, $options: "i" };
    
    if (minPrice || maxPrice) {
      filter.basePrice = {};
      if (minPrice) filter.basePrice.$gte = Number(minPrice);
      if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { "location.address": { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const items = await Camp.find(filter)
      .populate("managerId", "fullName")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Camp.countDocuments(filter);

    res.json({
      success: true,
      data: items,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
};

// ✅ 4. LIST ALL (Internal/Admin use)
export const listAllCamps = async (req, res) => {
  try {
    const items = await Camp.find({ deletedAt: null }).sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ 5. GET CAMP DETAILS (For Booking Page)
export const getCampDetails = async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id)
      .populate("managerId", "fullName email phone"); // Send manager info for contact if needed

    if (!camp) return res.status(404).json({ success: false, message: "Camp not found" });

    res.json({ success: true, data: camp });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching details" });
  }
};

// ✅ 6. UPDATE CAMP
export const updateCamp = async (req, res, next) => {
  try {
    const camp = await Camp.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!camp) return res.status(404).json({ success: false, message: "Camp not found" });
    res.json({ success: true, message: "Updated successfully", data: camp });
  } catch (err) {
    next(err);
  }
};

// ✅ 7. DELETE CAMP
export const deleteCamp = async (req, res, next) => {
  try {
    const camp = await Camp.findByIdAndUpdate(req.params.id, { deletedAt: new Date(), status: "inactive" });
    if (!camp) return res.status(404).json({ success: false, message: "Camp not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// --- ADMIN SPECIFIC CONTROLLERS (Merged inline for simplicity) ---

export const getPendingCamps = async (req, res) => {
  try {
    const camps = await Camp.find({ status: "pending", deletedAt: null });
    res.json({ success: true, data: camps });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error" });
  }
};

export const approveCamp = async (req, res) => {
  try {
    const camp = await Camp.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    res.json({ success: true, message: "Approved", data: camp });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error" });
  }
};

export const rejectCamp = async (req, res) => {
  try {
    const camp = await Camp.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
    res.json({ success: true, message: "Rejected", data: camp });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error" });
  }
};