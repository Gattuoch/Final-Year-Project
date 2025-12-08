import mongoose from "mongoose";

const CampSchema = new mongoose.Schema({
  name: String,
  location: String,
  rating: Number,
  reviews: Number,
  description: String,
  price: Number,
  amenities: Array,
  badge: String,
  statusColor: String,
  TextColor: String,
  image: String,
});

// ⚠️ Fix OverwriteModelError
export default mongoose.models.Camp || mongoose.model("Camp", CampSchema);
