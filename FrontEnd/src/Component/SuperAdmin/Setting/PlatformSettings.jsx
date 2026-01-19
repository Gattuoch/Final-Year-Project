import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import SettingHeader from "./SettingHeader";
import SettingsMenu from "./SettingsMenu";

/* ---------- Toggle ---------- */
const Toggle = ({ enabled, onChange }) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300
        ${enabled ? "bg-green-600" : "bg-gray-300"}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300
          ${enabled ? "translate-x-5" : "translate-x-1"}`}
      />
    </button>
  );
};

/* ---------- Setting Row ---------- */
const SettingRow = ({ title, description, enabled, onToggle }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 px-5 py-4 hover:bg-gray-100 transition">
      <div>
        <h4 className="font-medium text-gray-900 text-sm sm:text-base">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {description}
        </p>
      </div>

      <Toggle enabled={enabled} onChange={onToggle} />
    </div>
  );
};

/* ---------- Platform Settings ---------- */
const PlatformSettings = () => {
  const [settings, setSettings] = useState({
    registration: true,
    deletion: false,
    verification: false,
    emailNotifications: false,
    smsNotifications: false,
  });

  const toggle = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 md:px-8 pt-6 pb-8">
        {/* Header */}
        <SettingHeader />

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Settings Menu */}
          <div className="lg:col-span-3">
            <SettingsMenu />
          </div>

          {/* Right Panel */}
          <section className="lg:col-span-9 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 md:p-8">
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                Platform Configuration
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Manage platform features and user permissions
              </p>
            </div>

            {/* <hr className="mb-6" /> */}

            {/* Settings */}
            <div className="space-y-3 sm:space-y-4">
              <SettingRow
                title="Allow New User Registration"
                description="Enable public sign-ups for new users"
                enabled={settings.registration}
                onToggle={() => toggle("registration")}
              />

              <SettingRow
                title="Allow User Account Deletion"
                description="Permit users to delete their own accounts"
                enabled={settings.deletion}
                onToggle={() => toggle("deletion")}
              />

              <SettingRow
                title="Enable User Profile Verification"
                description="Require email verification for new users"
                enabled={settings.verification}
                onToggle={() => toggle("verification")}
              />

              <SettingRow
                title="Enable User Email Notifications"
                description="Send email alerts for account activities"
                enabled={settings.emailNotifications}
                onToggle={() => toggle("emailNotifications")}
              />

              <SettingRow
                title="Enable User SMS Notifications"
                description="Send SMS alerts for account activities"
                enabled={settings.smsNotifications}
                onToggle={() => toggle("smsNotifications")}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PlatformSettings;
