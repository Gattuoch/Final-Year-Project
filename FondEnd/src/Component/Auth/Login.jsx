import React, { useState } from "react";
import axios from "axios";
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import Logo from "../../assets/login-image.png";

export const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // << FIXED

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("https://ethio-camp-ground-backend-lega.onrender.com/api/auth/login", {
        identifier: formData.identifier,
        password: formData.password,
      });

      // Save tokens
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role);

      // Redirect based on role
      switch (res.data.role) {
        case "camper":
          window.location.href = "/camper-dashboard";
          break;
        case "camp_manager":
          window.location.href = "/manager-dashboard";
          break;
        case "ticket_officer":
          window.location.href = "/ticket-dashboard";
          break;
        case "system_admin":
          window.location.href = "/admin-dashboard";
          break;
        case "super_admin":
          window.location.href = "/super-admin";
          break;
        case "security_officer":
          window.location.href = "/security_officer";
          break;
        default:
          window.location.href = "/";
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="w-full h-screen grid grid-cols-1 md:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="bg-blue-800 text-white flex items-center justify-center overflow-hidden">
        <img src={Logo} alt="login" className="w-full h-full object-cover" />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-gray-50 px-6">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">

          <h1 className="text-3xl font-semibold text-center">Welcome Back</h1>
          <p className="text-center text-gray-500 mt-1">Sign in to your account</p>

          {error && (
            <p className="bg-red-100 text-red-700 p-2 rounded-xl text-center mt-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">

            <label className="text-sm font-medium">Email or Phone</label>
            <div className="relative">
              <HiMail className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="text"
                name="identifier"
                placeholder="Email or Phone"
                value={formData.identifier}
                onChange={handleChange}
                className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <label className="text-sm font-medium mt-2">Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type={showPassword ? "text" : "password"}    // << TOGGLE
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-xl pl-10 pr-10 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
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

            {/* Remember / Forgot */}
            <div className="flex justify-between items-center mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span className="text-sm">Remember me</span>
              </label>

              <a href="/forgot-password" className="text-sm text-blue-600 cursor-pointer hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl mt-4 hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <a href="/signUp">
              <span className="text-blue-600 cursor-pointer hover:underline">
                Sign up
              </span>
            </a>
          </p>

        </div>
      </div>
    </div>
  );
};
