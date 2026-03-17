import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "../../../context/UserContext";
import api from "../../../services/api";
import Sidebar from "../Sidebar/Sidebar";
import AccountSetting from "../Activity/AccountSetting";

export default function NotificationPreferences() {
  const { user, refreshUser } = useUser();
  const [preferences, setPreferences] = useState({
    booking: true,
    payment: true,
    promo: false,
    system: true,
  });
  const [loading, setLoading] = useState(false);

  // Fetch preferences from user metadata
  useEffect(() => {
    if (user?.metadata?.notifications) {
      setPreferences(user.metadata.notifications);
    }
  }, [user]);

  const toggle = async (key) => {
    // Optimistic update
    const newPrefs = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPrefs);

    try {
      setLoading(true);
      const payload = {
        metadata: {
          ...user?.metadata,
          notifications: newPrefs,
        },
      };
      await api.patch(`/users/${user._id}`, payload);
      await refreshUser(); // update context
    } catch (err) {
      console.error("Failed to save preference", err);
      // Revert on error
      setPreferences({ ...preferences, [key]: !preferences[key] });
      toast.error("Failed to update preference.");
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

const PreferenceItem = ({ title, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between px-8 py-6 hover:bg-gray-50 transition">
    <div className="pr-8">
      <h4 className="text-sm font-bold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{description}</p>
    </div>

    <button
      onClick={onToggle}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${
        enabled ? "bg-emerald-500" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);