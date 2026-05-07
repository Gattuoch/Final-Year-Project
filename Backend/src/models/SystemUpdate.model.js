import mongoose from 'mongoose';

const SystemUpdateSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    version: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['deployed', 'pending', 'available'], default: 'deployed' }
}, { timestamps: true });

export default mongoose.models.SystemUpdate || mongoose.model('SystemUpdate', SystemUpdateSchema);
