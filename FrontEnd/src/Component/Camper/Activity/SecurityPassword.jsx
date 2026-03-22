import React, { useState } from "react";
import axios from "axios";
import { FiLock, FiShield, FiCheck } from "react-icons/fi";
import Sidebar from "../Sidebar/Sidebar";
import AccountSetting from "./AccountSetting";

export default function SecurityPassword() {
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: ""
  });
  const [loading, setLoading] = useState(false);

  const getStrength = () => {
    const len = passwords.newPass.length;
    if (len === 0) return { label: "", color: "" };
    if (len < 6) return { label: "Weak", color: "text-red-500" };
    if (len < 10) return { label: "Medium", color: "text-yellow-500" };
    return { label: "Strong", color: "text-emerald-500" };
  };

  const handleUpdate = async () => {
    if (passwords.newPass !== passwords.confirm) {
      alert("New passwords do not match.");
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // Assuming a standard password change endpoint exists or using patch user
      // Note: Usually requires a specific endpoint verifying 'currentPassword' first
      alert("Password update logic would run here. (Backend endpoint required)");
      
      // Reset logic on success
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-3">
            <AccountSetting />
          </div>

          <section className="lg:col-span-9">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Security & Password</h2>
                <p className="text-sm text-gray-500">Keep your account secure.</p>
              </div>

              <div className="p-8 space-y-6">
                
                {/* Password Fields */}
                <div className="space-y-5 max-w-xl">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwords.newPass}
                      onChange={(e) => setPasswords({...passwords, newPass: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                    />
                    {strength.label && (
                      <p className={`text-xs mt-2 font-medium ${strength.color}`}>
                        Strength: {strength.label}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                    />
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* 2FA Banner */}
                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                      <FiShield size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-xs text-gray-500">Add an extra layer of security.</p>
                    </div>
                  </div>
                  <button className="text-sm font-bold text-blue-600 hover:underline">Enable</button>
                </div>

              </div>

              <div className="px-8 py-5 bg-gray-50 flex justify-end">
                <button 
                  onClick={handleUpdate}
                  disabled={!passwords.current || !passwords.newPass || loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>

            </div>
          </section>
        </div>
      </div>
    </div>
  );
}