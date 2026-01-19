import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiSettings,
  FiGlobe,
  FiCreditCard,
  FiBell,
  FiShield,
  FiGrid ,
  FiMail,
  FiDatabase,
} from "react-icons/fi";
import { TbPlug } from "react-icons/tb";


const menuItems = [
  { label: "General", icon: FiSettings, path: "/super-admin/settings" },
  { label: "Platform", icon: FiGlobe, path: "/super-admin/settings/platform" },
  { label: "Payment", icon: FiCreditCard, path: "/super-admin/settings/payment" },
  { label: "Notifications", icon: FiBell, path: "/super-admin/settings/notifications" },
  { label: "Security", icon: FiShield, path: "/super-admin/settings/security" },
  { label: "Email", icon: FiMail, path: "/super-admin/settings/email" },
  { label: "Integrations", icon: TbPlug, path: "/super-admin/settings/Integration" },
  { label: "Backup", icon: FiDatabase, path: "/super-admin/settings/backup" },
];

const SettingsMenu = () => {
  return (
    <aside
      className="
        bg-white
        rounded-2xl
        border border-gray-100
        shadow-sm
        p-2 sm:p-3 md:p-4
        lg:col-span-3
      "
    >
      <nav
        className="
          flex
          lg:flex-col
          gap-1 sm:gap-2
          overflow-x-auto lg:overflow-visible
          scrollbar-hide
        "
      >
        {menuItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `
              group
              flex items-center justify-center lg:justify-start
              gap-2
              px-3 sm:px-4
              py-2.5
              rounded-xl
              text-xs sm:text-sm
              font-medium
              transition-all
              ${
                isActive
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }
              `
            }
          >
            {/* Icon */}
            <Icon className="text-lg shrink-0" />

            {/* Label */}
            <span className="hidden sm:inline lg:inline">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SettingsMenu;
