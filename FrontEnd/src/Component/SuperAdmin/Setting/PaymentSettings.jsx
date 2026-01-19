import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import { FiSave } from "react-icons/fi";
import SettingHeader from "./SettingHeader";
import SettingsMenu from "./SettingsMenu";

/* ---------- Reusable Toggle Component ---------- */
const Toggle = ({ enabled, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
      enabled ? "bg-green-600" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
        enabled ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </button>
);

export default function PaymentSettings() {
  const [payment, setPayment] = useState({
    payouts: true,
    partialRefunds: true,
    defaultGateway: "Stripe",
    commissionRate: 15,
    minBookingAmount: 500,
    refundProcessingDays: 7,
    stripe: { publishableKey: "", secretKey: "" },
    chapa: { publicKey: "", secretKey: "" },
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Fetch initial settings
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/superadmin/settings", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error("Failed to fetch settings");
        const body = await res.json();
        if (body?.settings?.payment) {
          setPayment((p) => ({ ...p, ...body.settings.payment }));
        }
      } catch (err) {
        setError(err.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const toggle = (key) => setPayment((prev) => ({ ...prev, [key]: !prev[key] }));

  const updateNested = (parent, key, value) => {
    setPayment((prev) => ({
      ...prev,
      [parent]: { ...(prev[parent] || {}), [key]: value },
    }));
  };

  /* ---------- Validation Logic ---------- */
  const validate = () => {
    const errs = {};
    if (payment.commissionRate == null || payment.commissionRate < 0)
      errs.commissionRate = "Commission rate must be 0 or greater.";
    if (!payment.minBookingAmount || payment.minBookingAmount <= 0)
      errs.minBookingAmount = "Minimum booking amount must be greater than 0.";
    if (payment.refundProcessingDays == null || payment.refundProcessingDays < 0)
      errs.refundProcessingDays = "Refund processing days must be 0 or greater.";

    // Key Regex Checks
    const pkRegex = /^pk_/i;
    const skRegex = /^sk_/i;
    const chapaPubRegex = /^(CHAPUBK_|cpk_)/i;
    const chapaSecRegex = /^(CHASECK_|csk_)/i;

    if (payment.defaultGateway === "Chapa") {
      if (!payment.chapa?.publicKey) errs["chapa.publicKey"] = "Chapa public key is required.";
      else if (!chapaPubRegex.test(payment.chapa.publicKey)) errs["chapa.publicKey"] = "Invalid Chapa public key format.";

      if (!payment.chapa?.secretKey) errs["chapa.secretKey"] = "Chapa secret key is required.";
      else if (!chapaSecRegex.test(payment.chapa.secretKey)) errs["chapa.secretKey"] = "Invalid Chapa secret key format.";
    }

    if (payment.defaultGateway === "Stripe") {
      if (!payment.stripe?.publishableKey) errs["stripe.publishableKey"] = "Stripe publishable key is required.";
      else if (!pkRegex.test(payment.stripe.publishableKey)) errs["stripe.publishableKey"] = "Invalid Stripe publishable key.";

      if (!payment.stripe?.secretKey) errs["stripe.secretKey"] = "Stripe secret key is required.";
      else if (!skRegex.test(payment.stripe.secretKey)) errs["stripe.secretKey"] = "Invalid Stripe secret key.";
    }

    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setFieldErrors({});
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/superadmin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ payment }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Save failed");

      setSuccess("Settings saved successfully");
      if (body.settings?.payment) setPayment(body.settings.payment);
    } catch (err) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const renderError = (key) => fieldErrors[key] && (
    <p className="text-xs text-red-600 mt-1">{fieldErrors[key]}</p>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />
      <main className="flex-1 w-full px-4 sm:px-6 md:px-8 pt-6 pb-8">
        <SettingHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-3">
            <SettingsMenu />
          </div>

          <section className="lg:col-span-9 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Payment Settings</h2>
              <p className="text-sm text-gray-500 mt-1">Configure gateways and transaction rules</p>
            </div>

            {/* General Settings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              <div>
                <label className="block text-sm font-medium mb-1">Default Gateway</label>
                <select
                  value={payment.defaultGateway}
                  onChange={(e) => setPayment({ ...payment, defaultGateway: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 focus:ring-2 focus:ring-green-500"
                >
                  <option value="Stripe">Stripe</option>
                  <option value="Chapa">Chapa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Commission Rate (%)</label>
                <input
                  type="number"
                  value={payment.commissionRate}
                  onChange={(e) => setPayment({ ...payment, commissionRate: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500"
                />
                {renderError("commissionRate")}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Min Booking (ETB)</label>
                <input
                  type="number"
                  value={payment.minBookingAmount}
                  onChange={(e) => setPayment({ ...payment, minBookingAmount: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500"
                />
                {renderError("minBookingAmount")}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Refund Buffer (Days)</label>
                <input
                  type="number"
                  value={payment.refundProcessingDays}
                  onChange={(e) => setPayment({ ...payment, refundProcessingDays: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500"
                />
                {renderError("refundProcessingDays")}
              </div>
            </div>

            {/* API Key Section */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8">
              <h3 className="font-semibold text-blue-900 mb-4">Gateway Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-blue-800 uppercase">Stripe Publishable Key</label>
                  <input
                    type="text"
                    value={payment.stripe?.publishableKey || ""}
                    onChange={(e) => updateNested("stripe", "publishableKey", e.target.value)}
                    className="w-full mt-1 rounded-lg border border-gray-300 px-3 py-2 bg-white"
                  />
                  {renderError("stripe.publishableKey")}
                </div>
                <div>
                  <label className="text-xs font-bold text-blue-800 uppercase">Stripe Secret Key</label>
                  <input
                    type="password"
                    value={payment.stripe?.secretKey || ""}
                    onChange={(e) => updateNested("stripe", "secretKey", e.target.value)}
                    className="w-full mt-1 rounded-lg border border-gray-300 px-3 py-2 bg-white"
                  />
                  {renderError("stripe.secretKey")}
                </div>
                <div className="md:col-span-1">
                  <label className="text-xs font-bold text-blue-800 uppercase">Chapa Public Key</label>
                  <input
                    type="text"
                    value={payment.chapa?.publicKey || ""}
                    onChange={(e) => updateNested("chapa", "publicKey", e.target.value)}
                    className="w-full mt-1 rounded-lg border border-gray-300 px-3 py-2 bg-white"
                  />
                  {renderError("chapa.publicKey")}
                </div>
                <div>
                  <label className="text-xs font-bold text-blue-800 uppercase">Chapa Secret Key</label>
                  <input
                    type="password"
                    value={payment.chapa?.secretKey || ""}
                    onChange={(e) => updateNested("chapa", "secretKey", e.target.value)}
                    className="w-full mt-1 rounded-lg border border-gray-300 px-3 py-2 bg-white"
                  />
                  {renderError("chapa.secretKey")}
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              {[
                { title: "Enable Automatic Payouts", key: "payouts" },
                { title: "Allow Partial Refunds", key: "partialRefunds" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between bg-gray-50 rounded-xl px-5 py-3">
                  <span className="font-medium">{item.title}</span>
                  <Toggle enabled={payment[item.key]} onChange={() => toggle(item.key)} />
                </div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <div className="flex-1">
                {loading && <p className="text-sm text-gray-500 animate-pulse">Fetching settings...</p>}
                {error && <p className="text-sm text-red-600 font-medium">⚠️ {error}</p>}
                {success && <p className="text-sm text-green-600 font-medium">✅ {success}</p>}
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold transition shadow-md ${
                  saving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FiSave />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}