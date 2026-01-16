import mongoose from 'mongoose';

const { Schema } = mongoose;

const BanSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
	reason: { type: String, required: true },
	bannedBy: { type: Schema.Types.ObjectId, ref: 'User' },
	startsAt: { type: Date, default: Date.now },
	endsAt: { type: Date }, // null => indefinite
	active: { type: Boolean, default: true, index: true }
}, { timestamps: true });

export default mongoose.models.Ban || mongoose.model('Ban', BanSchema);
