import mongoose from 'mongoose';

const roles = ['camper', 'camp_manager', 'super_admin'];

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  avatar: { type: String },
  email: { type: String, index: true, sparse: true },
  phone: { type: String, index: true, sparse: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: roles, default: 'camper' },
  isInternal: { type: Boolean, default: false },
  mustResetPassword: { type: Boolean, default: false }, 
  isVerified: { type: Boolean, default: false }, 
  isBanned: { type: Boolean, default: false },
<<<<<<< HEAD
  isActive: { type: Boolean, default: true },
  metadata: {}, 
  // ADDED: Logic to support the business info sent by the controller
  businessInfo: {
    businessName: String,
    description: String,
    location: String,
    licenseUrl: String,
    contactEmail: String,
    status: { type: String, default: 'pending' },
    govId: String,          // Added to support manager.controller logic
    businessLicense: String // Added to support manager.controller logic
  }
=======
  isPremium: { type: Boolean, default: false },
  metadata: {}, // store additional info (country, docs, uploads refs)
   isActive: { type: Boolean, default: true },
>>>>>>> all change here
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;