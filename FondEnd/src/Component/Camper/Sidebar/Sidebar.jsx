import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  WalletIcon,
  TicketIcon,
  CalendarIcon,
  BellIcon,
  Cog6ToothIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  CreditCardIcon,
  ChatBubbleLeftIcon,
  ArrowRightIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import logoIcon from "../../../assets/logo-icon.png";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* ================= Mobile Overlay ================= */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ================= Sidebar ================= */}
      <aside
        className={`
          fixed top-0 left-0 z-50 lg:sticky
          h-screen w-64 bg-white shadow-lg
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 ">
          <span className="font-semibold">     </span>
          <button onClick={closeSidebar}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5">
          <img src={logoIcon} className="w-10 h-10" alt="Logo" />
          <div>
            <h1 className="text-lg font-bold">EthioCampGround</h1>
            <p className="text-xs text-gray-500">Camper Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <Section title="MAIN">
            <NavItem to="/camper-dashboard" icon={HomeIcon} label="Dashboard" onClick={closeSidebar} />
            <NavItem to="/camper-dashboard/profile" icon={UserIcon} label="My Profile" onClick={closeSidebar} />
            <NavItem to="/camper-dashboard/wallet" icon={WalletIcon} label="Wallet" onClick={closeSidebar} />
          </Section>

          <Section title="BOOKINGS">
            <NavItem to="/camper-dashboard/tickets" icon={TicketIcon} label="Day Visit Tickets" onClick={closeSidebar} />
            <NavItem to="/camper-dashboard/search" icon={MagnifyingGlassIcon} label="Search Facilities" onClick={closeSidebar} />
            <NavItem to="/camper-dashboard/reservations" icon={CalendarIcon} label="My Reservations" badge="3" onClick={closeSidebar} />
          </Section>

          <Section title="ACTIVITY">
            <NavItem to="/camper-dashboard/history" icon={ClockIcon} label="History" onClick={closeSidebar} />
            <NavItem to="/camper-dashboard/notifications" icon={BellIcon} label="Notifications" badge="5" onClick={closeSidebar} />
            <NavItem to="/camper-dashboard/payments" icon={CreditCardIcon} label="Payments" onClick={closeSidebar} />
          </Section>

          <Section title="SUPPORT">
            <NavItem to="/camper-dashboard/feedback" icon={ChatBubbleLeftIcon} label="Feedback" onClick={closeSidebar} />
            <NavItem to="/camper-dashboard/settings" icon={Cog6ToothIcon} label="Settings" onClick={closeSidebar} />
          </Section>
        </nav>

        {/* Profile */}
        <SidebarProfile onClick={closeSidebar} />
      </aside>

      {/* ================= Mobile Open Button ================= */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 bg-white p-3 rounded-xl shadow"
        >
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        </button>
      )}
    </>
  );
}

/* ---------------- Section ---------------- */
function Section({ title, children }) {
  return (
    <div>
      <p className="px-3 mb-2 text-xs font-semibold tracking-widest text-gray-400">
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

/* ---------------- Nav Item (✅ FIXED) ---------------- */
function NavItem({ icon: Icon, label, to, badge, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `
        flex items-center gap-3 px-4 py-3 rounded-xl transition
        ${
          isActive
            ? "bg-green-600 text-white shadow"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }
        `
      }
    >
      <Icon className="w-5 h-5" />
      <span className="flex-1 text-sm font-medium">{label}</span>

      {badge && (
        <span className="bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

/* ---------------- Profile ---------------- */
function SidebarProfile({ onClick }) {
  return (
    <div className="px-4 py-3 bg-gray-50 lg:bg-white">
      <NavLink
        to="/profile"
        onClick={onClick}
        className="
          flex items-center gap-4
          p-4 rounded-2xl
          bg-white
          shadow-sm
          transition-all duration-200
          active:scale-[0.98]
          hover:bg-green-600 hover:text-white
          group
        "
      >
        {/* Avatar */}
        <div className="relative">
          <img
            src="https://i.pravatar.cc/80"
            className="
              w-12 h-12 rounded-full
              object-cover
              ring-2 ring-green-500
            "
            alt="User"
          />

          {/* Online Indicator */}
          <span className="
            absolute bottom-0 right-0
            w-3 h-3 rounded-full
            bg-green-500
            border-2 border-white
          " />
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">
            John Doe
          </p>
          <p className="
            text-xs text-gray-500
            truncate
            group-hover:text-green-100
          ">
            johndoe@example.com
          </p>
        </div>

        {/* Arrow */}
        <ArrowRightIcon
          className="
            w-5 h-5
            text-gray-400
            group-hover:text-white
            transition
          "
        />
      </NavLink>
    </div>
  );
}
