import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import SettingHeader from "./SettingHeader";
import SettingsMenu from "./SettingsMenu";

/* Toggle Switch */
const Toggle = ({ enabled, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full 
      transition-colors duration-300 focus:outline-none
      ${enabled ? "bg-green-600" : "bg-gray-300"}`}
  >
    <span
      className={`absolute h-5 w-5 rounded-full bg-white shadow 
        transition-transform duration-300
        ${enabled ? "translate-x-5" : "translate-x-1"}`}
    />
  </button>
);

/* Single Setting Row */
const SettingRow = ({ title, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between rounded-xl bg-gray-50 px-6 py-5 
                  hover:bg-gray-100 transition">
    <div className="max-w-lg">
      <h4 className="text-sm font-semibold text-gray-900">
        {title}
      </h4>
      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </div>
    <Toggle enabled={enabled} onChange={onToggle} />
  </div>
);

const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    twoFactor: true,
    forcePasswordReset: false,
    sessionTimeout: false,
    ipLogging: false,
    loginAttemptsLogging: false,
  });

  const toggle = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <SettingHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Settings Menu */}
          <div className="lg:col-span-3">
            <SettingsMenu />
          </div>

          {/* Security Settings Card */}
          <section className="lg:col-span-9">
            <div className="max-w-4xl rounded-2xl bg-white border border-gray-100 shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Security Settings
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Configure security and authentication options
                </p>
              </div>

              <div className="h-px bg-gray-200 mb-6" />

              <div className="space-y-4">
                <SettingRow
                  title="Two-Factor Authentication (2FA)"
                  description="Require 2FA for admin accounts"
                  enabled={settings.twoFactor}
                  onToggle={() => toggle("twoFactor")}
                />

                <SettingRow
                  title="Force Password Reset"
                  description="Require password change every 90 days"
                  enabled={settings.forcePasswordReset}
                  onToggle={() => toggle("forcePasswordReset")}
                />

                <SettingRow
                  title="Enable Session Timeout"
                  description="Automatic session termination after inactivity"
                  enabled={settings.sessionTimeout}
                  onToggle={() => toggle("sessionTimeout")}
                />

                <SettingRow
                  title="Enable IP Address Logging"
                  description="Record user IP addresses for security monitoring"
                  enabled={settings.ipLogging}
                  onToggle={() => toggle("ipLogging")}
                />

                <SettingRow
                  title="Enable Login Attempts Logging"
                  description="Track failed login attempts for security analysis"
                  enabled={settings.loginAttemptsLogging}
                  onToggle={() => toggle("loginAttemptsLogging")}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SecuritySettings;
