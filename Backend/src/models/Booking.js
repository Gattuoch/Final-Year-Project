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
    tickets: {
      type: Number,
      default: 1,
      min: 1,
    },

    amount: {
      type: Number,
      required: true,
    },

    // Payment & booking status
    status: {
      type: String,
      enum: ["Pending", "Paid", "Confirmed", "Cancelled", "Refunded"],
      default: "Pending",
    },

    // Stay dates
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
