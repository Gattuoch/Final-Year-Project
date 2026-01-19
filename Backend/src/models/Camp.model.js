import mongoose from "mongoose";

const CampSchema = new mongoose.Schema(
  {
    // Ownership & Identity
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    // Location (Supports simple address string or geo-coordinates)
    location: {
      address: { type: String, required: true },
      region: { type: String, default: "" },
      description: { type: String, default: "" },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },

    // Status & Approval Flow
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "inactive"],
      default: "pending",
      index: true,
    },
    statusColor: String, // UI helper
    badge: String, // e.g., "Top Rated"

    // Financials
    basePrice: { type: Number, required: true, default: 0 }, // Used for booking calc
    currency: { type: String, default: "ETB" },
    
    // Capacity & Stats
    capacity: {
      current: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },

    // Media & Features
    images: { type: [String], default: [] }, // Array of URLs
    amenities: { type: [String], default: [] }, // e.g., ["Wifi", "Parking"]
    videoLink: String,

    // Soft Delete
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, collection: "camphomes" }
);

// Virtual: 'price' alias for frontend compatibility
CampSchema.virtual('price').get(function() {
  return this.basePrice;
});

// Ensure virtuals are included in JSON
CampSchema.set('toJSON', { virtuals: true });
CampSchema.set('toObject', { virtuals: true });

export default mongoose.models.Camp || mongoose.model("Camp", CampSchema);