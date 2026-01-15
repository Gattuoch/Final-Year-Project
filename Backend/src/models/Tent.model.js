import mongoose from "mongoose";

const tentSchema = new mongoose.Schema(
  {
    campId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Camp",
      required: true,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    pricePerNight: { type: Number, required: true, min: 0 },
    amenities: [String],
    images: [String],
    available: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Tent || mongoose.model("Tent", tentSchema);