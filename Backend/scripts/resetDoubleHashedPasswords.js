#!/usr/bin/env node
/**
 * One-time migration script to reset passwords for accounts that may have been double-hashed.
 * Behavior: for each non-super-admin user with an email, set a new temporary password,
 *           save the user (model pre-save will hash), and send the temp password via email.
 * Usage: node scripts/resetDoubleHashedPasswords.js --dry-run
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import crypto from 'crypto';
import User from '../src/models/User.model.js';
import { sendMail } from '../src/services/email.service.js';

dotenv.config({ path: './.env' });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI missing in .env');
  process.exit(1);
}

const argv = process.argv.slice(2);
const dryRun = argv.includes('--dry-run') || argv.includes('-d');
const limitIndex = argv.indexOf('--limit');
const limit = limitIndex >= 0 ? parseInt(argv[limitIndex + 1] || '0', 10) : 0;

const run = async () => {
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('Connected to DB');

  // Filter: skip internal accounts and super_admin
  const query = { role: { $ne: 'super_admin' } };
  const users = await User.find(query).limit(limit || 0);
  console.log(`Found ${users.length} users to examine (limit=${limit || 'none'})`);

  let processed = 0;
  for (const user of users) {
    // Skip users without email (you may SMS instead)
    if (!user.email) continue;

    // Heuristic: if account has `mustResetPassword` true, skip (already flagged)
    if (user.mustResetPassword) continue;

    const temp = crypto.randomBytes(6).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12) + 'A1!';

    if (dryRun) {
      console.log(`[dry] would set temp password for ${user.email}`);
      processed++;
      continue;
    }

    user.passwordHash = temp; // model pre-save will hash
    user.mustResetPassword = true;
    try {
      await user.save();

      // send email
      try {
        await sendMail({
          to: user.email,
          subject: 'Your EthioCamp temporary password',
          html: `<p>Hello ${user.fullName || ''},</p><p>Your password has been reset as a precaution. Temporary password: <strong>${temp}</strong></p><p>Please login and change your password immediately.</p>`,
        });
      } catch (e) {
        console.error('Failed sending email to', user.email, e.message || e);
      }

      processed++;
      console.log(`Reset and emailed: ${user.email}`);
    } catch (err) {
      console.error('Failed to update user', user.email, err.message || err);
    }

    // optional: small delay to avoid SMTP throttling
    await new Promise((r) => setTimeout(r, 150));
  }

  console.log(`Processed ${processed} users.`);
  process.exit(0);
};

run().catch((err) => { console.error('Migration error', err); process.exit(1); });
