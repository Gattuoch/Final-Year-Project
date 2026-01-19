import React, { useState } from "react";
import {
  FiMail,
  FiSmartphone,
  FiMonitor,
  FiSave,
} from "react-icons/fi";
import Sidebar from "../sidebar/Sidebar";
import SettingHeader from "./SettingHeader";
import SettingsMenu from "./SettingsMenu";

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    email: {
      booking: true,
      cancellation: true,
      payment: true,
      registration: false,
    },
    sms: {
      booking: true,
      reminders: true,
      receipts: false,
    },
    push: {
      updates: true,
      alerts: true,
      marketing: false,
    },
    adminEmail: "admin@ethiocampground.com",
    frequency: "realtime",
  });

  const toggle = (section, key) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key],
      },
    }));
  };

  const CheckboxRow = ({ label, checked, onChange }) => (
    <label className="flex items-center justify-between gap-4 py-2 cursor-pointer">
      <span className="text-sm text-gray-700">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 accent-green-600"
      />
    </label>
  );

  const Card = ({ title, icon: Icon, color, children }) => (
    <div className={`rounded-2xl border p-5 sm:p-6 ${color}`}>
      <h3 className="flex items-center gap-2 font-semibold text-base sm:text-lg mb-4">
        <Icon />
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 md:px-8 pt-6 pb-10">
        <SettingHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Menu */}
          <div className="lg:col-span-3">
            <SettingsMenu />
          </div>

          {/* Content */}
          <section className="lg:col-span-9 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Notification Settings
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage system notification preferences
              </p>
            </div>

            {/* Notification Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card
                title="Email Notifications"
                icon={FiMail}
                color="bg-purple-50 border-purple-100 text-purple-700"
              >
                <CheckboxRow
                  label="New Booking Alerts"
                  checked={settings.email.booking}
                  onChange={() => toggle("email", "booking")}
                />
                <CheckboxRow
                  label="Cancellation Alerts"
                  checked={settings.email.cancellation}
                  onChange={() => toggle("email", "cancellation")}
                />
                <CheckboxRow
                  label="Payment Confirmations"
                  checked={settings.email.payment}
                  onChange={() => toggle("email", "payment")}
                />
                <CheckboxRow
                  label="New User Registrations"
                  checked={settings.email.registration}
                  onChange={() => toggle("email", "registration")}
                />
              </Card>

              <Card
                title="SMS Notifications"
                icon={FiSmartphone}
                color="bg-blue-50 border-blue-100 text-blue-700"
              >
                <CheckboxRow
                  label="Booking Confirmations"
                  checked={settings.sms.booking}
                  onChange={() => toggle("sms", "booking")}
                />
                <CheckboxRow
                  label="Event Reminders"
                  checked={settings.sms.reminders}
                  onChange={() => toggle("sms", "reminders")}
                />
                <CheckboxRow
                  label="Payment Receipts"
                  checked={settings.sms.receipts}
                  onChange={() => toggle("sms", "receipts")}
                />
              </Card>

              <Card
                title="Push Notifications"
                icon={FiMonitor}
                color="bg-green-50 border-green-100 text-green-700 md:col-span-2"
              >
                <CheckboxRow
                  label="Real-time Booking Updates"
                  checked={settings.push.updates}
                  onChange={() => toggle("push", "updates")}
                />
                <CheckboxRow
                  label="System Alerts"
                  checked={settings.push.alerts}
                  onChange={() => toggle("push", "alerts")}
                />
                <CheckboxRow
                  label="Marketing Messages"
                  checked={settings.push.marketing}
                  onChange={() => toggle("push", "marketing")}
                />
              </Card>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Email Recipients
                </label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, adminEmail: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notification Frequency
                </label>
                <select
                  value={settings.frequency}
                  onChange={(e) =>
                    setSettings({ ...settings, frequency: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500"
                >
                  <option value="realtime">Real-time</option>
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Summary</option>
                </select>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white
                           px-5 py-2.5 rounded-lg text-sm font-medium transition"
                onClick={() => console.log("Saved:", settings)}
              >
                <FiSave />
                Save Changes
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default NotificationSettings;
