import React, { useState } from "react";
import axios from "axios";
import { HiUser } from "react-icons/hi";
import { useNavigate } from "react-router-dom";   // <-- ADD THIS
import Logo from "../../assets/login-image.png";

export const RequestPasswordReset = () => {
  const [target, setTarget] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();   // <-- ADD THIS

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        "https://ethio-camp-ground-backend-lega.onrender.com/api/auth/request-password-reset",
        { target }
      );
      setMessage(res.data.message);

      // AUTO-REDIRECT AFTER SUCCESS
      setTimeout(() => {
        navigate("/reset-password");
      }, 1200);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code");
    }
  };

  return (
    <div className="w-full h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* LEFT SIDE */}
      <div className="bg-blue-800 flex items-center justify-center overflow-hidden">
        <img src={Logo} alt="reset password" className="w-full h-full object-cover" />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-gray-50 px-6">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">

          <h1 className="text-3xl font-semibold text-center">Reset Password</h1>
          <p className="text-center text-gray-500 mt-1">
            Enter your email or phone to receive a reset code
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
            
            <label className="text-sm font-medium">Email or Phone</label>
            <div className="relative">
              <HiUser className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Enter email or phone number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl mt-2 hover:bg-blue-700 transition"
            >
              Send Reset Code
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Remember your password?{" "}
            <a href="/login">
              <span className="text-blue-600 cursor-pointer hover:underline">
                Sign in
              </span>
            </a>
          </p>

        </div>
      </div>
    </div>
  );
};
