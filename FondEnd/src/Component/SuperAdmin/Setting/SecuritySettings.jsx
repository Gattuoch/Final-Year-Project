import React, { useState } from "react";

const Toggle = ({ enabled, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition
      ${enabled ? "bg-green-600" : "bg-gray-200"}`}
  >
    <span
      className={`inline-block h-5 w-5 rounded-full bg-white transition
        ${enabled ? "translate-x-5" : "translate-x-1"}`}
    />
  </button>
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
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Security Settings
        </h2>
        <p className="text-gray-500 mt-1">
          Configure security and authentication options
        </p>
      </div>

      <hr className="mb-6" />

      {/* Settings List */}
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
    </section>
  );
};

const SettingRow = ({ title, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-6 py-5">
    <div>
      <h4 className="font-medium text-gray-900">{title}</h4>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
    <Toggle enabled={enabled} onChange={onToggle} />
  </div>
);

export default SecuritySettings;
