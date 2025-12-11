import mongoose from 'mongoose';

const RefreshTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true }, // store hashed token in prod; plain here for clarity
  createdByIp: { type: String },
  revoked: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);
export default RefreshToken;
