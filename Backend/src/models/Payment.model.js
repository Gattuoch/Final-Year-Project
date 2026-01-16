import mongoose from 'mongoose';

const { Schema } = mongoose;

const PaymentSchema = new Schema({
	booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
	gateway: { type: String, required: true }, // e.g. stripe, paypal
	gatewayPaymentId: { type: String, required: true, index: true },
	status: { type: String, enum: ['initiated','succeeded','failed','refunded'], required: true, index: true },
	amount: { type: Number, required: true, min: 0 },
	currency: { type: String, required: true, maxlength: 3 },
	paidAt: { type: Date },
	refundedAt: { type: Date },
	refundInfo: { type: Schema.Types.Mixed },
	idempotencyKey: { type: String, index: true },
	metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

PaymentSchema.index({ gatewayPaymentId: 1 }, { unique: true });

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
