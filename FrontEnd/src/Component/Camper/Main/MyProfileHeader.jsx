import React from "react";
import { Download } from "lucide-react";
import { FiSave } from "react-icons/fi";

const MyProfileHeader = () => {
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Left */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            My Profile
          </h1>
          <p className="text-sm text-gray-500">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Export */}
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-100 transition">
            <Download size={18} />
            Export Data
          </button>

          {/* Save */}
          <button 
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white
                           px-5 py-2.5 rounded-lg text-sm font-medium transition">
            <FiSave size={18} />
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default MyProfileHeader;
