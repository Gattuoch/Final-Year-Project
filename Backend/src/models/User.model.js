import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const roles = ['camper', 'camp_manager', 'super_admin'];

const AddressSchema = new mongoose.Schema({
  line1: { type: String, trim: true },
  line2: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  postalCode: { type: String, trim: true },
  country: { type: String, trim: true },
}, { _id: false });

const BusinessInfoSchema = new mongoose.Schema({
  businessName: { type: String, trim: true },
  description: { type: String, trim: true },
  location: { type: String, trim: true },
  licenseUrl: { type: String, trim: true },
  contactEmail: { type: String, trim: true },
  status: { type: String, default: 'pending' },
  govId: { type: String },
  businessLicense: { type: String }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 120 },
  avatar: { type: String, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true, maxlength: 254 },
  phone: { type: String, index: true, sparse: true },
  // Keep the existing name `passwordHash` to avoid breaking callers, but hide it by default
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: roles, default: 'camper' },
  isInternal: { type: Boolean, default: false },
  mustResetPassword: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true, index: true },
  address: AddressSchema,
  // Business info used by managers
  businessInfo: BusinessInfoSchema,
  isPremium: { type: Boolean, default: false },
  metadata: { type: mongoose.Schema.Types.Mixed },
  deleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date }
}, { timestamps: true, versionKey: 'version' });

// Indexes
UserSchema.index({ email: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

// Hash password when modified
UserSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('passwordHash')) return next();
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Compare password helper
UserSchema.methods.comparePassword = function(candidate) {
  // candidate is plain text password
  return bcrypt.compare(candidate, this.passwordHash);
};

// toJSON / toObject cleanup
UserSchema.methods.toJSON = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj.passwordHash;
  return obj;
};

// Export model using existing collection name `users` so other code keeps working
export default mongoose.models.User || mongoose.model('User', UserSchema, 'users');