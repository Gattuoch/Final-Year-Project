import React, { useState, useEffect } from "react";
import ToggleSwitch from "./ToggleSwitch";
const GeneralPreferences = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  

  // Apply dark mode to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSave = () => {
    const preferences = {
      darkMode,
      language,
      emailNotifications,
      twoFactorAuth,
    };

    console.log("Saved Preferences:", preferences);
    // TODO: Send to backend API
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800 max-w-3xl">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          General Preferences
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Customize your interface and notification settings
        </p>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800 space-y-6">

        {/* Dark Mode */}
        <div className="flex items-center justify-between pt-6">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              Dark Mode
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Switch between light and dark themes
            </p>
          </div>

          <ToggleSwitch
            enabled={darkMode}
            setEnabled={setDarkMode}
          />
        </div>

        {/* Language */}
        <div className="flex items-center justify-between pt-6">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              Language
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select your preferred interface language
            </p>
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English (US)</option>
            <option value="en-uk">English (UK)</option>
            <option value="fr">French</option>
            <option value="ar">Arabic</option>
          </select>
        </div>

        {/* Email Notifications */}
        <div className="flex items-center justify-between pt-6">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              Email Notifications
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Receive updates and activity digests
            </p>
          </div>

          <ToggleSwitch
            enabled={emailNotifications}
            setEnabled={setEmailNotifications}
          />
        </div>

        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between pt-6">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              Two-Factor Authentication
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add an extra layer of security to your account
            </p>
          </div>

          <ToggleSwitch
            enabled={twoFactorAuth}
            setEnabled={setTwoFactorAuth}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition focus:outline-none focus:ring-4 focus:ring-blue-200"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default GeneralPreferences;
