import Tent from "../models/Tent.model.js";
import Camp from "../models/Camp.model.js";

// ===== Create Tent =====
export const createTent = async (req, res) => {
  try {
    const { campId } = req.params;
    const { name, description, capacity, pricePerNight, amenities, images } = req.body;

    const camp = await Camp.findById(campId);
    if (!camp) return res.status(404).json({ error: "Camp not found." });

    // Only approved managers owning the camp can add tents
    if (camp.managerId.toString() !== req.user.id)
      return res.status(403).json({ error: "You can only add tents to your own camp." });

    if (camp.status !== "approved")
      return res.status(400).json({ error: "You can only add tents to approved camps." });

    const tent = await Tent.create({
      campId,
      managerId: req.user.id,
      name,
      description,
      capacity,
      pricePerNight,
      amenities,
      images,
    });

    return res.status(201).json({
      message: "Tent created successfully.",
      tent,
    });
  } catch (err) {
    console.error("Tent creation error:", err);
    res.status(500).json({ error: "Server error during tent creation." });
  }
};

// ===== Get All Tents for a Camp =====
export const getTentsByCamp = async (req, res) => {
  try {
    const { campId } = req.params;

    const tents = await Tent.find({
      campId,
      deletedAt: null,
      available: true,
    });

    return res.status(200).json({
      message: "Tents retrieved successfully.",
      tents,
    });
  } catch (err) {
    console.error("Fetch tents error:", err);
    res.status(500).json({ error: "Server error retrieving tents." });
  }
};

// ===== Edit Tent =====
export const updateTent = async (req, res) => {
  try {
    const { tentId } = req.params;
    const tent = await Tent.findById(tentId);
    if (!tent) return res.status(404).json({ error: "Tent not found." });

    if (tent.managerId.toString() !== req.user.id)
      return res.status(403).json({ error: "You can only edit your own tents." });

    Object.assign(tent, req.body);
    await tent.save();

    return res.status(200).json({
      message: "Tent updated successfully.",
      tent,
    });
  } catch (err) {
    console.error("Update tent error:", err);
    res.status(500).json({ error: "Server error updating tent." });
  }
};

// ===== Soft Delete Tent =====
export const deleteTent = async (req, res) => {
  try {
    const { tentId } = req.params;
    const tent = await Tent.findById(tentId);
    if (!tent) return res.status(404).json({ error: "Tent not found." });

    if (tent.managerId.toString() !== req.user.id)
      return res.status(403).json({ error: "You can only delete your own tents." });

    tent.deletedAt = new Date();
    await tent.save();

    return res.status(200).json({ message: "Tent deleted successfully." });
  } catch (err) {
    console.error("Delete tent error:", err);
    res.status(500).json({ error: "Server error deleting tent." });
  }
};
