import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // Relations
    camperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tent",
      required: true,
    },
    campId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Camp", 
      required: true,
    },

    // Stay Details
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    guests: { type: Number, min: 1, required: true },
    
    // Financials
    totalPrice: { type: Number, required: true }, // Stored in ETB

    // Payment Info
    paymentOption: {
      type: String,
      enum: ["chapa", "stripe", "cash_on_arrival", "pending"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded", "failed"],
      default: "unpaid",
    },
    paymentMeta: {
      type: mongoose.Schema.Types.Mixed,
    },

    // Booking Status
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "no-show"],
      default: "pending",
    },

    // Meta & Logic
    idDocumentUrl: { type: String },
    cancelReason: { type: String },
    cancelledAt: { type: Date },
    
    // Automation
    graceExpiry: { type: Date },
    autoCancelAt: { type: Date },
  },
  { timestamps: true }
);

// Grace period calculation
bookingSchema.methods.setGracePeriods = function () {
  const start = new Date(this.checkInDate);
  const now = new Date();
  const diffDays = Math.ceil((start - now) / (1000 * 60 * 60 * 24));

  let graceHours = 8;
  if (diffDays >= 2 && diffDays <= 3) graceHours = 24;
  if (diffDays > 3) graceHours = 48;

  const graceExpiry = new Date(now.getTime() + graceHours * 60 * 60 * 1000);
  this.graceExpiry = graceExpiry;
  this.autoCancelAt = graceExpiry;
};

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);