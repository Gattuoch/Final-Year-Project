import React from "react";
import { FiMenu, FiPlus, FiBell } from "react-icons/fi";

const CampHeader = ({ setSidebarOpen, onAdd }) => {
  return (
    <header className="bg-white px-4 sm:px-6 py-4 shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* ---------- LEFT ---------- */}
        <div className="flex items-center gap-3">
          {/* Mobile menu */}
          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <FiMenu />
          </button>

          <div className="leading-tight">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">
              Camp Management
            </h1>
            <p className="hidden sm:block text-gray-500 text-sm md:text-base">
              Manage all camps across the platform
            </p>
          </div>
        </div>

        {/* ---------- RIGHT ---------- */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Add Camp */}
          <button
            onClick={() => onAdd && onAdd()}
            className="hidden sm:flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            <FiPlus />
            Add New Camp
          </button>

          {/* Mobile Add Button */}
          <button
            onClick={() => onAdd && onAdd()}
            className="sm:hidden bg-green-600 text-white p-2 rounded-lg"
            aria-label="Add camp"
          >
            <FiPlus />
          </button>
        </div>
      </div>
    </header>
  );
};

export default CampHeader;
