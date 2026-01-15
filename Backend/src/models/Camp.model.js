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
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    
    // Combined Location
    location: {
      address: { type: String, required: true },
      region: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },

    // Combined Display & Status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "inactive"],
      default: "pending",
    },
    statusColor: String,
    textColor: String,
    badge: String,

    // Stats
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    basePrice: { type: Number, required: true }, // ETB price
    revenue: { type: Number, default: 0 },

    amenities: [String],
    images: [String], // Array of URLs
    videoLink: String,
    
    upgradeHistory: [upgradeHistorySchema],
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Camp || mongoose.model("Camp", campSchema);