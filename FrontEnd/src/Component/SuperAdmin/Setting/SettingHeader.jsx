import React from "react";
import { FiMenu, FiBell } from "react-icons/fi";
import { FaSave } from "react-icons/fa";

const SettingHeader = ({ setSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        {/* ---------- LEFT ---------- */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <button
            type="button"
            className="md:hidden text-2xl text-gray-600 hover:text-gray-900 transition"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <FiMenu />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
              Settings
            </h1>
            <p className="hidden sm:block text-sm text-gray-500 mt-0.5">
              Manage system preferences and configurations
            </p>
          </div>
        </div>

        {/* ---------- RIGHT ---------- */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Save Button (Desktop) */}
          <button
            type="button"
            className="hidden sm:flex items-center gap-2 bg-green-600 hover:bg-green-700 
                       text-white px-4 py-2 rounded-lg text-sm font-medium transition
                       focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer h-11"
          >
            <FaSave className="text-base" />
            Save Changes
          </button>

          {/* Save Button (Mobile) */}
          <button
            type="button"
            className="sm:hidden bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg
                       transition focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Save changes"
          >
            <FaSave className="text-lg" />
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="relative text-xl text-gray-600 hover:text-gray-900 transition h-7"
            aria-label="Notifications"
          >
            <FiBell />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Avatar */}
          <img
            src="https://i.pravatar.cc/40"
            alt="Admin profile"
            className="w-9 h-9 rounded-full object-cover cursor-pointer ring-1 ring-gray-200 hover:ring-green-500 transition"
          />
        </div>
      </div>
    </header>
  );
};

export default SettingHeader;
