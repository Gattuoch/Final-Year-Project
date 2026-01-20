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
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6  top-0">
        <DashboardHeader />

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<FaTicketAlt />} title="Active Tickets" value="24" change="+12%" color="blue" />
          <StatCard icon={<FaCalendarCheck />} title="Upcoming Bookings" value="8" change="+8%" color="purple" />
          <StatCard icon={<FaWallet />} title="Wallet Balance" value="$245.00" change="0%" color="green" />
          <StatCard icon={<FaStar />} title="Reward Points" value="156" change="+15%" color="orange" />
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <ActionCard title="Buy Day Ticket" subtitle="Entoto Park Visit" icon={<FaTicketAlt />} primary />
          <ActionCard title="Book Hotel" subtitle="Find accommodation" icon={<FaHotel />} />
          <ActionCard title="Book Event" subtitle="Reserve venue" icon={<FaCalendarPlus />} />
          <ActionCard title="Explore" subtitle="Search facilities" icon={<FaSearch />} />
        </div>

        {/* ================= BOOKINGS + NOTIFICATIONS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* BOOKINGS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg cursor-pointer"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
              <button className="text-green-600 font-medium hover:underline">View All</button>
            </div>

            <BookingCard
              image="https://images.unsplash.com/photo-1505691938895-1758d7feb511"
              title="Mountain View Suite"
              place="Entoto Grand Hotel"
              date="Dec 15–18, 2024"
              meta="2 Guests"
              price="$380"
              status="Confirmed"
            />

            <BookingCard
              image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
              title="Garden Event Space"
              place="Entoto Event Center"
              date="Dec 22, 2024"
              meta="2:00 PM - 8:00 PM"
              price="$650"
              status="Pending"
            />

            <BookingCard
              image="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
              title="Forest Camping Site"
              place="Entoto Nature Camp"
              date="Jan 5–7, 2025"
              meta="4 Guests"
              price="$120"
              status="Confirmed"
            />
          </motion.div>

          {/* NOTIFICATIONS */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Notifications</h2>
              <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-full">5 New</span>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px]">
              <NotificationItem
                icon={<FaCheck />}
                title="Booking Confirmed"
                text="Your Mountain View Suite reservation is confirmed"
                time="2 hours ago"
                color="green"
              />

              <NotificationItem
                icon={<FaTicketAlt />}
                title="Ticket Generated"
                text="Day visit ticket for Dec 12 is ready"
                time="5 hours ago"
                color="blue"
              />

              <NotificationItem
                icon={<FaClock />}
                title="Payment Reminder"
                text="Complete payment for Garden Event Space"
                time="1 day ago"
                color="yellow"
              />

              <NotificationItem
                icon={<FaGift />}
                title="Reward Points"
                text="You earned 25 points from your last visit"
                time="2 days ago"
                color="purple"
              />

              <NotificationItem
                icon={<FaExclamationTriangle />}
                title="Weather Alert"
                text="Rain expected at Entoto on Dec 15"
                time="3 days ago"
                color="red"
              />
            </div>

            <h1 className="text-center text-green-800 mt-4 cursor-pointer hover:underline">
              View All Notifications
            </h1>
          </motion.div>
        </div>

        {/* ================= RECENT TICKETS + PROMO ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          {/* RECENT TICKETS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 bg-white/10 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Tickets</h2>
              <button className="text-green-600 font-medium hover:underline">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TicketCard status="Active" statusColor="green" title="Day Visit - Adult" place="Entoto Natural Park" date="Dec 12, 2024" price="$15.00" />
              <TicketCard status="Used" statusColor="gray" title="Day Visit - Adult" place="Entoto Natural Park" date="Nov 28, 2024" price="$15.00" />
              <TicketCard status="Active" statusColor="green" title="Day Visit - Child" place="Entoto Natural Park" date="Dec 12, 2024" price="$8.00" />
              <TicketCard status="Refund" statusColor="yellow" title="Day Visit - Adult" place="Entoto Natural Park" date="Nov 20, 2024" price="$15.00" />
            </div>
          </motion.div>

          {/* GREEN PROMO PANEL */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 h-full"
          />
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
    transition={{ type: "spring", stiffness: 300 }}
    className="bg-white p-6 rounded-2xl shadow flex justify-between items-center cursor-pointer"
  >
    <div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorMap[color]}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold">{value}</h3>
      <p className="text-gray-500">{title}</p>
    </div>
    <span className="bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full">
      {change}
    </span>
  </motion.div>
);

/* ---- Action Card ---- */
const ActionCard = ({ title, subtitle, icon, primary }) => (
  <motion.div
    whileHover={{ y: -6, scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: "spring", stiffness: 300 }}
    className={`rounded-2xl p-6 cursor-pointer shadow-lg ${
      primary ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white" : "bg-white"
    }`}
  >
    <div
      className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-2xl ${
        primary ? "bg-white/20" : "bg-purple-100 text-purple-600"
      }`}
    >
      {icon}
    </div>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className={`text-sm ${primary ? "text-white/80" : "text-gray-500"}`}>
      {subtitle}
    </p>
  </motion.div>
);

/* ---- Booking Card ---- */
const BookingCard = ({ image, title, place, date, meta, price, status }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 rounded-xl p-4 mb-4 shadow-sm hover:shadow-md"
  >
    <div className="flex gap-4">
      <img src={image} alt={title} className="w-24 h-20 rounded-lg object-cover" />
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{title}</h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {status}
          </span>
        </div>
        <p className="text-gray-500">{place}</p>
        <p className="text-sm text-gray-500">{date} · {meta}</p>
      </div>
    </div>

    <div className="text-right mt-3 sm:mt-0">
      <p className="text-xl font-bold">{price}</p>
      <button className="text-green-600 font-medium hover:underline">View Details</button>
    </div>
  </motion.div>
);

/* ---- Notification Item ---- */
const NotificationItem = ({ icon, title, text, time, color }) => (
  <motion.div
    whileHover={{ x: 5 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="flex gap-4 py-4 last:border-none cursor-pointer hover:bg-gray-50 rounded-lg px-2"
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-gray-500">{text}</p>
      <p className="text-xs text-gray-400">{time}</p>
    </div>
  </motion.div>
);

/* ---- Ticket Card ---- */
const statusStyles = {
  green: "bg-green-100 text-green-700",
  gray: "bg-gray-100 text-gray-600",
  yellow: "bg-yellow-100 text-yellow-700",
};

const TicketCard = ({ status, statusColor, title, place, date, price }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="rounded-xl p-6 sm:p-8 bg-white shadow-sm hover:shadow-md cursor-pointer"
  >
    <div className="flex justify-between items-start mb-4">
      <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusStyles[statusColor]}`}>
        {status}
      </span>
      <FaQrcode className="text-gray-400 text-xl" />
    </div>

    <h3 className="font-semibold text-lg mb-1">{title}</h3>
    <p className="text-gray-500 mb-3">{place}</p>

    <div className="flex justify-between items-center text-sm text-gray-500">
      <div className="flex items-center gap-2">
        <FaCalendarAlt />
        <span>{date}</span>
      </div>
      <span className="font-semibold text-gray-900">{price}</span>
    </div>
  </motion.div>
);
