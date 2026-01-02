import React, { useState } from "react";
import axios from "axios";
import { HiMail, HiPhone, HiLockClosed, HiUser } from "react-icons/hi";

const ManagerSignUpForm = ({ onSignUp }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    govId: null,
    businessLicense: null,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("password", formData.password);
      data.append("confirmPassword", formData.confirmPassword);

      if (formData.govId) data.append("govId", formData.govId);
      if (formData.businessLicense)
        data.append("businessLicense", formData.businessLicense);

      const res = await axios.post(
        "http://localhost:5000/api/manager/signup",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message);

      if (onSignUp) onSignUp();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="mt-8 p-8 rounded-2xl shadow-lg bg-white max-w-xl mx-auto">

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 gap-3 focus-within:border-[#097D5A]">
            <HiUser className="text-gray-500 w-5 h-5" />
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              className="w-full outline-none"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 gap-3 focus-within:border-[#097D5A]">
            <HiMail className="text-gray-500 w-5 h-5" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full outline-none"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 gap-3 focus-within:border-[#097D5A]">
            <HiPhone className="text-gray-500 w-5 h-5" />
            <input
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              className="w-full outline-none"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Government ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Government ID
          </label>
          <input
            type="file"
            name="govId"
            className="w-full border border-gray-300 rounded-xl p-3 outline-none "
            onChange={handleFileChange}
          />
        </div>

        {/* Business License */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business License
          </label>
          <input
            type="file"
            name="businessLicense"
            className="w-full border border-gray-300 rounded-xl p-3 outline-none"
            onChange={handleFileChange}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ">
            Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 gap-3 focus-within:border-[#097D5A]">
            <HiLockClosed className="text-gray-500 w-5 h-5" />
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              className="w-full outline-none"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 gap-3 focus-within:border-[#097D5A]">
            <HiLockClosed className="text-gray-500 w-5 h-5" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              className="w-full outline-none"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#097D5A] text-white py-3 rounded-xl text-lg font-medium hover:bg-green-700 transition"
        >
          Create Manager Account
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 font-semibold hover:underline">
            Login
          </a>
        </p>
      </form>

      {message && (
        <p className="text-center mt-4 text-green-600 font-semibold">
          {message}
        </p>
      )}
    </div>
  );
};

export default ManagerSignUpForm;
