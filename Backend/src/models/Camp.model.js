import mongoose from "mongoose";

const upgradeHistorySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  changes: { type: String, required: true },
});

const campSchema = new mongoose.Schema(
  {
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    location: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    amenities: {
      type: [String],
      default: [],
    },
    basePrice: {
      type: Number,
      required: true,
      min: 50,
    },
    images: {
      type: [String], // Cloudinary URLs
      default: [],
    },
    videoLink: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    upgradeHistory: [upgradeHistorySchema],
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Camp", campSchema);
