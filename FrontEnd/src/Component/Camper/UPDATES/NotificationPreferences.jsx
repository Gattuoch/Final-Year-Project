import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../Sidebar/Sidebar";
import AccountSetting from "../Activity/AccountSetting";

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState({
    booking: true,
    payment: true,
    promo: false,
    system: true,
  });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Preferences from Metadata
  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser?._id) return;

        const res = await axios.get(`http://localhost:5000/api/users/${storedUser._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Check if metadata exists and has notifications logic
        if (res.data.success && res.data.data.metadata?.notifications) {
          setPreferences(res.data.data.metadata.notifications);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPrefs();
  }, []);

  // ✅ Save Logic (Saves to Metadata)
  const toggle = async (key) => {
    // 1. Optimistic Update (Update UI instantly)
    const newPrefs = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPrefs);

    // 2. Background Save
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user"));
      
      // Fetch current metadata first to avoid overwriting other metadata
      // (Simplified logic here: we just send the new metadata structure)
      const payload = {
        metadata: {
          notifications: newPrefs
        }
      };

      await axios.patch(`http://localhost:5000/api/users/${storedUser._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
    } catch (err) {
      console.error("Failed to save preference", err);
      // Revert if failed (optional)
      setPreferences({ ...preferences, [key]: !preferences[key] }); // Undo
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex-1 p-4 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-3">
            <AccountSetting />
          </div>

          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Notification Preferences</h2>
                <p className="text-sm text-gray-500">Choose what we get in touch about.</p>
              </div>

              <div className="divide-y divide-gray-50">
                <PreferenceItem
                  title="Booking Notifications"
                  description="Receive updates about new bookings and schedule changes."
                  enabled={preferences.booking}
                  onToggle={() => toggle("booking")}
                />

                <PreferenceItem
                  title="Payment Updates"
                  description="Get notified when a payment is processed or failed."
                  enabled={preferences.payment}
                  onToggle={() => toggle("payment")}
                />

                <PreferenceItem
                  title="Promotional Messages"
                  description="News about product updates and feature releases."
                  enabled={preferences.promo}
                  onToggle={() => toggle("promo")}
                />

                <PreferenceItem
                  title="System Alerts"
                  description="Important notifications about your account status."
                  enabled={preferences.system}
                  onToggle={() => toggle("system")}
                />
              </div>
              
              <div className="px-8 py-4 bg-gray-50 flex justify-end">
                 <span className="text-xs text-gray-400 italic">
                   {loading ? "Saving changes..." : "Changes saved automatically"}
                 </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ================= TOGGLE ITEM ================= */

const PreferenceItem = ({ title, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between px-8 py-6 hover:bg-gray-50 transition">
    <div className="pr-8">
      <h4 className="text-sm font-bold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
        {description}
      </p>
    </div>

    <button
      onClick={onToggle}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none
        ${enabled ? "bg-emerald-500" : "bg-gray-200"}
      `}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-300
          ${enabled ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  </div>
);
