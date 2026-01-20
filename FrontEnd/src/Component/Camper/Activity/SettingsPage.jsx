import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiLock, FiUser, FiPhone, FiMail } from "react-icons/fi";
import Sidebar from "../Sidebar/Sidebar";
import AccountSetting from "./AccountSetting";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    _id: ""
  });

  // ✅ Fetch User Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userId = storedUser?._id || storedUser?.id;

        if (!token || !userId) return;

        const res = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const user = res.data.data;
          setFormData({
            fullName: user.fullName || "",
            email: user.email || "",
            phone: user.phone || user.phoneNumber || "",
            _id: user._id
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ✅ Update Handler
  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone
      };

      const res = await axios.patch(
        `http://localhost:5000/api/users/${formData._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Update Local Storage
        const currentUser = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem("user", JSON.stringify({ ...currentUser, ...payload }));
        alert("Profile updated successfully! ✅");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

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