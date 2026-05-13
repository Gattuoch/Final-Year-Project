import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarCheck,
  FaCreditCard,
  FaExclamationTriangle,
  FaCheckDouble,
  FaTrashAlt,
  FaBell,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { FaUserShield, FaInfoCircle } from "react-icons/fa";

import { useUser } from "../../../context/UserContext";
import api from "../../../services/api";
import Sidebar from "../Sidebar/Sidebar";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // 1. Fetch real notifications from database
        let dbNotifications = [];
        try {
          const notesRes = await api.get("/notifications/my");
          if (notesRes.data.success) {
            dbNotifications = notesRes.data.notifications.map(n => {
              let icon = <FaBell className="text-gray-600" />;
              let color = "bg-gray-100";
              let title = n.subject || "System Notification";
              
              if (n.type === "warning") {
                icon = <FaExclamationTriangle className="text-amber-600" />;
                color = "bg-amber-100";
                title = "Administrative Warning";
              } else if (n.type === "system") {
                icon = <FaInfoCircle className="text-blue-600" />;
                color = "bg-blue-100";
              }

              return {
                id: n._id,
                type: "system", // Map to existing tabs
                title: title,
                desc: n.body,
                time: new Date(n.createdAt).toLocaleDateString(),
                timestamp: new Date(n.createdAt).getTime(),
                unread: !n.read,
                icon,
                color,
              };
            });
          }
        } catch (noteErr) {
          console.error("Error loading DB notifications:", noteErr);
        }

        // 2. Fetch booking-derived notifications
        let bookingNotifications = [];
        try {
          const res = await api.get("/bookings/my-bookings");
          const bookings = res.data?.bookings || [];
          
          bookingNotifications = bookings.map((booking) => {
            const isPaid = booking.paymentStatus === "paid";
            const isConfirmed = booking.status === "confirmed";
            const campName = booking.tentId?.name || booking.campId?.name || "Campsite";

            let type = "bookings";
            let title = "Update on your booking";
            let desc = `Status update for ${campName}`;
            let icon = <FaExclamationTriangle className="text-yellow-600" />;
            let color = "bg-yellow-100";

            if (isPaid && isConfirmed) {
              title = "Booking Confirmed! 🎉";
              desc = `Your stay at ${campName} is confirmed. Get ready for your trip!`;
              icon = <FaCalendarCheck className="text-emerald-600" />;
              color = "bg-emerald-100";
            } else if (!isPaid && booking.status !== "cancelled") {
              type = "payments";
              title = "Payment Pending";
              desc = `Please complete your payment of ${booking.totalPrice?.toLocaleString()} ETB for ${campName}.`;
              icon = <FaCreditCard className="text-blue-600" />;
              color = "bg-blue-100";
            } else if (booking.status === "cancelled") {
              title = "Booking Cancelled";
              desc = `Your reservation at ${campName} has been cancelled.`;
              icon = <FaExclamationTriangle className="text-red-600" />;
              color = "bg-red-100";
            }

            return {
              id: booking._id,
              type,
              title,
              desc,
              time: new Date(booking.updatedAt || booking.createdAt).toLocaleDateString(),
              timestamp: new Date(booking.updatedAt || booking.createdAt).getTime(),
              unread: !isPaid && booking.status !== "cancelled",
              icon,
              color,
            };
          });
        } catch (bookErr) {
          console.error("Error loading bookings:", bookErr);
        }

        // Combine and sort
        const combined = [...dbNotifications, ...bookingNotifications].sort((a, b) => b.timestamp - a.timestamp);
        setNotifications(combined);
      } catch (err) {
        console.error("Critical error loading notifications:", err);
        toast.error("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);
  const filteredNotifications =
    activeTab === "all" ? notifications : notifications.filter((n) => n.type === activeTab);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <Toaster position="top-right" reverseOrder={false} />

      <main className="flex-1 p-4 lg:p-10 overflow-y-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full animate-pulse">
                  {unreadCount} New
                </span>
              )}
            </h1>
            <p className="text-gray-500 mt-2">Stay updated with your latest bookings and activities.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={markAllRead}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition flex items-center gap-2 text-sm font-medium shadow-sm"
            >
              <FaCheckDouble /> Mark all read
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 transition flex items-center gap-2 text-sm font-medium shadow-sm"
            >
              <FaTrashAlt /> Clear
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-8 inline-flex flex-wrap gap-2">
          {["all", "bookings", "payments", "system"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 capitalize ${
                activeTab === tab
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="space-y-4 max-w-4xl">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex gap-4 p-5 bg-white rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((n) => (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ scale: 1.01 }}
                    className={`relative flex flex-col sm:flex-row gap-5 p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      n.unread
                        ? "bg-white border-l-4 border-l-emerald-500 shadow-md border-y-gray-100 border-r-gray-100"
                        : "bg-white/60 border-gray-100 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${n.color}`}>
                      <div className="text-xl">{n.icon}</div>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`text-lg font-bold ${n.unread ? "text-gray-900" : "text-gray-700"}`}>
                          {n.title}
                        </h3>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2 bg-gray-50 px-2 py-1 rounded-lg">
                          {n.time}
                        </span>
                      </div>
                      <p className={`mt-1 text-sm leading-relaxed ${n.unread ? "text-gray-600 font-medium" : "text-gray-500"}`}>
                        {n.desc}
                      </p>

                      {n.type === "payments" && n.unread && (
                        <div className="mt-3">
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition">
                            Pay Now →
                          </span>
                        </div>
                      )}
                    </div>

                    {n.unread && (
                      <div className="absolute top-5 right-5 sm:static sm:flex sm:items-center">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-sm shadow-emerald-200"></div>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FaBell className="text-gray-300 text-3xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
                  <p className="text-gray-500 mt-2 max-w-xs">
                    You have no notifications in the{" "}
                    <span className="font-semibold text-emerald-600 capitalize">{activeTab}</span> category.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}