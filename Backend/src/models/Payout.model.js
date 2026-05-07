import mongoose from 'mongoose';

const { Schema } = mongoose;

const PayoutSchema = new Schema({
    manager: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    camp: { type: Schema.Types.ObjectId, ref: 'Camp', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'processed', 'failed'], default: 'pending', index: true },
    processedAt: { type: Date },
    reference: { type: String }, // Bank reference or transaction ID
}, { timestamps: true });

export default mongoose.models.Payout || mongoose.model('Payout', PayoutSchema);
