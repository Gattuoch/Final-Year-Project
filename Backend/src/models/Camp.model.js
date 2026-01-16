import mongoose from "mongoose";

const CampSchema = new mongoose.Schema(
  {
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    // Location can be flexible between simple string or structured object
    location: {
      address: { type: String, default: "" },
      region: { type: String, default: "" },
      description: { type: String, default: "" },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },

    // Status & display
    status: { type: String, default: "Pending" },
    statusColor: String,
    textColor: String,
    badge: String,

    // Ratings & metrics
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },

    // Pricing & capacity
    price: { type: Number, default: 0 },
    basePrice: { type: Number, default: 0 },
    capacity: {
      current: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },

    // Media & amenities
    images: { type: [String], default: [] },
    image: String,
    amenities: { type: [String], default: [] },

    // Soft-delete
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, collection: 'camphomes' }
);

export default mongoose.models.Camp || mongoose.model("Camp", CampSchema);
