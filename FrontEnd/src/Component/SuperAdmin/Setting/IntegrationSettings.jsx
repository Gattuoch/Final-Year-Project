import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import SettingHeader from "./SettingHeader";
import SettingsMenu from "./SettingsMenu";
import { 
  TbPlug, TbCreditCard, TbMail, TbMap, TbMessageCircle, 
  TbBrandStripe, TbBrandSlack, TbBrandGoogleAnalytics, 
  TbApi
} from "react-icons/tb";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

/* ---------- Toggle ---------- */
const Toggle = ({ enabled, onChange }) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        ${enabled ? "bg-green-600" : "bg-gray-300"}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300
          ${enabled ? "translate-x-5" : "translate-x-1"}`}
      />
    </button>
  );
};

/* ---------- Integration Card ---------- */
const IntegrationCard = ({ title, description, enabled, onToggle, icon: Icon, category }) => {
  return (
    <div className={`relative flex flex-col p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${enabled ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:border-green-300 bg-white'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl transition-colors duration-300 ${enabled ? 'bg-green-100 text-green-600 shadow-sm' : 'bg-gray-50 border border-gray-100 text-gray-500'}`}>
          <Icon className="text-2xl" />
        </div>
        <Toggle enabled={enabled} onChange={onToggle} />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 text-base">{title}</h4>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">{description}</p>
      </div>
      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md tracking-wide uppercase">
          {category}
        </span>
        <div className="flex items-center gap-1.5">
          {enabled ? (
            <><FiCheckCircle className="text-green-500 text-sm" /><span className="text-sm text-green-600 font-medium">Active</span></>
          ) : (
             <><FiXCircle className="text-gray-400 text-sm" /><span className="text-sm text-gray-500 font-medium">Inactive</span></>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- Integration Settings ---------- */
const IntegrationSettings = () => {
  const [settings, setSettings] = useState({
    stripe: true,
    chapa: false,
    sendgrid: true,
    twilio: false,
    googleMaps: true,
    googleAnalytics: false,
    slack: true,
    customApi: false,
  });

  const toggle = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const integrationsList = [
    { id: "stripe", title: "Stripe", description: "Secure online payments and subscription billing processing.", category: "Payments", icon: TbBrandStripe },
    { id: "chapa", title: "Chapa Payment", description: "Local payment gateway integration for Ethiopian Birr transactions.", category: "Payments", icon: TbCreditCard },
    { id: "sendgrid", title: "SendGrid Email", description: "Reliable transactional email sending and management service.", category: "Communication", icon: TbMail },
    { id: "twilio", title: "Twilio SMS", description: "Send SMS alerts, OTPs, and verifications to users globally.", category: "Communication", icon: TbMessageCircle },
    { id: "googleMaps", title: "Google Maps", description: "Integrate interactive maps, routing, and location services.", category: "Maps & Location", icon: TbMap },
    { id: "googleAnalytics", title: "Google Analytics", description: "Track user behavior, traffic, and platform engagement insights.", category: "Analytics", icon: TbBrandGoogleAnalytics },
    { id: "slack", title: "Slack Notifications", description: "Send system alerts and critical notifications directly to channels.", category: "Productivity", icon: TbBrandSlack },
    { id: "customApi", title: "Custom Webhooks", description: "Connect external services and APIs via secure endpoints.", category: "Developers", icon: TbApi },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50/50">
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
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-xl hidden sm:flex">
                  <TbPlug className="text-2xl text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Integrations & Apps
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Supercharge your platform by connecting your favorite tools and services.
                  </p>
                </div>
              </div>
              <button className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition shadow-sm">
                Explore Directory
              </button>
            </div>

            {/* Integration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {integrationsList.map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  title={integration.title}
                  description={integration.description}
                  category={integration.category}
                  enabled={settings[integration.id]}
                  onToggle={() => toggle(integration.id)}
                  icon={integration.icon}
                />
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div>
                  <h4 className="text-sm font-semibold text-gray-900">Need a custom integration?</h4>
                  <p className="text-sm text-gray-500 mt-0.5">Contact our support team to request new integrations.</p>
               </div>
                <button className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium text-sm rounded-xl shadow-sm hover:bg-gray-50 transition">
                    Contact Support
                </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default IntegrationSettings;
