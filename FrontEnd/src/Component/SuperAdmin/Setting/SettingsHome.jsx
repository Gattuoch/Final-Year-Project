import React from "react";
import Sidebar from "../sidebar/Sidebar";
import SettingHeader from "./SettingHeader";
import SettingsMenu from "./SettingsMenu";

const EmailSettings = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 w-full pl-6 pr-6 md:pr-8 md:pl-8 pt-6 pb-8">
        {/* Page Header */}
        <div className="flex-1 w-full mb-8">
          <SettingHeader />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Settings Menu */}
          <SettingsMenu />

          {/* Email Settings Panel */}
          <section className="col-span-9 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* Title */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Email Settings
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Configure SMTP and email delivery settings
              </p>
            </div>

            {/* SMTP Configuration */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
              <h4 className="text-sm font-semibold text-gray-800 mb-4">
                SMTP Configuration
              </h4>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "SMTP Host", value: "smtp.gmail.com", type: "text" },
                  { label: "SMTP Port", value: "587", type: "text" },
                  {
                    label: "SMTP Username",
                    value: "noreply@ethiocampground.com",
                    type: "text",
                  },
                  {
                    label: "SMTP Password",
                    value: "password",
                    type: "password",
                  },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={field.value}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Email Info */}
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  label: "From Email Address",
                  value: "noreply@ethiocampground.com",
                  type: "email",
                },
                {
                  label: "From Name",
                  value: "ETHIOCAMPGROUND",
                  type: "text",
                },
                {
                  label: "Reply-To Email",
                  value: "noreply@ethiocampground.com",
                  type: "email",
                },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={field.value}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              ))}

              {/* Encryption */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Encryption Type
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option>TLS</option>
                  <option>SSL</option>
                  <option>None</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default EmailSettings;
