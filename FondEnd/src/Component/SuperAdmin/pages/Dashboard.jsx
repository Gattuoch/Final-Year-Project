import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaCampground,
  FaMapMarkedAlt,
  FaCalendarCheck,
  FaTicketAlt,
  FaUsers,
  FaDollarSign,
  FaHeartbeat,
} from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";


import Sidebar from "../sidebar/Sidebar";
import Header from "../../SuperAdmin/header/Header.jsx";
import RevenueChart from "../../SuperAdmin/charts/RevenueChart.jsx";
import VisitorChart from "../../SuperAdmin/charts/VisitorChart.jsx";
import BookingActivityChart from "../charts/BookingActivityChart.jsx";
import RefundSummaryChart from "../charts/RefundSummaryChart.jsx";

/* ------------------ Animations ------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

/* ------------------ Stats ------------------ */
const stats = [
  {
    title: "Total Camps",
    value: "248",
    change: "+12% this month",
    color: "black",
    icon: <FaCampground className="text-blue-600 text-xl md:text-2xl" />,
    bgColor: "bg-blue-100",
  },
  {
    title: "Event Venues",
    value: "156",
    change: "+8% this month",
    color: "black",
    icon: <FaCalendarAlt className="text-pink-500 text-xl md:text-2xl" />,
    bgColor: "bg-pink-100",
  },
  {
    title: "Total Bookings",
    value: "12,847",
    change: "+24% this month",
    color: "black",
    icon: <FaTicketAlt className="text-green-600 text-xl md:text-2xl" />,
    bgColor: "bg-green-100",
  },
  {
    title: "Tickets Sold",
    value: "45,692",
    change: "+18% this month",
    color: "black",
    icon: <FaClipboardList className="text-orange-600 text-xl md:text-2xl" />,
    bgColor: "bg-orange-100",
  },
  {
    title: "Visitors Today",
    value: "2,847",
    color: "black",
    icon: <FaUsers className="text-purple-600 text-xl md:text-2xl" />,
    bgColor: "bg-purple-100",
  },
  {
    title: "Total Earnings",
    value: "$847,329",
    color: "black",
    icon: <FaDollarSign className="text-emerald-600 text-xl md:text-2xl" />,
    bgColor: "bg-emerald-100",
  },
  {
    title: "Active Users",
    value: "1,247",
    color: "black",
    icon: <FaCircle className="text-green-600 text-xl md:text-2xl" />,
    bgColor: "bg-blue-100",
  },
  {
    title: "System Health",
    value: "Excellent",
    color: "black",
    icon: <FaHeartbeat className="text-green-700 text-xl md:text-2xl" />,
    bgColor: "bg-green-100",
  },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 w-full">
        <Header setSidebarOpen={setSidebarOpen} />

        <div className="p-3 sm:p-4 md:p-6">
          {/* ---------------- STATS ---------------- */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6"
          >
            {stats.map((s) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
              >
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    {s.title}
                  </p>

                  <h2 className={`text-lg sm:text-2xl font-bold ${s.color}`}>
                    {s.value}
                  </h2>

                  {s.change && (
                    <p className="text-xs sm:text-sm text-green-600 mt-1">
                      {s.change}
                    </p>
                  )}
                </div>

                <div className={`${s.bgColor} p-2 sm:p-3 rounded-xl`}>
                  {s.icon}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ---------------- CHARTS ---------------- */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Revenue Overview
              </h3>
              <RevenueChart />
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Visitors Analytics
              </h3>
              <VisitorChart />
            </motion.div>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10 px-6 ">
  <BookingActivityChart />
  <RefundSummaryChart />
</div>

      </main>
    </div>
    
  );
}
