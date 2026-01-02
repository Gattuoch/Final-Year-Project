import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // Relations
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    camp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Camp",
      required: true,
    },

    // Booking details
    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Paid", "Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },

    checkInDate: {
      type: Date,
      required: true,
    },

    checkOutDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError
export default mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema);
