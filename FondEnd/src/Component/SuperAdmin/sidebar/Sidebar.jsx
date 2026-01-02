import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Tent,
  Calendar,
  BookOpen,
  Users,
  DollarSign,
  BarChart2,
  Settings,
  X,
} from "lucide-react";
import {FaCampground} from "react-icons/fa";

import Logo from "../../../assets/super-admin-image.png";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/super-admin" },
  { label: "Camps", icon: Tent, path: "/super-admin/camps" },
  { label: "Events", icon: Calendar, path: "/super-admin/events" },
  { label: "Bookings", icon: BookOpen, path: "/super-admin/bookings" },
  { label: "Users", icon: Users, path: "/super-admin/users" },
  { label: "Finance", icon: DollarSign, path: "/super-admin/finance" },
  { label: "Analytics", icon: BarChart2, path: "/super-admin/analytics" },
  { label: "Settings", icon: Settings, path: "/super-admin/settings" },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* -------- MOBILE OVERLAY -------- */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* -------- SIDEBAR -------- */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="
              fixed md:static
              top-0 left-0
              h-screen w-64
              bg-white
              px-6 py-6
              z-50
              shadow-lg md:shadow-none
              flex flex-col
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <FaCampground className="bg-green-600 text-white rounded-lg w-5 h-8" size={24} />

    <div className="leading-tight">
      <h1 className="text-sm font-bold tracking-wide text-gray-900">
        ETHIOCAMPGROUND
      </h1>
      <span className="text-xs text-gray-500 ">
        Super Admin
      </span>
    </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden"
              >
                <X />
              </button>
            </div>

            {/* Nav */}
            <nav className="space-y-2 overflow-y-auto">
              {navItems.map(({ label, icon: Icon, path }) => (
                <NavItem
                  key={path}
                  label={label}
                  icon={<Icon size={18} />}
                  active={location.pathname === path}
                  onClick={() => {
                    navigate(path);
                    setSidebarOpen(false); // close on mobile click
                  }}
                />
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3
        px-4 py-2 rounded-lg text-sm transition
        ${
          active
            ? "bg-green-50 text-green-700 font-medium"
            : "text-gray-600 hover:bg-gray-100"
        }
      `}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
