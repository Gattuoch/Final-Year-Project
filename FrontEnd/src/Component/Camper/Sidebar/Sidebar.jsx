import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
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
  GlobeAltIcon // Added for the website button
} from "@heroicons/react/24/outline";
import logoIcon from "../../../assets/logo-icon.png";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [counts, setCounts] = useState({ trips: 0, notifications: 0 });
  const navigate = useNavigate();

  const closeSidebar = () => setIsOpen(false);

  // ✅ 1. DYNAMIC DATA FETCHING
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Fetch bookings to calculate badges
        const res = await axios.get("http://localhost:5000/api/bookings/my-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const bookings = res.data.data;
          
          // Count Active Trips (Confirmed & Future/Current)
          const today = new Date();
          const activeTrips = bookings.filter(b => 
            b.status === 'confirmed' && new Date(b.checkOut) >= today
          ).length;

          // Count Notifications (Unpaid)
          const unpaid = bookings.filter(b => b.paymentStatus === 'unpaid').length;

          setCounts({ trips: activeTrips, notifications: unpaid });
        }
      } catch (err) {
        console.error("Sidebar stats error:", err);
      }
    };

    fetchCounts();
  }, []);

  // ✅ 2. LOGOUT FUNCTION
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

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
              badge={counts.trips > 0 ? counts.trips : null} // Dynamic Badge
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
              label="Payments"
              onClick={closeSidebar}
            />
          </Section>

          {/* UPDATES */}
          <Section title="UPDATES">
            <NavItem
              to="/camper-dashboard/notifications"
              icon={BellIcon}
              label="Notifications"
              badge={counts.notifications > 0 ? counts.notifications : null} // Dynamic Badge
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

        {/* ================= Bottom Actions (Pinned) ================= */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-2">
          
          {/* Back to Website Button */}
          <button
            onClick={() => window.location.href = "/"}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 hover:bg-white hover:text-green-700 hover:shadow-sm transition-all duration-200 text-sm font-medium"
          >
            <GlobeAltIcon className="w-5 h-5" />
            Back to Home
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 hover:shadow-sm transition-all duration-200 text-sm font-medium"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </div>

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
        <span className="bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full px-1.5">
          {badge}
        </span>
      )}
    </NavLink>
  );
}