import mongoose from "mongoose";

const SystemMetricSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['health', 'service', 'component'],
        default: 'health'
    },
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    unit: String,
    description: String,
    status: {
        type: String,
        enum: ['healthy', 'warning', 'critical', 'Operational', 'Degraded', 'Maintenance'],
        default: 'Operational'
    },
    category: String, // e.g. 'external-service', 'system-health', 'component-status'
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const SystemMetric = mongoose.model("SystemMetric", SystemMetricSchema);
export default SystemMetric;
