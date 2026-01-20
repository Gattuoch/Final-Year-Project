import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  TicketIcon,
  CalendarIcon,
  BellIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  CreditCardIcon,
  ChatBubbleLeftIcon,
  ArrowRightOnRectangleIcon,
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
        {/* ================= Mobile Header ================= */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3">
          <span />
          <button onClick={closeSidebar}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* ================= Logo ================= */}
        <NavLink
          to="/camper-dashboard"
          end
          onClick={closeSidebar}
          className="flex items-center gap-3 px-6 py-5"
        >
          <img src={logoIcon} className="w-10 h-10" alt="Logo" />
          <div>
            <h1 className="text-lg font-bold">EthioCampGround</h1>
            <p className="text-xs text-gray-500">Camper Portal</p>
          </div>
        </NavLink>

        {/* ================= Navigation ================= */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* HOME */}
          <Section title="HOME">
            <NavItem
              to="/camper-dashboard"
              icon={HomeIcon}
              label="Home"
              end
              onClick={closeSidebar}
            />
          </Section>

          {/* TRIPS */}
          <Section title="MY TRIPS">
            <NavItem
              to="/camper-dashboard/campsite-directory"
              icon={MagnifyingGlassIcon}
              label="Find a Campsite"
              onClick={closeSidebar}
            />
            <NavItem
              to="/camper-dashboard/reservations"
              icon={CalendarIcon}
              label="My Trips"
              badge="3"
              onClick={closeSidebar}
            />
            <NavItem
              to="/camper-dashboard/tickets"
              icon={TicketIcon}
              label="Day Visits"
              onClick={closeSidebar}
            />
          </Section>

          {/* PAYMENTS */}
          <Section title="PAYMENTS">
            <NavItem
              to="/camper-dashboard/payments"
              icon={CreditCardIcon}
              label="Payments "
              onClick={closeSidebar}
            />
          </Section>

          {/* UPDATES */}
          <Section title="UPDATES">
            <NavItem
              to="/camper-dashboard/notifications"
              icon={BellIcon}
              label="Notifications"
              badge="5"
              onClick={closeSidebar}
            />
          </Section>

          {/* ACCOUNT */}
          <Section title="ACCOUNT">
            <NavItem
              to="/camper-dashboard/profile"
              icon={UserIcon}
              label="Profile"
              onClick={closeSidebar}
            />
            <NavItem
              to="/camper-dashboard/settings"
              icon={Cog6ToothIcon}
              label="Settings"
              onClick={closeSidebar}
            />
            <NavItem
              to="/logout"
              icon={ArrowRightOnRectangleIcon}
              label="Logout"
              onClick={closeSidebar}
            />
          </Section>

          {/* HELP */}
          <Section title="HELP">
            <NavItem
              to="/camper-dashboard/support"
              icon={ChatBubbleLeftIcon}
              label="Contact Support"
              onClick={closeSidebar}
            />
          </Section>
        </nav>
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

/* ================= Section ================= */
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

/* ================= Nav Item ================= */
function NavItem({ icon: Icon, label, to, badge, onClick, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `
        flex items-center gap-3 px-4 py-3 rounded-xl transition
        ${
          isActive
            ? "bg-green-600 text-white shadow"
            : "text-gray-700 hover:bg-gray-100"
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
