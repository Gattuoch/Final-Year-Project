import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiLock, FiUser, FiPhone, FiMail } from "react-icons/fi";
import { useUser } from "../../../context/UserContext";
import api from "../../../services/api";
import Sidebar from "../Sidebar/Sidebar";
import AccountSetting from "./AccountSetting";

export default function SettingsPage() {
  const { user, loadingUser, refreshUser } = useUser();
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // ✅ Sync Form with Context
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || user.phoneNumber || "",
      });
    }
  }, [user]);

  // ✅ Update Handler
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        fullName: formData.fullName,
        phoneNumber: formData.phone // Maps back to the updated backend logic
      };

      const res = await api.patch("/auth/profile", payload);

      if (res.data.success || res.data.user) {
        await refreshUser();
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingUser) return <div className="flex h-screen items-center justify-center">Loading...</div>;

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
                <h2 className="text-lg font-bold text-gray-900">Profile Details</h2>
                <p className="text-sm text-gray-500">Update your personal information.</p>
              </div>

              <div className="p-8 space-y-6">
                {/* Inputs */}
                <div className="grid grid-cols-1 gap-6 max-w-2xl">
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                      <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+251..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                      />
                    </div>
                  </div>

                </div>
              </div>

              <div className="px-8 py-5 bg-gray-50 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </div>
          </section>
        </div>
      </div>
    </div>
  );
}