import mongoose from "mongoose";

const CampSchema = new mongoose.Schema(
  {
    // Basic info
    name: { type: String, required: true },
    description: String,

    // Location
    location: {
      region: String,
      description: String,
      address: String,
    },

    // Status
    status: {
      type: String,
      enum: ["Active", "Pending", "Inactive"],
      default: "Active",
    },
    statusColor: String,
    textColor: String,

    // Capacity
    capacity: {
      current: { type: Number, default: 0 },
      total: Number,
    },

    // Ratings
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },

    // Pricing & revenue
    price: Number,
    revenue: { type: Number, default: 0 },

    // Amenities
    amenities: [String],
    badge: String,

    // Images
    images: [String],
    image: String,
  },
  { timestamps: true }
);

// ✅ Safe export (prevents overwrite in dev / hot reload)
export default mongoose.models.Camp || mongoose.model("CampHome", CampSchema);
