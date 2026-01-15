import  express from 'express';
import  bcrypt from 'bcrypt';
import User from "../models/User.model.js";
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware.js';
import { sendEmail, sendSMS } from '../models/OTP.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const BCRYPT_ROUNDS = 12;

/**
 * Create internal user (only system_admin or super_admin can create others)
 * Admin provides name, email/phone, role
 * System generates a temporary password and flags mustResetPassword = true
 */
router.post('/create-user', authenticateJWT, authorizeRoles('system_admin','super_admin'), async (req,res) => {
  try {
    const { fullName, email, phone, role } = req.body;
    if (!fullName || (!email && !phone) || !role) return res.status(400).json({ message: 'fullName,email/phone,role required' });

    // verify role is allowed - system_admin creates internal roles; only super_admin can create system_admin
    const allowedRolesForCreator = {
      super_admin: ['system_admin','super_admin'],
      system_admin: ['camp_manager','event_manager','ticket_officer','security_officer','system_admin']
    };
    const creatorRole = req.user.role;
    if (!allowedRolesForCreator[creatorRole] || !allowedRolesForCreator[creatorRole].includes(role)) {
      return res.status(403).json({ message: 'Insufficient privileges to create this role' });
    }

    // uniqueness check
    if (email && await User.findOne({ email })) return res.status(409).json({ message: 'Email already used' });
    if (phone && await User.findOne({ phone })) return res.status(409).json({ message: 'Phone already used' });

    const tempPassword = uuidv4().slice(0, 10); // temporary strong-ish password
    const passwordHash = await bcrypt.hash(tempPassword, BCRYPT_ROUNDS);

    const user = await User.create({
      fullName,
      email,
      phone,
      passwordHash,
      role,
      isInternal: true,
      mustResetPassword: true,
      isVerified: true // consider verifying internal users by admin
    });

    // send temp credentials via email/SMS
    const message = `You have been added as ${role}. Temporary password: ${tempPassword}. You must reset on first login.`;
    if (email) await sendEmail(email, 'Your admin account', message);
    if (phone) await sendSMS(phone, message);

    return res.status(201).json({ message: 'Internal user created', userId: user._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Create user failed' });
  }
});

const Admin  = router;

export default Admin;
