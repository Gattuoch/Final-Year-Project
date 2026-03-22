import mongoose from 'mongoose';

const { Schema } = mongoose;

const AuditLogSchema = new Schema({
	actor: { type: Schema.Types.ObjectId, ref: 'User' },
	actorIp: { type: String },
	action: { type: String, required: true, index: true },
	targetCollection: { type: String },
	targetId: { type: Schema.Types.ObjectId },
	before: { type: Schema.Types.Mixed },
	after: { type: Schema.Types.Mixed },
	metadata: { type: Schema.Types.Mixed },
	createdAt: { type: Date, default: Date.now, index: true }
}, { timestamps: false, versionKey: false });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
