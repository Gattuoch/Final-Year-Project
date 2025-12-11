import React from "react";
import { HiMail, HiLockClosed, HiEye, HiPhone } from "react-icons/hi";
import { HiUser } from "react-icons/hi";
import Logo from "../../assets/login-image.png";

const SignUpformUser = () => {
  return (
    <div className="w-full h-screen ">

      {/* ------------ RIGHT SIDE (LOGIN FORM) ------------ */}
      <div className="flex items-center justify-center bg-gray-50 px-6">
        <div className="bg-white shadow-xl rounded-2xl p-5 w-full max-w-md">

          {/* Form */}
          <form className="mt-8 flex flex-col gap-4">

            {/* Email */}
            <label className="text-sm font-medium">Full Name</label>
            <div className="relative ">
              <HiUser className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="email"
                placeholder="Enter your full name"
                className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#097D5A]"
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
              />
            </div>

            {/* Password */}
            <label className="text-sm font-medium mt-2">Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="password"
                placeholder="Create a password"
                className="w-full border rounded-xl pl-10 pr-10 py-3 outline-none focus:ring-2 focus:ring-[#097D5A]"
              />
              <HiEye className="absolute right-3 top-3.5 text-gray-400 text-lg cursor-pointer" />
            </div>
            {/* Password */}
            <label className="text-sm font-medium mt-2">Confirm Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="password"
                placeholder="confirm your password"
                className="w-full border rounded-xl pl-10 pr-10 py-3 outline-none focus:ring-2 focus:ring-[#097D5A]"
              />
              <HiEye className="absolute right-3 top-3.5 text-gray-400 text-lg cursor-pointer" />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-[#097D5A] text-white py-3 rounded-xl mt-4 hover:bg-green-800 transition"
            >
              Create a Camper Account 
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

export { SignUpformUser };
