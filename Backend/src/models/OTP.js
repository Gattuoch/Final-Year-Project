import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import axios from 'axios';

// ---------------- OTP MODEL ----------------

const OTPSchema = new mongoose.Schema({
  target: { type: String, required: true }, // email or phone
  code: { type: String, required: true },
  type: { type: String, enum: ['verification', 'password_reset'], required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false }
}, { timestamps: true });

OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model('OTP', OTPSchema);

// ---------------- EMAIL SENDER ----------------

export const sendEmail = async (email, code) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      text: `Your OTP is: ${code}`,
    });

    console.log("Email sent!");
    return true;
  } catch (error) {
    console.log("Email Error:", error);
    return false;
  }
};

// ---------------- SMS SENDER ----------------

export const sendSMS = async (phone, code) => {
  try {
    // Use any real SMS API here
    await axios.post("https://sms-provider.com/api/send", {
      phone,
      message: `Your OTP is: ${code}`
    });

    console.log("SMS sent!");
    return true;
  } catch (error) {
    console.log("SMS Error:", error);
    return false;
  }
};

// ---------------- EXPORT DEFAULT MODEL ----------------
export default OTP;
