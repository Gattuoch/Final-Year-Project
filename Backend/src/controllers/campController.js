import Camp from "../models/Camp.js";

// GET ALL CAMPS
export const getCamps = async (req, res) => {
  try {
    const camps = await Camp.find();
    res.status(200).json(camps);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch camps" });
  }
};

// ADD NEW CAMP
export const addCamp = async (req, res) => {
  try {
    const camp = new Camp(req.body);
    await camp.save();
    res.status(201).json(camp);
  } catch (error) {
    res.status(500).json({ message: "Failed to add camp" });
  }
};
