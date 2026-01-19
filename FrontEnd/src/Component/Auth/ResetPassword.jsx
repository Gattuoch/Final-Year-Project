import React, { useState } from "react";
import axios from "axios";
import { HiMail, HiLockClosed, HiKey } from "react-icons/hi";
import Logo from "../../assets/login-image.png";

export const ResetPassword = () => {
  const [formData, setFormData] = useState({
    target: "",
    code: "",
    newPassword: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        "https://ethio-camp-ground-backend-lega.onrender.com/api/auth/reset-password",
        formData
      );
      setMessage(res.data.message);

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="w-full h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* LEFT SIDE */}
      <div className="bg-blue-800 flex items-center justify-center overflow-hidden">
        <img src={Logo} alt="reset" className="w-full h-full object-cover" />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-gray-50 px-6">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">

          <h1 className="text-3xl font-semibold text-center">Reset Password</h1>
          <p className="text-center text-gray-500 mt-1">
            Enter your OTP code and new password
          </p>

          {error && (
            <p className="bg-red-100 text-red-700 p-2 rounded-xl text-center mt-4">
              {error}
            </p>
          )}

          {message && (
            <p className="bg-green-100 text-green-700 p-2 rounded-xl text-center mt-4">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">

            {/* Target */}
            <label className="text-sm font-medium">Email or Phone</label>
            <div className="relative">
              <HiMail className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="text"
                name="target"
                placeholder="Enter email or phone"
                value={formData.target}
                onChange={handleChange}
                className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* OTP Code */}
            <label className="text-sm font-medium">Reset Code</label>
            <div className="relative">
              <HiKey className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="text"
                name="code"
                placeholder="Enter 6-digit code"
                value={formData.code}
                onChange={handleChange}
                className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* New Password */}
            <label className="text-sm font-medium">New Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl mt-4 hover:bg-blue-700 transition"
            >
              Reset Password
            </button>

          </form>

          <p className="text-center mt-6 text-gray-600">
            Back to{" "}
            <a href="/login">
              <span className="text-blue-600 cursor-pointer hover:underline">
                Login
              </span>
            </a>
          </p>

        </div>
      </div>
    </div>
  );
};
