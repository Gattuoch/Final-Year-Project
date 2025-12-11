import mongoose from "mongoose";

const CampSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    description: { type: String },
    price: { type: Number, default: 0 }, // ETB price per night
    amenities: [{ type: String }],
    badge: { type: String },
    statusColor: { type: String },
    TextColor: { type: String },
    image: { type: String }, // URL or path to image
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);
const Camp = mongoose.model("CampHome", CampSchema);
export default Camp;

