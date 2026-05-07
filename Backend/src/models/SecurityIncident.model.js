import mongoose from "mongoose";

const SecurityIncidentSchema = new mongoose.Schema(
  {
    incidentId: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    user: { type: String, default: "N/A" },
    status: { type: String, enum: ["investigating", "resolved", "open"], default: "open" },
    details: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const SecurityIncident = mongoose.model("SecurityIncident", SecurityIncidentSchema);
export default SecurityIncident;
