import mongoose from 'mongoose';

const { Schema } = mongoose;

const SystemLogSchema = new Schema({
    level: { type: String, enum: ['error', 'warning', 'info'], default: 'info', index: true },
    service: { type: String, required: true, index: true },
    user: { type: String },
    message: { type: String, required: true },
    details: { type: String },
    timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: false });

export default mongoose.models.SystemLog || mongoose.model('SystemLog', SystemLogSchema);
