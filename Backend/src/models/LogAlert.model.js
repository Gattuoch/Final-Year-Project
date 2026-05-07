import mongoose from 'mongoose';

const { Schema } = mongoose;

const LogAlertSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    pattern: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.LogAlert || mongoose.model('LogAlert', LogAlertSchema);
