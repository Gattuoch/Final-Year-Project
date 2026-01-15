import mongoose from "mongoose";

const eventVenueSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("EventVenue", eventVenueSchema);
