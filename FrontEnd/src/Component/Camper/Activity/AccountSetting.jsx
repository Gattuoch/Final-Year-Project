import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiUser, FiShield, FiBell } from "react-icons/fi";

const menuItems = [
  {
    label: "Profile Information",
    icon: FiUser,
    path: "/camper-dashboard/settings",
  },
  {
    label: "Security & Password",
    icon: FiShield,
    path: "/camper-dashboard/settings/security-password",
  },
  {
    label: "Notifications",
    icon: FiBell,
    path: "/camper-dashboard/settings/notification",
  },
];

export default function AccountSetting() {
  const location = useLocation();

  return (
    <aside className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 w-full h-fit">
      
      {/* Header */}
      <div className="mb-6 px-2">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage your preferences
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {menuItems.map(({ label, icon: Icon, path }) => {
          // Exact match for root settings, startsWith for others to handle sub-routes if any
          const isActive = path === "/camper-dashboard/settings" 
            ? location.pathname === path 
            : location.pathname.startsWith(path);

          return (
            <NavLink
              key={label}
              to={path}
              className={`
                group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive 
                  ? "bg-emerald-50 text-emerald-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <Icon className={`text-lg ${isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-600"}`} />
              {label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}