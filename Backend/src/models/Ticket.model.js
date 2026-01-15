import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  price: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Ticket", ticketSchema);
