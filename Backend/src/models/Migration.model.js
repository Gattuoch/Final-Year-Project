import mongoose from 'mongoose';

const { Schema } = mongoose;

const MigrationSchema = new Schema({
    migrationId: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    executedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    logs: [{ type: String }],
    affectedCollections: [{ type: String }],
    date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Migration || mongoose.model('Migration', MigrationSchema);
