import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import SettingHeader from "./SettingHeader";
import SettingsMenu from "./SettingsMenu";

/* ---------- Toggle ---------- */
const Toggle = ({ enabled, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full
      transition-colors duration-300
      ${enabled ? "bg-green-600" : "bg-gray-300"}`}
  >
    <span
      className={`inline-block h-5 w-5 rounded-full bg-white shadow
        transition-transform duration-300
        ${enabled ? "translate-x-5" : "translate-x-1"}`}
    />
  </button>
);

/* ---------- Payment Settings ---------- */
const PaymentSettings = () => {
  const [toggles, setToggles] = useState({
    payouts: true,
    partialRefunds: true,
  });

  const toggle = (key) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

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
          {/* Menu */}
          <div className="lg:col-span-3">
            <SettingsMenu />
          </div>

          {/* Content */}
          <section className="lg:col-span-9 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 md:p-8">
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Payment Settings
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Configure payment gateways and transaction settings
              </p>
            </div>

            {/* <hr className="mb-6" /> */}

            {/* Basic Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Payment Gateway
                </label>
                <select className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 focus:ring-2 focus:ring-green-500">
                  <option>Stripe</option>
                  <option>PayPal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  defaultValue="15"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Booking Amount (ETB)
                </label>
                <input
                  type="number"
                  defaultValue="500"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Refund Processing Time (Days)
                </label>
                <input
                  type="number"
                  defaultValue="7"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* API Keys */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 sm:p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Payment Gateway API Keys
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Stripe Publishable Key
                  </label>
                  <input
                    type="text"
                    value="pk_live_••••••••••••••••"
                    readOnly
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Stripe Secret Key
                  </label>
                  <input
                    type="password"
                    value="••••••••••••••••••••"
                    readOnly
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4">
              {[
                {
                  title: "Enable Automatic Payouts",
                  desc: "Automatically transfer funds to camp owners",
                  key: "payouts",
                },
                {
                  title: "Allow Partial Refunds",
                  desc: "Enable partial refund processing",
                  key: "partialRefunds",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between
                             gap-4 bg-gray-50 rounded-xl px-5 py-4 "
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {item.desc}
                    </p>
                  </div>

                  <Toggle
                    enabled={toggles[item.key]}
                    onChange={() => toggle(item.key)} className="cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PaymentSettings;
