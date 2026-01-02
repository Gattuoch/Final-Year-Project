import  mongoose from 'mongoose';

const roles = [
  'camper',
  'camp_manager',
  'event_manager',
  'ticket_officer',
  'security_officer',
  'system_admin',
  'super_admin'
];

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, index: true, sparse: true },
  phone: { type: String, index: true, sparse: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: roles, default: 'camper' },
  isInternal: { type: Boolean, default: false },
  mustResetPassword: { type: Boolean, default: false }, // for temp passwords
  isVerified: { type: Boolean, default: false }, // email/phone verified
  isBanned: { type: Boolean, default: false },
  metadata: {}, // store additional info (country, docs, uploads refs)
   isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;
