import mongoose from "mongoose";

const tentSchema = new mongoose.Schema(
  {
    campId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Camp",
      required: true,
      index: true, // Optimized for searching
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    pricePerNight: { type: Number, required: true, min: 0 }, // In ETB
    amenities: [String],
    images: [String],
    available: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
    // Removed direct booking reference array to prevent unbounded growth issues
    // We query bookings by tentId instead (more scalable)
  },
  { timestamps: true }
);

export default mongoose.models.Tent || mongoose.model("Tent", tentSchema);