import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import AccountSetting from "./AccountSetting";

export default function SecurityPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const getPasswordStrength = () => {
    if (!newPassword) return "";
    if (newPassword.length < 6) return "Weak password";
    if (newPassword.length < 10) return "Medium password";
    return "Strong password";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Wrapper */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Settings Menu */}
          <div className="lg:col-span-3">
            <AccountSetting />
          </div>

          {/* Main Content */}
          <section className="lg:col-span-9">
            <div className="bg-white rounded-xl shadow-sm p-6">

              {/* Header */}
              <h2 className="text-lg font-semibold text-gray-900">
                Security & Password
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Ensure your account is secure with a strong password.
              </p>

              <div className="mt-6 space-y-5">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-green-50  rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-green-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                  {getPasswordStrength() && (
                    <p className="mt-2 text-xs text-gray-500">
                      {getPasswordStrength()}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-green-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>
              </div>

              {/* Divider */}
              <hr className="my-6" />

              {/* Two Factor Authentication */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Add an extra layer of security to your account.
                </p>
              </div>

              {/* Action */}
              <div className="mt-6 flex justify-end">
                <button
                  className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-500 font-medium cursor-not-allowed"
                  disabled
                >
                  Update Password
                </button>
              </div>

            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
