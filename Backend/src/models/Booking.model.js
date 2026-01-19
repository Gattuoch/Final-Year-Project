import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    camperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tent",
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    guests: { type: Number, min: 1, required: true },
    totalPrice: { type: Number, required: true },

    // Payment Info
    paymentOption: {
      type: String,
      enum: ["prepaid", "postpaid", "cash_on_arrival", "stripe", "stripe_checkout"],
      default: "prepaid",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    paymentMeta: {
      type: mongoose.Schema.Types.Mixed,
    },

    // Booking Progress
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    idDocumentUrl: { type: String }, // Optional for some roles
    noShow: { type: Boolean, default: false },
    cancelledAt: { type: Date },

    // Automation
    graceExpiry: { type: Date },
    autoCancelAt: { type: Date },
    cancelReason: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Calculate grace window based on stay timing
bookingSchema.methods.setGracePeriods = function () {
  const start = new Date(this.startDate);
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