import mongoose from 'mongoose';

const ABTestSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    variant: { type: String, required: true },
    traffic: { type: String, required: true },
    status: { type: String, enum: ['running', 'completed', 'paused'], default: 'running' },
    startDate: { type: String, required: true },
    metric: { type: String, required: true },
    results: {
        variantA: { traffic: { type: Number, default: 50 }, conversions: { type: Number, default: 0 }, visitors: { type: Number, default: 0 }, rate: { type: Number, default: 0 } },
        variantB: { traffic: { type: Number, default: 50 }, conversions: { type: Number, default: 0 }, visitors: { type: Number, default: 0 }, rate: { type: Number, default: 0 } },
        improvement: { type: Number, default: 0 }
    }
}, { timestamps: true });


export default mongoose.models.ABTest || mongoose.model('ABTest', ABTestSchema);
