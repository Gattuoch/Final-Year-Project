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
    coordinates: Joi.object({
      lat: Joi.number().required(),
      lng: Joi.number().required(),
    }).required(),
  }).required(),
  basePrice: Joi.number().min(50).required(),
  amenities: Joi.array().items(Joi.string()).default([]),
  images: Joi.array().items(Joi.string()).default([]),
  videoLink: Joi.string().allow("").optional(),
  status: Joi.string().valid("pending", "approved", "rejected").default("pending"),
});

// ✅ 2. CREATE CAMP
export const createCamp = async (req, res, next) => {
  try {
    const { error } = campValidator.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.message });

    const camp = new Camp(req.body);
    await camp.save();

    res.status(201).json({
      success: true,
      message: "Camp created successfully and is pending approval.",
      data: camp
    });
  } catch (err) {
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
    const { page = 1, limit = 12, location, minPrice, maxPrice, search } = req.query;
    const filter = { status: "approved", deletedAt: null };

    if (location) filter["location.region"] = { $regex: location, $options: "i" };
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