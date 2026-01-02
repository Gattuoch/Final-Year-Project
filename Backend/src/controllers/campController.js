import Camp from "../models/Camp.js";

// GET ALL CAMPS
export const getAllCamps = async (req, res) => {
  try {
    const camps = await Camp.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Camps retrieved successfully",
      camps,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE CAMP
export const createCamp = async (req, res) => {
  try {
    const { name, location, capacity } = req.body;

    const camp = await Camp.create({
      name,
      location,
      capacity,
      createdBy: req.user._id, // from protect middleware
      status: "Active",
    });

    res.status(201).json({
      message: "Camp created successfully",
      camp,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE CAMP
export const updateCamp = async (req, res) => {
  try {
    const camp = await Camp.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    res.status(200).json({
      message: "Camp updated successfully",
      camp,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE CAMP
export const deleteCamp = async (req, res) => {
  try {
    const camp = await Camp.findByIdAndDelete(req.params.id);

    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    res.status(200).json({
      message: "Camp deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
