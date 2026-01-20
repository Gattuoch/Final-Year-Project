import React from "react";
import { NavLink } from "react-router-dom";
import { FiUser, FiShield, FiBell, FiLock } from "react-icons/fi";

const menuItems = [
  {
    label: "Profile Information",
    icon: FiUser,
    path: "/camper-dashboard/settings",
  },
  {
    label: "Security & Password",
    icon: FiLock,
    path: "/camper-dashboard/settings/security-password",
  },
  {
    label: "Notifications",
    icon: FiBell,
    path: "/camper-dashboard/settings/notification",
  },
];

const AccountSetting = () => {
  return (
    <aside
      className="
        bg-white
        border border-gray-100
        rounded-2xl
        shadow-sm
        p-2 sm:p-3
        w-full
        lg:w-auto
      "
    >
      <nav
        className="
          flex lg:flex-col
          gap-1
          overflow-x-auto lg:overflow-visible
          scrollbar-hide
        "
        aria-label="Account settings navigation"
      > {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your account settings and preferences.
        </p>
      </div>
        {menuItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            end
            className={({ isActive }) =>
              `
              group
              relative
              flex items-center
              gap-3
              px-4
              py-2.5
              rounded-xl
              text-sm
              font-medium
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-green-500
              ${
                isActive
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }
              `
            }
          >
            {/* Active indicator (desktop) */}
            <span
              className={`
                hidden lg:block
                absolute left-0 top-1/2 -translate-y-1/2
                h-6 w-1 rounded-r-full
                transition-all
                ${window.location.pathname === path ? "bg-green-600" : "bg-transparent"}
              `}
            />

            {/* Icon */}
            <Icon className="text-lg shrink-0" />

            {/* Label */}
            <span className="whitespace-nowrap">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AccountSetting;
