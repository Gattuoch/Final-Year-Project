import React from "react";
import { HiMail, HiLockClosed, HiEye, HiShieldCheck, HiUsers } from "react-icons/hi";
import Logo from "../../assets/login-image.png"

export const Login = () => {
  return (
    <div className="w-full h-screen grid grid-cols-1 md:grid-cols-2">

      {/* ------------ LEFT SIDE ------------ */}
      <div className="bg-blue-800 text-white flex items-center justify-center overflow-hidden">
        
        <img src={Logo} alt="login " className="w-full h-full object-cover" />
      </div>

      {/* ------------ RIGHT SIDE (LOGIN FORM) ------------ */}
      <div className="flex items-center justify-center bg-gray-50 px-6">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">

          {/* Title */}
          <h1 className="text-3xl font-semibold text-center">Welcome Back</h1>
          <p className="text-center text-gray-500 mt-1">
            Sign in to your account
          </p>

          {/* Form */}
          <form className="mt-8 flex flex-col gap-4">

            {/* Email */}
            <label className="text-sm font-medium">Email Address</label>
            <div className="relative">
              <HiMail className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <label className="text-sm font-medium mt-2">Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border rounded-xl pl-10 pr-10 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <HiEye className="absolute right-3 top-3.5 text-gray-400 text-lg cursor-pointer" />
            </div>

            {/* Remember / Forgot */}
            <div className="flex justify-between items-center mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span className="text-sm">Remember me</span>
              </label>

              <a className="text-sm text-blue-600 cursor-pointer hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl mt-4 hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
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
