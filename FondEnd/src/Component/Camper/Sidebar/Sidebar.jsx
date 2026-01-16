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
} from "@heroicons/react/24/outline";
import logoIcon from "../../../assets/logo-icon.png";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed lg:static z-50 top-0 left-0 h-screen w-64 bg-white border-r
          flex flex-col transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        aria-hidden={!isOpen}
      >
        {/* Mobile close */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowRightIcon className="w-6 h-6 rotate-180" />
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 pb-6 animate-fade-up animate-stagger-1">
          <img src={logoIcon} className="w-20 h-10" />
          <div>
            <h1 className="text-xl font-bold">EthioCampGround</h1>
            <p className="text-sm text-gray-500">Camper Portal</p>
          </div>
        </div>

        {/* Navigation (scrollable) */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-4 animate-fade-up animate-stagger-2">
          <Section title="MAIN">
            <NavItem to="/" icon={HomeIcon} label="Dashboard" />
            <NavItem to="/profile" icon={UserIcon} label="My Profile" />
            <NavItem to="/wallet" icon={WalletIcon} label="Wallet" />
          </Section>

          <Section title="BOOKINGS">
            <NavItem
              to="/tickets"
              icon={TicketIcon}
              label="Day Visit Tickets"
            />
            <NavItem
              to="/search"
              icon={MagnifyingGlassIcon}
              label="Search Facilities"
            />
            <NavItem
              to="/reservations"
              icon={CalendarIcon}
              label="My Reservations"
              badge="3"
            />
          </Section>

          <Section title="ACTIVITY">
            <NavItem to="/history" icon={ClockIcon} label="History" />
            <NavItem
              to="/notifications"
              icon={BellIcon}
              label="Notifications"
              badge="5"
            />
            <NavItem to="/payments" icon={CreditCardIcon} label="Payments" />
          </Section>

          <Section title="SUPPORT">
            <NavItem
              to="/feedback"
              icon={ChatBubbleLeftIcon}
              label="Feedback"
            />
            <NavItem to="/settings" icon={Cog6ToothIcon} label="Settings" />
          </Section>
        </nav>

        {/* Profile */}
        <SidebarProfile />
      </aside>

      {/* Mobile open button */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow"
        >
          <HomeIcon className="w-6 h-6" />
        </button>
      )}
    </>
  );
}

/* ---------------- Section ---------------- */
function Section({ title, children }) {
  return (
    <div>
      <p className="mb-2 px-3 text-xs font-semibold tracking-widest text-gray-400">
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

/* ---------------- Nav Item ---------------- */
function NavItem({ icon: Icon, label, to, badge }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        group flex items-center gap-3 px-3 py-2 rounded-lg transition
        ${
          isActive
            ? "bg-green-600 text-white"
            : "text-black hover:bg-green-600 hover:text-white"
        }
        `
      }
    >
      <Icon className="w-5 h-5 group-hover:text-white" />
      <span className="flex-1 text-sm font-medium">{label}</span>

      {badge && (
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

/* ---------------- Profile ---------------- */
function SidebarProfile() {
  return (
    <div className="border-t p-4">
      <NavLink
        to="/profile"
        className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-green-600 hover:text-white transition"
      >
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold">John Doe</p>
            <p className="text-xs opacity-80">johndoe@example.com</p>
          </div>
        </div>
        <ArrowRightIcon className="w-4 h-4" />
      </NavLink>
    </div>
  );
}