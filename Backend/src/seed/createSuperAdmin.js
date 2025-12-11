require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcrypt');

(async () => {
  try {
    await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/camp-auth');
    const existing = await User.findOne({ role: 'super_admin' });
    if (existing) {
      console.log('Super admin already exists:', existing.email || existing.phone);
      process.exit(0);
    }
    const pw = process.env.SUPERADMIN_PW || 'SuperAdmin123!';
    const hash = await bcrypt.hash(pw, 12);
    const sa = await User.create({
      fullName: 'Super Admin',
      email: process.env.SUPERADMIN_EMAIL || 'superadmin@example.com',
      passwordHash: hash,
      role: 'super_admin',
      isInternal: true,
      mustResetPassword: false,
      isVerified: true
    });
    console.log('Created super admin:', sa.email, 'password:', pw);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
