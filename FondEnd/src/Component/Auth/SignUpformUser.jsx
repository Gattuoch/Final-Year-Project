import React, { useState } from "react";
import axios from "axios";
import { 
  HiMail, 
  HiLockClosed, 
  HiEye, 
  HiEyeOff, 
  HiPhone, 
  HiUser 
} from "react-icons/hi";

export const SignUpformUser = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        fullName,
        email,
        phone,
        password,
        confirmPassword,
      });

      setSuccess("Account created! Please verify your email/phone.");
      console.log("Signup response:", res.data);

      setTimeout(() => {
        window.location.href = "/verify";
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
    }

    setLoading(false);
  };

  return (
    <div className="w-full h-screen">
      <div className="flex items-center justify-center bg-gray-50 px-6">
        <div className="bg-white shadow-xl rounded-2xl p-5 w-full max-w-md">

          <form onSubmit={handleSignup} className="mt-8 flex flex-col gap-4">

            {/* Full Name */}
            <label className="text-sm font-medium">Full Name</label>
            <div className="relative">
              <HiUser className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#097D5A]"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Email */}
            <label className="text-sm font-medium">Email Address</label>
            <div className="relative">
              <HiMail className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#097D5A]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Phone Number */}
            <label className="text-sm font-medium">Phone Number</label>
            <div className="relative">
              <HiPhone className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#097D5A]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Password */}
            <label className="text-sm font-medium mt-2">Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="w-full border rounded-xl pl-10 pr-10 py-3 outline-none focus:ring-2 focus:ring-[#097D5A]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Eye Icon */}
              {showPassword ? (
                <HiEyeOff
                  className="absolute right-3 top-3.5 text-gray-400 text-lg cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <HiEye
                  className="absolute right-3 top-3.5 text-gray-400 text-lg cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>

            {/* Confirm Password */}
            <label className="text-sm font-medium mt-2">Confirm Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="w-full border rounded-xl pl-10 pr-10 py-3 outline-none focus:ring-2 focus:ring-[#097D5A]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {/* Eye Icon */}
              {showPassword ? (
                <HiEyeOff
                  className="absolute right-3 top-3.5 text-gray-400 text-lg cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <HiEye
                  className="absolute right-3 top-3.5 text-gray-400 text-lg cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* Success Message */}
            {success && <p className="text-green-600 text-sm text-center">{success}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#097D5A] text-white py-3 rounded-xl mt-4 hover:bg-green-800 transition"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create a Camper Account"}
            </button>

          </form>

          {/* Footer */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <a href="/login">
              <span className="text-blue-600 cursor-pointer hover:underline">
                Log in
              </span>
            </a>
          </p>

        </div>
      </div>
    </div>
  );
};
