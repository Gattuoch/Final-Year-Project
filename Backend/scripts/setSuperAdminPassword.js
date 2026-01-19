#!/usr/bin/env node
/**
 * One-time script to set/update the super admin password from .env
 * Usage: from Backend folder: node scripts/setSuperAdminPassword.js
 * It will read MONGO_URI and SUPER_ADMIN_EMAIL/SUPER_ADMIN_PASSWORD from .env
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.model.js';

dotenv.config({ path: './.env' });

const MONGO_URI = process.env.MONGO_URI;
const email = process.env.SUPER_ADMIN_EMAIL;
const password = process.env.SUPER_ADMIN_PASSWORD;

if (!MONGO_URI) {
  console.error('MONGO_URI not set in .env');
  process.exit(1);
}
if (!email || !password) {
  console.error('SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not set in .env');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB');

    const emailNormalized = String(email).toLowerCase().trim();
    // Store plain password and let model pre-save hash it on save
    const hash = String(password);

    let user = await User.findOne({ role: 'super_admin' });
    if (!user) user = await User.findOne({ email: emailNormalized });

    if (!user) {
      // create
      const created = await User.create({
        fullName: 'Platform Super Admin',
        email: emailNormalized,
        passwordHash: hash,
        role: 'super_admin',
        isInternal: true,
        isEmailVerified: true,
        mustResetPassword: true,
      });
      console.log('Super admin created:', created._id.toString());
    } else {
      user.passwordHash = hash; // plain password, model will hash on save
      user.email = emailNormalized;
      user.isInternal = true;
      await user.save();
      console.log('Super admin updated:', user._id.toString());
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
};

run();
