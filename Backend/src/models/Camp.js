import mongoose from "mongoose";

const CampSchema = new mongoose.Schema(
  {
    // Basic info
    name: { type: String, required: true },
    description: String,

    // Location (merged)
    location: {
      region: String,
      description: String,
      address: String, // optional flat location support
    },

    // Status
    status: {
      type: String,
      enum: ["Active", "Pending", "Inactive"],
      default: "Active",
    },
    statusColor: String,
    textColor: String,

    // Capacity (merged)
    capacity: {
      current: { type: Number, default: 0 },
      total: { type: Number },
    },

    // Ratings & reviews
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },

    // Pricing & revenue
    price: Number,
    revenue: { type: Number, default: 0 },

    // Amenities & badges
    amenities: [String],
    badge: String,

    // Images (merged)
    images: [String],
    image: String, // optional single image
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError
export default mongoose.models.Camp || mongoose.model("Camp", CampSchema);
