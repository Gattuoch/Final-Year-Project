import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    ticketType: {
      type: String,
      enum: ["Domestic Visitor", "International Visitor"],
      required: true,
    },

    category: {
      type: String,
      enum: ["Adult (18+)", "Child (3–17)", "Infant (0–2)"],
      required: true,
    },

    visitDate: {
      type: Date,
      required: true,
    },

    visitTime: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    subtotal: Number,
    serviceFee: Number,
    total: Number,

    specialRequest: String,

    status: {
      type: String,
      default: "Booked",
    },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;