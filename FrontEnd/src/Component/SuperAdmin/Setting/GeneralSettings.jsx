import React from "react";
import Sidebar from "../sidebar/Sidebar";
import SettingHeader from "./SettingHeader";
import SettingsMenu from "./SettingsMenu";

const GeneralSettings = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 md:px-8 pt-6 pb-10">
        <SettingHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Settings Menu */}
          <div className="lg:col-span-3">
            <SettingsMenu />
          </div>

          {/* Content */}
          <section className="lg:col-span-9 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                General Settings
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Configure basic platform information
              </p>
            </div>

            {/* <hr className="mb-8" /> */}

            {/* Form */}
            <form className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Platform Name"
                  value="ETHIOCAMPGROUND"
                />
                <Input
                  label="Contact Email"
                  type="email"
                  value="contact@ethiocampground.com"
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Support Phone"
                  value="+251 911 234 567"
                />
                <Select
                  label="Timezone"
                  options={[
                    "East Africa Time (EAT)",
                    "UTC",
                    "GMT",
                  ]}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform Description
                </label>
                <textarea
                  rows={4}
                  defaultValue="Leading camping and outdoor event platform in Ethiopia, connecting nature enthusiasts with premium camping experiences."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                             focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Currency"
                  options={[
                    "Ethiopian Birr (ETB)",
                    "USD",
                    "EUR",
                  ]}
                />
                <Select
                  label="Language"
                  options={[
                    "English",
                    "Amharic",
                  ]}
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 text-white
                             px-6 py-2.5 rounded-lg text-sm font-medium transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

/* ---------- Reusable Components ---------- */

const Input = ({ label, type = "text", value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      defaultValue={value}
      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                 focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  </div>
);

const Select = ({ label, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm
                 focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default GeneralSettings;
