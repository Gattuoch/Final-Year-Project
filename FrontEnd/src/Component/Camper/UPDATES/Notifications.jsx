import React, { useState } from "react";
import {
  FaCalendarCheck,
  FaCreditCard,
  FaExclamationTriangle,
  FaWrench,
  FaCalendarPlus,
} from "react-icons/fa";
import { BsCheckCircleFill } from "react-icons/bs";
import Sidebar from "../Sidebar/Sidebar";

const notifications = [
  {
    icon: <FaCalendarCheck className="text-blue-500" />,
    title: "Booking #3042 Confirmed",
    desc: "Sarah Jenkins has confirmed their consultation for tomorrow at 2:00 PM.",
    time: "2 min ago",
    unread: true,
    type: "bookings",
  },
  {
    icon: <FaCreditCard className="text-green-400" />,
    title: "Subscription Renewed",
    desc: "Monthly Pro Plan payment of $49.00 was successfully processed.",
    time: "1 hr ago",
    unread: false,
    type: "payments",
  },
  {
    icon: <FaExclamationTriangle className="text-yellow-400" />,
    title: "Schedule Conflict Detected",
    desc: "You have two overlapping sessions on Friday, Jan 14th. Please review.",
    time: "Yesterday",
    unread: true,
    type: "system",
  },
  {
    icon: <FaWrench className="text-gray-400" />,
    title: "Scheduled Maintenance",
    desc: "System will be down for upgrades on Saturday from 2:00 AM to 4:00 AM UTC.",
    time: "Jan 10",
    unread: false,
    type: "system",
  },
  {
    icon: <FaCalendarPlus className="text-blue-500" />,
    title: "New Booking Request",
    desc: "David has requested a discovery call for next Monday.",
    time: "Jan 08",
    unread: true,
    type: "bookings",
  },
];

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeTab);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 lg:p-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Notifications
            </h1>
            <p className="text-gray-500 mt-2">
              Stay updated with your latest activities.
            </p>
          </div>

          <button className="px-5 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
            <BsCheckCircleFill className="text-green-500" />
            Mark all as read
          </button>
        </div>

         {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-3 mb-6 sm:pt-3.5 ">
          <ul className="flex flex-col sm:flex-row gap-3 text-gray-500 sm:space-x-4 overflow-x-auto">
            <li
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "hover:bg-gray-50"
              }`}
            >
              All Notifications
            </li>

            <li
              onClick={() => setActiveTab("unread")}
              className={`px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap ${
                activeTab === "unread"
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "hover:bg-gray-50"
              }`}
            >
              Unread <span className="text-gray-400">({unreadCount})</span>
            </li>

            <li
              onClick={() => setActiveTab("bookings")}
              className={`px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap ${
                activeTab === "bookings"
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "hover:bg-gray-50"
              }`}
            >
              Bookings
            </li>

            <li
              onClick={() => setActiveTab("payments")}
              className={`px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap ${
                activeTab === "payments"
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "hover:bg-gray-50"
              }`}
            >
              Payments
            </li>

            <li
              onClick={() => setActiveTab("system")}
              className={`px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap ${
                activeTab === "system"
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "hover:bg-gray-50"
              }`}
            >
              System
            </li>
          </ul>
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {filteredNotifications.map((n, index) => (
            <div
              key={index}
              className="flex justify-between items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  {n.icon}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">{n.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{n.desc}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-gray-500 text-sm">{n.time}</div>
                {n.unread && (
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2" />
                )}
              </div>
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="text-center text-gray-400 mt-6">
              No notifications found for this category.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
