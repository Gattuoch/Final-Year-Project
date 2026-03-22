import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, default: "Male" },
    password: { type: String, required: true },
    trustScore: { type: Number, default: 0 },
    role: { type: String, default: "Camper" },
    profilePicture: { type: String },
    coverPicture: { type: String },
  },
  { timestamps: true }
);


const User = mongoose.model("UserProfile", UserSchema);
export default User; // <-- Make sure this line exists