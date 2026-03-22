import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import SettingHeader from "./SettingHeader";
import SettingsMenu from "./SettingsMenu";
import { FiDatabase, FiHardDrive, FiCloud, FiClock, FiDownload } from "react-icons/fi";

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
const SettingRow = ({ title, description, enabled, onToggle, icon: Icon }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 px-5 py-4 hover:bg-gray-100 transition">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="p-2 bg-white rounded-lg border border-gray-100 text-gray-600 shrink-0 mt-1 sm:mt-0">
            <Icon className="text-xl" />
          </div>
        )}
        <div>
          <h4 className="font-medium text-gray-900 text-sm sm:text-base">
            {title}
          </h4>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {description}
          </p>
        </div>
      </div>

      <Toggle enabled={enabled} onChange={onToggle} />
    </div>
  );
};

/* ---------- Backup Settings ---------- */
const BackupSettings = () => {
  const [settings, setSettings] = useState({
    automatedBackups: true,
    cloudSync: true,
    databaseBackup: true,
    mediaBackup: false,
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
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiDatabase className="text-2xl text-green-600 hidden sm:block" />
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                    Backup & Restore
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Manage system backups, retention policies, and data recovery
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-medium text-sm rounded-lg shadow hover:bg-gray-800 transition whitespace-nowrap">
                <FiDownload />
                <span className="hidden sm:inline">Backup Now</span>
              </button>
            </div>

            {/* Last Backup Status */}
            <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
                <div>
                    <h4 className="text-sm font-medium text-blue-900">Last Successful Backup</h4>
                    <p className="text-xs text-blue-700 mt-1">Today at 04:00 AM (Database & Files)</p>
                </div>
                <div className="text-xs font-semibold text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                    Size: 1.2 GB
                </div>
            </div>

            {/* Settings */}
            <div className="space-y-3 sm:space-y-4">
              <SettingRow
                title="Automated Daily Backups"
                description="Schedule automatic backups every day at 04:00 AM system time"
                enabled={settings.automatedBackups}
                onToggle={() => toggle("automatedBackups")}
                icon={FiClock}
              />

              <SettingRow
                title="Cloud Storage Sync"
                description="Automatically upload backup archives to remote secure cloud storage"
                enabled={settings.cloudSync}
                onToggle={() => toggle("cloudSync")}
                icon={FiCloud}
              />

              <SettingRow
                title="Database Backup Only"
                description="Include only structured database records (excludes media/files)"
                enabled={settings.databaseBackup}
                onToggle={() => toggle("databaseBackup")}
                icon={FiDatabase}
              />

              <SettingRow
                title="Include Media Uploads"
                description="Include all user-uploaded images, documents, and other media files"
                enabled={settings.mediaBackup}
                onToggle={() => toggle("mediaBackup")}
                icon={FiHardDrive}
              />
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Backups</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium">Type</th>
                                <th className="px-4 py-3 font-medium">Size</th>
                                <th className="px-4 py-3 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3">Mar 15, 2026</td>
                                <td className="px-4 py-3">Full Backup</td>
                                <td className="px-4 py-3">1.2 GB</td>
                                <td className="px-4 py-3 text-right text-green-600 font-medium cursor-pointer hover:underline">Restore</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3">Mar 14, 2026</td>
                                <td className="px-4 py-3">Full Backup</td>
                                <td className="px-4 py-3">1.1 GB</td>
                                <td className="px-4 py-3 text-right text-green-600 font-medium cursor-pointer hover:underline">Restore</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
};

export default BackupSettings;
