import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import {
  FaCampground,
  FaCheckCircle,
  FaClock,
  FaBan,
} from "react-icons/fa";

import Sidebar from "../sidebar/Sidebar";
import UserHeader from "./UserHeader";

/* ------------------ Animations ------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ------------------ STATS ------------------ */
const stats = [
  {
    title: "Total Users",
    value: 248,
    color: "text-blue-600",
    icon: <FaCampground className="text-blue-600 text-xl md:text-2xl" />,
    bgColor: "bg-blue-100",
  },
  {
    title: "Active Users",
    value: 231,
    color: "text-green-600",
    icon: <FaCheckCircle className="text-green-600 text-xl md:text-2xl" />,
    bgColor: "bg-green-100",
  },
  {
    title: "Pending",
    value: 12,
    color: "text-orange-500",
    icon: <FaClock className="text-orange-500 text-xl md:text-2xl" />,
    bgColor: "bg-orange-100",
  },
  {
    title: "Banned",
    value: 5,
    color: "text-red-500",
    icon: <FaBan className="text-red-500 text-xl md:text-2xl" />,
    bgColor: "bg-red-100",
  },
];

/* ------------------ USERS DATA ------------------ */
const users = [
  {
    id: "U001",
    name: "John Doe",
    email: "john.doe@example.com",
    verified: true,
    type: "Regular",
    status: "Active",
    bookings: "12 / 25",
    spent: "$1,245.00",
    joined: "May 15, 2023",
  },
];

export default function UserManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 w-full">
        <UserHeader setSidebarOpen={setSidebarOpen} />

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
                  <p className="text-gray-500 text-xs sm:text-sm">{s.title}</p>
                  <h2 className={`text-lg sm:text-2xl font-bold ${s.color}`}>
                    {s.value}
                  </h2>
                </div>
                <div className={`${s.bgColor} p-2 sm:p-3 rounded-xl`}>
                  {s.icon}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ---------------- FILTERS ---------------- */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white p-4 rounded-xl shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6"
          >
            <input
              placeholder="Search users..."
              className="border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-600 outline-none"
            />
            <select className="border rounded-lg px-4 py-2 text-sm">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Banned</option>
            </select>
            <select className="border rounded-lg px-4 py-2 text-sm">
              <option>All Types</option>
              <option>Regular</option>
              <option>Premium</option>
            </select>
            <select className="border rounded-lg px-4 py-2 text-sm">
              <option>Sort by: Recent</option>
              <option>Name A-Z</option>
              <option>Highest Spending</option>
            </select>
          </motion.div>

          {/* ---------------- USERS TABLE (DESKTOP) ---------------- */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="hidden md:block bg-white rounded-xl shadow-sm overflow-x-auto"
          >
            <table className="min-w-[1000px] w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="p-4">User</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Bookings</th>
                  <th>Spent</th>
                  <th>Joined</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-400">ID: #{user.id}</p>
                    </td>

                    <td>
                      <p>{user.email}</p>
                      {user.verified && (
                        <span className="text-xs text-green-600">Verified</span>
                      )}
                    </td>

                    <td>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {user.type}
                      </span>
                    </td>

                    <td>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        {user.status}
                      </span>
                    </td>

                    <td>{user.bookings}</td>
                    <td className="font-semibold">{user.spent}</td>
                    <td className="text-gray-600">{user.joined}</td>

                    <td className="flex justify-center gap-4 text-lg p-4">
                      <FiEye className="text-blue-500 cursor-pointer hover:scale-110 transition" />
                      <FiEdit className="text-green-600 cursor-pointer hover:scale-110 transition" />
                      <FiTrash2 className="text-red-500 cursor-pointer hover:scale-110 transition" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* ---------------- USERS CARDS (MOBILE) ---------------- */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="md:hidden space-y-4"
          >
            {users.map((user) => (
              <motion.div
                key={user.id}
                variants={fadeUp}
                whileTap={{ scale: 0.97 }}
                className="bg-white p-4 rounded-xl shadow-sm"
              >
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-gray-400">ID: #{user.id}</p>
                <p className="text-sm">{user.email}</p>

                <div className="flex gap-2 mt-2">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                    {user.type}
                  </span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                    {user.status}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600 mt-3">
                  <span>Bookings: {user.bookings}</span>
                  <span className="font-semibold">{user.spent}</span>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Joined: {user.joined}
                </p>

                <div className="flex justify-end gap-5 mt-4 text-lg">
                  <FiEye className="text-blue-500" />
                  <FiEdit className="text-green-600" />
                  <FiTrash2 className="text-red-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
