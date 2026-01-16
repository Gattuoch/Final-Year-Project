import mongoose from 'mongoose';
import crypto from 'crypto';

const RefreshTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  // store a hash of the token so raw tokens are not recoverable from DB
  tokenHash: { type: String, required: true, select: false },
  userAgent: { type: String },
  ip: { type: String },
  revoked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: true }
}, { timestamps: false });

// TTL index to remove expired refresh tokens automatically
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Utility to compute token hash before saving (if plain token is provided via virtual)
RefreshTokenSchema.methods.setToken = function(plainToken) {
  this.tokenHash = crypto.createHmac('sha256', process.env.REFRESH_TOKEN_SECRET || 'refresh-secret')
    .update(plainToken)
    .digest('hex');
};

RefreshTokenSchema.methods.matchesToken = function(plainToken) {
  const hash = crypto.createHmac('sha256', process.env.REFRESH_TOKEN_SECRET || 'refresh-secret')
    .update(plainToken)
    .digest('hex');
  return this.tokenHash === hash;
};

export default mongoose.models.RefreshToken || mongoose.model('RefreshToken', RefreshTokenSchema);
