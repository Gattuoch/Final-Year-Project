import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import SettingHeader from "./SettingHeader";
import SettingsMenu from "./SettingsMenu";

const Input = ({ label, type = "text", value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const TemplateRow = ({ title, description }) => (
  <div className="flex items-center justify-between">
    <div>
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <button
      className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm
                 hover:bg-gray-100 transition"
    >
      Edit
    </button>
  </div>
);

const EmailSettings = () => {
  const [form, setForm] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "noreply@ethiocampground.com",
    smtpPassword: "************",
    fromEmail: "noreply@ethiocampground.com",
    fromName: "ETHIOCAMPGROUND",
    replyTo: "support@ethiocampground.com",
    encryption: "TLS",
  });

  const handleChange = (key) => (e) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <SettingHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-3">
            <SettingsMenu />
          </div>

          <section className="lg:col-span-9">
            <div className="max-w-4xl bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              {/* Header */}
              <h2 className="text-2xl font-bold text-gray-900">
                Email Settings
              </h2>
              <p className="text-gray-500 mt-1">
                Configure SMTP and email delivery settings
              </p>

              <div className="h-px bg-gray-200 my-6" />

              {/* SMTP Configuration */}
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  SMTP Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="SMTP Host"
                    value={form.smtpHost}
                    onChange={handleChange("smtpHost")}
                  />
                  <Input
                    label="SMTP Port"
                    value={form.smtpPort}
                    onChange={handleChange("smtpPort")}
                  />
                  <Input
                    label="SMTP Username"
                    value={form.smtpUsername}
                    onChange={handleChange("smtpUsername")}
                  />
                  <Input
                    label="SMTP Password"
                    type="password"
                    value={form.smtpPassword}
                    onChange={handleChange("smtpPassword")}
                  />
                </div>
              </div>

              {/* Email Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Input
                  label="From Email Address"
                  value={form.fromEmail}
                  onChange={handleChange("fromEmail")}
                />
                <Input
                  label="From Name"
                  value={form.fromName}
                  onChange={handleChange("fromName")}
                />
                <Input
                  label="Reply-To Email"
                  value={form.replyTo}
                  onChange={handleChange("replyTo")}
                />
                <Select
                  label="Encryption Type"
                  value={form.encryption}
                  onChange={handleChange("encryption")}
                  options={["TLS", "SSL", "None"]}
                />
              </div>

              {/* Email Templates */}
              <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Email Templates
                </h3>

                <div className="space-y-4">
                  <TemplateRow
                    title="Welcome Email"
                    description="Sent to new users upon registration"
                  />
                  <TemplateRow
                    title="Booking Confirmation"
                    description="Sent after successful booking"
                  />
                  <TemplateRow
                    title="Password Reset"
                    description="Sent when user requests password reset"
                  />
                  <TemplateRow
                    title="Payment Receipt"
                    description="Sent after successful payment"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default EmailSettings;
