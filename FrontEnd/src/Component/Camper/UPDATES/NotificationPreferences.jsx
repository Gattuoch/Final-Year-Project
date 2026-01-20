import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import AccountSetting from "../Activity/AccountSetting";

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState({
    booking: true,
    payment: true,
    promo: false,
    system: true,
  });

  const toggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Settings Menu */}
          <div className="lg:col-span-3">
            <AccountSetting />
          </div>

          {/* Notification Preferences Card */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-xl shadow-sm ">

              {/* Header */}
              <div className="px-6 py-5 ">
                <h2 className="text-lg font-semibold text-gray-900">
                  Notification Preferences
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Choose what we get in touch about.
                </p>
              </div>

              {/* Options */}
              <div className="bg-gray-50/10 focus-within:bg-white rounded-b-xl">
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

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ================= TOGGLE ITEM ================= */

const PreferenceItem = ({ title, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between px-6 py-5">
    <div className="pr-4">
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
        {description}
      </p>
    </div>

    {/* Toggle */}
    <button
      onClick={onToggle}
      aria-pressed={enabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        ${enabled ? "bg-green-500" : "bg-gray-300"}
      `}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-300
          ${enabled ? "translate-x-5" : "translate-x-1"}
        `}
      />
    </button>
  </div>
);
