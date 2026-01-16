import Camp from "../models/Camp.model.js";
import Joi from "joi";

// ✅ 1. THE VALIDATOR
const campValidator = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(2000).required(),
  managerId: Joi.string().required(),
  location: Joi.object({
    address: Joi.string().required(),
    region: Joi.string().optional(),
    // coordinates are optional to support simple frontend payloads that provide only an address
    coordinates: Joi.object({
      lat: Joi.number().required(),
      lng: Joi.number().required(),
    }).optional(),
  }).required(),
  // allow basePrice >= 0 so UI can create drafts or low-price entries without failing validation
  basePrice: Joi.number().min(0).required(),
  amenities: Joi.array().items(Joi.string()).default([]),
  images: Joi.array().items(Joi.string()).default([]),
  videoLink: Joi.string().allow("").optional(),
  status: Joi.string().valid("pending", "approved", "rejected").default("pending"),
}).unknown(true); // allow unknown keys (strip them at validation time)

// ✅ 2. CREATE CAMP
export const createCamp = async (req, res, next) => {
  try {
    // Normalize frontend payloads: the UI often sends `price`, `location` as a string,
    // `image` as a single URL and `amenities` as comma-separated string. Also, when
    // authenticated, use req.user._id as managerId if not provided.
    const payload = { ...req.body };

    // use authenticated user as manager if available
    if (!payload.managerId && req.user && req.user._id) {
      payload.managerId = String(req.user._id);
    }

    // if managerId was provided as an object (e.g. a user document), coerce to string id
    if (payload.managerId && typeof payload.managerId !== "string") {
      if (payload.managerId._id) payload.managerId = String(payload.managerId._id);
      else payload.managerId = String(payload.managerId);
    }

    // map `price` -> `basePrice`
    if (payload.price !== undefined) {
      const n = Number(payload.price);
      payload.basePrice = Number.isFinite(n) ? n : 0;
      delete payload.price;
    }

    // normalize location: allow string or object
    if (payload.location && typeof payload.location === "string") {
      payload.location = { address: payload.location };
    }

    // normalize amenities: allow comma-separated string
    if (payload.amenities && typeof payload.amenities === "string") {
      payload.amenities = payload.amenities.split(",").map((s) => s.trim()).filter(Boolean);
    }

    // normalize image -> images array
    if (payload.image && !payload.images) {
      payload.images = [payload.image];
    }

    // Provide defaults for required-ish fields to avoid Joi failing for simple UI payloads
    payload.description = payload.description || payload.name || "";
    payload.basePrice = payload.basePrice ?? 0;

    // validate and strip unknown fields (e.g. `badge`) so they don't cause a 400
    const { error, value: validated } = campValidator.validate(payload, { stripUnknown: true });
    if (error) {
      // return a clear Joi message for the client
      return res.status(400).json({ success: false, message: error.message });
    }

    const camp = new Camp(validated);
    await camp.save();

    res.status(201).json({
      success: true,
      message: "Camp created successfully and is pending approval.",
      data: camp,
    });
  } catch (err) {
    console.error("createCamp error:", err);
    next(err);
  }
};

// ✅ 3. UPDATE / EDIT CAMP
export const updateCamp = async (req, res, next) => {
  try {
    const camp = await Camp.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!camp) return res.status(404).json({ success: false, message: "Camp not found" });

    res.json({ success: true, message: "Camp updated successfully", data: camp });
  } catch (err) {
    next(err);
  }
};

// ✅ 4. LIST & SEARCH (Combined Logic)
export const listCamps = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, location, minPrice, maxPrice, search, badge } = req.query;
    // Return non-deleted camps by default. Previously we forced `status: "approved"` which
    // prevented listing total camps when clicking the "Total Camps" stat. Make filtering
    // by `badge` optional and case-insensitive; when no badge is provided return all
    // non-deleted camps (so the Total stat shows data).
    const filter = { deletedAt: null };

    if (location) filter["location.region"] = { $regex: location, $options: "i" };
    // allow filtering by badge (e.g. Active, Pending, Inactive) from the frontend
    if (badge) filter.badge = { $regex: `^${badge}$`, $options: "i" };
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
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Camp.countDocuments(filter);

    res.json({
      success: true,
      message: items.length ? "Camps fetched successfully" : "No camps found",
      data: items,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
};

// ✅ LIST ALL CAMPS (no pagination) - used by frontend components that want a full list
export const listAllCamps = async (req, res) => {
  try {
    const items = await Camp.find({ deletedAt: null }).sort({ createdAt: -1 });
    return res.json({ success: true, message: items.length ? 'All camps fetched' : 'No camps found', data: items });
  } catch (err) {
    console.error('listAllCamps error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch all camps' });
  }
};

// ✅ 5. GET CAMP DETAILS
export const getCampDetails = async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id).populate("managerId", "fullName email");
    if (!camp) return res.status(404).json({ success: false, message: "Camp not found" });
    res.json({ success: true, data: camp });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching camp details" });
  }
};

// ✅ 6. DELETE CAMP (Soft-Delete)
export const deleteCamp = async (req, res, next) => {
  try {
    const camp = await Camp.findByIdAndUpdate(req.params.id, { 
        deletedAt: new Date(), 
        status: "inactive" 
    });
    if (!camp) return res.status(404).json({ success: false, message: "Camp not found" });
    res.json({ success: true, message: "Camp deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// ✅ 7. ADMIN: GET PENDING CAMPS
export const getPendingCamps = async (req, res) => {
  try {
    const camps = await Camp.find({ status: "pending", deletedAt: null });
    res.json({ success: true, data: camps });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch pending camps" });
  }
};

// ✅ 8. ADMIN: APPROVE CAMP
export const approveCamp = async (req, res) => {
  try {
    const camp = await Camp.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    if (!camp) return res.status(404).json({ success: false, message: "Camp not found" });
    res.json({ success: true, message: "Camp approved successfully", data: camp });
  } catch (err) {
    res.status(500).json({ success: false, message: "Approval failed" });
  }
};

// ✅ 9. ADMIN: REJECT CAMP
export const rejectCamp = async (req, res) => {
  try {
    const camp = await Camp.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
    if (!camp) return res.status(404).json({ success: false, message: "Camp not found" });
    res.json({ success: true, message: "Camp rejected successfully", data: camp });
  } catch (err) {
    res.status(500).json({ success: false, message: "Rejection failed" });
  }
};