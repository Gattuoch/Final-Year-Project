import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaTicketAlt,
  FaCalendarCheck,
  FaWallet,
  FaStar,
  FaHotel,
  FaCalendarPlus,
  FaSearch,
  FaClock,
  FaGift,
  FaExclamationTriangle,
  FaCheck,
  FaQrcode,
  FaCalendarAlt,
} from "react-icons/fa";

import Sidebar from "../Sidebar/Sidebar";
import DashboardHeader from "./DashboardHeader";

/* ================= MAIN DASHBOARD ================= */
export default function CamperDashboard() {
  const [stats, setStats] = useState({
    active: 0,
    upcoming: 0,
    wallet: 0, // Placeholder if no wallet backend
    points: 0  // Placeholder (Trust Score)
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Real Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : {};

        // 1. Fetch Bookings
        const res = await axios.get("http://localhost:5000/api/bookings/my-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const bookings = res.data.data;
          const today = new Date();

          // Calculate Stats
          const activeCount = bookings.filter(b => b.status === "confirmed" && new Date(b.checkIn) <= today && new Date(b.checkOut) >= today).length;
          const upcomingCount = bookings.filter(b => b.status === "confirmed" && new Date(b.checkIn) > today).length;

          setStats({
            active: activeCount,
            upcoming: upcomingCount,
            wallet: "0.00", // Dynamic if you implement wallet later
            points: user.trustScore || 0,
          });

          // Get 3 most recent bookings
          setRecentBookings(bookings.slice(0, 3));
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <DashboardHeader />

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 mt-6">
          <StatCard icon={<FaTicketAlt />} title="Active Trips" value={stats.active} change="Current" color="blue" />
          <StatCard icon={<FaCalendarCheck />} title="Upcoming Bookings" value={stats.upcoming} change="Planned" color="purple" />
          <StatCard icon={<FaWallet />} title="Wallet Balance" value={`ETB ${stats.wallet}`} change="+0%" color="green" />
          <StatCard icon={<FaStar />} title="Trust Score" value={stats.points} change="Level 1" color="orange" />
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <ActionCard title="Book Campsite" subtitle="Browse locations" icon={<FaSearch />} primary link="/camper-dashboard/campsite-directory" />
          <ActionCard title="My Reservations" subtitle="View details" icon={<FaCalendarPlus />} link="/camper-dashboard/reservations" />
          <ActionCard title="Support" subtitle="Get help" icon={<FaExclamationTriangle />} />
          <ActionCard title="Profile" subtitle="Edit settings" icon={<FaHotel />} />
        </div>

        {/* ================= BOOKINGS + NOTIFICATIONS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* RECENT BOOKINGS (Dynamic) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Bookings</h2>
              <a href="/camper-dashboard/reservations" className="text-green-600 font-medium hover:underline">View All</a>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading bookings...</p>
            ) : recentBookings.length > 0 ? (
              recentBookings.map((b) => (
                <BookingCard
                  key={b._id}
                  image={b.tentId?.images?.[0] || b.campId?.images?.[0] || "https://via.placeholder.com/150"}
                  title={b.tentId?.name || "Campsite Booking"}
                  place={b.campId?.location?.address || "Ethiopia"}
                  date={`${new Date(b.checkIn).toLocaleDateString()} - ${new Date(b.checkOut).toLocaleDateString()}`}
                  meta={`${b.guests} Guests`}
                  price={`${b.totalPrice} ETB`}
                  status={b.paymentStatus === 'paid' ? "Confirmed" : "Pending"}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                No recent bookings found. Start your adventure!
              </div>
            )}
          </motion.div>

          {/* NOTIFICATIONS (Static for now, can be dynamic later) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Notifications</h2>
              <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-full">New</span>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px]">
              <NotificationItem
                icon={<FaCheck />}
                title="System Welcome"
                text="Welcome to EthioCamps! Start exploring today."
                time="Just now"
                color="green"
              />
              <NotificationItem
                icon={<FaTicketAlt />}
                title="Booking Tips"
                text="Check out the new Simien Mountains spots."
                time="1 hour ago"
                color="blue"
              />
              <NotificationItem
                icon={<FaGift />}
                title="Reward Points"
                text="Complete a stay to earn trust points."
                time="2 days ago"
                color="purple"
              />
            </div>
          </motion.div>
        </div>

      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const colorMap = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
  red: "bg-red-100 text-red-600",
  yellow: "bg-yellow-100 text-yellow-600",
};

/* ---- Stat Card ---- */
const StatCard = ({ icon, title, value, change, color }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer"
  >
    <div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorMap[color]}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-gray-500 text-sm">{title}</p>
    </div>
    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
      {change}
    </span>
  </motion.div>
);

/* ---- Action Card ---- */
const ActionCard = ({ title, subtitle, icon, primary, link }) => (
  <a href={link || "#"}>
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`rounded-2xl p-6 cursor-pointer shadow-md h-full ${
        primary ? "bg-gradient-to-br from-green-700 to-green-600 text-white" : "bg-white text-gray-800 border border-gray-100"
      }`}
    >
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-2xl ${
          primary ? "bg-white/20" : "bg-green-50 text-green-600"
        }`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className={`text-sm ${primary ? "text-white/80" : "text-gray-500"}`}>
        {subtitle}
      </p>
    </motion.div>
  </a>
);

/* ---- Booking Card (Dynamic) ---- */
const BookingCard = ({ image, title, place, date, meta, price, status }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100 transition-all"
  >
    <div className="flex gap-4 items-center w-full sm:w-auto">
      <img src={image} alt={title} className="w-20 h-20 rounded-lg object-cover bg-gray-200" />
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {status}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-0.5">{place}</p>
        <p className="text-xs text-gray-400 mt-1">{date} · {meta}</p>
      </div>
    </div>

    <div className="text-right mt-3 sm:mt-0 w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:items-end">
      <p className="text-lg font-bold text-green-700">{price}</p>
      <a href="/camper-dashboard/reservations" className="text-sm text-gray-500 hover:text-green-600 underline decoration-gray-300 hover:decoration-green-600">Details</a>
    </div>
  </motion.div>
);

/* ---- Notification Item ---- */
const NotificationItem = ({ icon, title, text, time, color }) => (
  <div className="flex gap-4 py-3 border-b border-gray-50 last:border-none hover:bg-gray-50 rounded-lg px-2 transition">
    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${colorMap[color]}`}>
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
      <p className="text-xs text-gray-500 leading-relaxed">{text}</p>
      <p className="text-[10px] text-gray-400 mt-1">{time}</p>
    </div>
  </div>
);