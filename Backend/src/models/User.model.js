import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["camper", "manager", "admin", "superadmin"],
      default: "camper",
    },

    // 🏕️ Camp Manager Business Info (Only applicable for role = manager)
    businessInfo: {
      businessName: { type: String, default: null },
      description: { type: String, default: null },
      location: { type: String, default: null },
      licenseUrl: { type: String, default: null },
      contactEmail: { type: String, default: null },
      status: {
        type: String,
        enum: ["pending", "approved", "rejected", null],
        default: null,
      },
    },

    // ⚙️ Account Activity
    isActive: {
      type: Boolean,
      default: true,
    },

    // 💰 Payment & Trust System
    cashEligible: {
      type: Boolean,
      default: true, // Can the camper pay on arrival?
    },
    cashBanUntil: {
      type: Date,
      default: null, // When cash privilege ban ends
    },
    trustScore: {
      type: Number,
      default: 0, // Increases after every completed stay
    },
  },
  { timestamps: true }
);

// 🟩 Auto-regain cash eligibility after 3+ successful stays
userSchema.methods.updateTrustEligibility = async function () {
  if (this.trustScore >= 3 && !this.cashEligible) {
    this.cashEligible = true;
    this.cashBanUntil = null;
    console.log(`✅ ${this.fullName} regained cash eligibility.`);
  }
  await this.save();
};

export default mongoose.model("User", userSchema);
