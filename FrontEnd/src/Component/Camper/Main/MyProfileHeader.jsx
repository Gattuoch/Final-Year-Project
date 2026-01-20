import React from "react";
import { Download } from "lucide-react";
import { FiSave } from "react-icons/fi";
import { FaBell, FaUserCircle } from "react-icons/fa";

const MyProfileHeader = ({ onSave, loading, user }) => {
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 sm:px-6 py-4 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* LEFT: Dynamic Page Title & User Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {user?.firstName ? `${user.firstName}'s Profile` : "My Profile"}
          </h1>
          <p className="text-sm text-gray-500">
            Manage your personal information and security settings
          </p>
        </div>

        {/* RIGHT: Global Icons + Page Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Notification Icon (Consistent with Dashboard) */}
          <div className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition hidden sm:block">
            <FaBell className="text-xl text-gray-600" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

          {/* Export Button */}
          <button className="hidden md:flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition">
            <Download size={18} />
            <span className="hidden lg:inline">Export</span>
          </button>

          {/* Save Button (Primary Action) */}
          <button 
            onClick={onSave}
            disabled={loading}
            className={`flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-md hover:shadow-lg
              ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FiSave size={18} />
            )}
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {/* User Icon (Consistent with Dashboard) */}
          <div className="hidden sm:block pl-2">
             <FaUserCircle className="text-3xl text-gray-300" />
          </div>

        </div>

      </div>
    </div>
  );
};

export default MyProfileHeader;