import mongoose from 'mongoose';

const { Schema } = mongoose;

const BackupSchema = new Schema({
    backupId: { type: String, required: true, unique: true },
    type: { type: String, enum: ['full', 'incremental'], default: 'full' },
    database: { type: String, default: 'MongoDB' },
    size: { type: String },
    status: { type: String, enum: ['success', 'pending', 'failed'], default: 'success' },
    path: { type: String },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Backup || mongoose.model('Backup', BackupSchema);
