import Camp from "../models/CampHome.js";
import Joi from "joi";

// Validation schema
const campSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  rating: Joi.number().min(0).max(5).optional(),
  reviews: Joi.number().min(0).optional(),
  description: Joi.string().allow("").optional(),
  price: Joi.number().min(0).optional(),
  amenities: Joi.array().items(Joi.string()).optional(),
  badge: Joi.string().optional(),
  statusColor: Joi.string().optional(),
  TextColor: Joi.string().optional(),
  image: Joi.string().optional()
});

// CREATE
export const createCamp = async (req, res, next) => {
  try {
    const { error } = campSchema.validate(req.body);
    if (error)
      return res.status(400).json({ success: false, message: error.message });

    const camp = new Camp(req.body);
    await camp.save();

    res.status(201).json({
      success: true,
      message: "Camp created successfully",
      data: camp
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE
export const updateCamp = async (req, res, next) => {
  try {
    const { error } = campSchema.validate(req.body);
    if (error)
      return res.status(400).json({ success: false, message: error.message });

    const camp = await Camp.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    if (!camp)
      return res.status(404).json({ success: false, message: "Camp not found" });

    res.json({
      success: true,
      message: "Camp updated successfully",
      data: camp
    });
  } catch (err) {
    next(err);
  }
};

// DELETE
export const deleteCamp = async (req, res, next) => {
  try {
    const camp = await Camp.findByIdAndDelete(req.params.id);

    if (!camp)
      return res.status(404).json({ success: false, message: "Camp not found" });

    res.json({
      success: true,
      message: "Camp deleted successfully"
    });
  } catch (err) {
    next(err);
  }
};

// GET SINGLE
export const getCampById = async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id);

    if (!camp) {
      return res.json({
        success: false,
        message: "Camp not found",
      });
    }

    return res.json({
      success: true,
      data: camp,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch camp",
    });
  }
};

// LIST + FILTER + SORT + PAGINATION
// LIST + FILTER + SORT + PAGINATION
export const listCamps = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      location,
      minPrice,
      maxPrice,
      amenity,
      minRating,
      search,
      sort
    } = req.query;

    const qPage = Math.max(1, parseInt(page) || 1);
    const qLimit = Math.max(1, Math.min(100, parseInt(limit) || 12));

    const filter = {};

    if (location)
      filter.location = { $regex: location, $options: "i" };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (amenity)
      filter.amenities = { $in: [amenity] };

    if (minRating)
      filter.rating = { $gte: Number(minRating) };

    if (search) {
      const s = search.trim();
      filter.$or = [
        { name: { $regex: s, $options: "i" } },
        { location: { $regex: s, $options: "i" } },
        { description: { $regex: s, $options: "i" } }
      ];
    }

    let sortObj = { createdAt: -1 };
    if (sort) {
      const [field, dir] = sort.split(":");
      sortObj = { [field]: dir === "asc" ? 1 : -1 };
    }

    const skip = (qPage - 1) * qLimit;

    const [items, total] = await Promise.all([
      Camp.find(filter).sort(sortObj).skip(skip).limit(qLimit).lean(),
      Camp.countDocuments(filter)
    ]);

    // ⛔ If no data found, return message
    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No camps found"
      });
    }

    // ✅ Data found
    res.json({
      success: true,
      data: items,
      page: qPage,
      limit: qLimit,
      total,
      totalPages: Math.ceil(total / qLimit)
    });

  } catch (err) {
    next(err);
  }
};
// SEARCH CAMPS
// FIXED SEARCH CONTROLLER
export const searchCamps = async (req, res) => {
  try {
    const { location } = req.query;

    const filter = {};

    if (location && location.trim() !== "") {
      filter.location = { $regex: location, $options: "i" };
    }

    const camps = await Camp.find(filter).lean();

    if (camps.length === 0) {
      return res.json({
        success: false,
        message: "No camps found for your search.",
        data: [],
        total: 0,
      });
    }

    return res.json({
      success: true,
      message: "Camps found.",
      data: camps,
      total: camps.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ⭐ EXPLORE CAMPS
export const getAllCamps = async (req, res) => {
  try {
    const camps = await Camp.find().lean();

    res.status(200).json({
      success: true,
      count: camps.length,
      message: camps.length ? "Camps fetched successfully" : "No camps available",
      data: camps,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching camps",
    });
  }
};

// GET CAMP DETATILS
export const getCampDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const camp = await Camp.findById(id);

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Camp details retrieved successfully",
      data: camp,
    });

  } catch (error) {
    console.error("Error fetching camp details:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};




