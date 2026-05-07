import mongoose from 'mongoose';

const FeatureFlagSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    enabled: { type: Boolean, default: false },
    users: { type: Number, default: 0 }, // Mock or count of users using it
}, { timestamps: true });

export default mongoose.models.FeatureFlag || mongoose.model('FeatureFlag', FeatureFlagSchema);
