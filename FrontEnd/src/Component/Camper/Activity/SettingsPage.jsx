import React from "react";
import { FiLock } from "react-icons/fi";
import Sidebar from "../Sidebar/Sidebar";
import AccountSetting from "./AccountSetting";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Wrapper */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Settings Menu */}
          <div className="lg:col-span-3">
            <AccountSetting />
          </div>

          {/* Main Content */}
          <section className="lg:col-span-9">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              
              {/* Content */}
              <div className="px-6 py-6 space-y-6">
                
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                  <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm rounded-md border bg-white hover:bg-gray-50">
                      Upload New
                    </button>
                    <button className="px-4 py-2 text-sm rounded-md text-gray-400 cursor-not-allowed">
                      Remove
                    </button>
                  </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 gap-5 max-w-xl">
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Alex Morgan"
                      className="w-full rounded-md border-gray-200 bg-[#f6faf7] focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        defaultValue="alex.morgan@acme.com"
                        disabled
                        className="w-full rounded-md border-gray-200 bg-gray-100 pr-10 text-gray-500"
                      />
                      <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 012-3456"
                      className="w-full rounded-md border-gray-200 bg-[#f6faf7] focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-[#f6faf7] flex justify-end rounded-b-xl">
                <button className="bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition">
                  Save Changes
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
