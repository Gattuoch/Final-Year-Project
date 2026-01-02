import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { FaCampground, FaCheckCircle, FaClock, FaBan } from "react-icons/fa";

import Sidebar from "../sidebar/Sidebar";
import CampHeader from "./CampHeader";

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

const stats = [
  {
    title: "Total Camps",
    value: 248,
    color: "text-blue-600",
    icon: <FaCampground className="text-blue-600 text-xl md:text-2xl" />,
    bgColor: "bg-blue-100",
  },
  {
    title: "Active Camps",
    value: 231,
    color: "text-green-600",
    icon: <FaCheckCircle className="text-green-600 text-xl md:text-2xl" />,
    bgColor: "bg-green-100",
  },
  {
    title: "Pending Review",
    value: 12,
    color: "text-orange-500",
    icon: <FaClock className="text-orange-500 text-xl md:text-2xl" />,
    bgColor: "bg-orange-100",
  },
  {
    title: "Inactive",
    value: 5,
    color: "text-red-500",
    icon: <FaBan className="text-red-500 text-xl md:text-2xl" />,
    bgColor: "bg-red-100",
  },
];

const CampManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 w-full">
        <CampHeader setSidebarOpen={setSidebarOpen} />

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
              placeholder="Search camps..."
              className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <select className="border rounded-lg px-4 py-2 text-sm focus-within:border-green-600">
              <option>All Status</option>
              <option>Active </option>
              <option> Inactive </option>
              <option>Banned</option>
            </select>
            <select className="border rounded-lg px-4 py-2 text-sm focus-within:border-green-400">
              <option value="">All Regions</option>

              <option value="addis-ababa">Addis Ababa</option>
              <option value="oromia">Oromia</option>
              <option value="amhara">Amhara</option>
              <option value="tigray">Tigray</option>
              <option value="afar">Afar</option>
              <option value="somali">Somali</option>
              <option value="sidama">Sidama</option>
              <option value="southern-ethiopia">Southern Ethiopia</option>
              <option value="central-ethiopia">Central Ethiopia</option>
              <option value="benishangul-gumuz">Benishangul-Gumuz</option>
              <option value="gambella">Gambella</option>
            </select>
            <select className="border rounded-lg px-4 py-2 text-sm focus-within:border-green-600">
              <option>Sort by: Recent</option>
              <option>Name:A-Z</option>
              <option>Most active</option>
              <option>Spending</option>
            </select>
          </motion.div>

          {/* ---------------- TABLE (DESKTOP) ---------------- */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="hidden md:block bg-white rounded-xl shadow-sm overflow-x-auto"
          >
            <table className="min-w-[900px] w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="p-4">Camp</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Capacity</th>
                  <th>Rating</th>
                  <th>Revenue</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t hover:bg-gray-50 transition">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
                      alt="camp"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold">Mountain View Camp</p>
                      <p className="text-sm text-gray-400">ID: #C001</p>
                    </div>
                  </td>

                  <td>
                    Simien Mountains
                    <p className="text-sm text-gray-400">North Region</p>
                  </td>

                  <td>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      Active
                    </span>
                  </td>

                  <td>50 / 80</td>
                  <td>⭐ 4.8</td>
                  <td className="font-semibold">$12,450</td>

                  <td className="flex justify-center gap-3 text-xl p-4">
                    <FiEye className="text-blue-500 cursor-pointer hover:scale-110 transition" />
                    <FiEdit className="text-green-600 cursor-pointer hover:scale-110 transition" />
                    <FiTrash2 className="text-red-500 cursor-pointer hover:scale-110 transition" />
                  </td>
                </tr>
              </tbody>
            </table>
          </motion.div>

          {/* ---------------- MOBILE CARDS ---------------- */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="md:hidden space-y-4"
          >
            <motion.div
              variants={fadeUp}
              whileTap={{ scale: 0.97 }}
              className="bg-white p-4 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
                  alt="camp"
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold">Mountain View Camp</p>
                  <p className="text-xs text-gray-400">Simien Mountains</p>
                </div>
              </div>

              <div className="flex justify-between text-sm mb-3">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  Active
                </span>
                <span>⭐ 4.8</span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Capacity: 50 / 80</span>
                <span className="font-semibold">$12,450</span>
              </div>

              <div className="flex justify-end gap-5 mt-4 text-lg">
                <FiEye className="text-blue-500" />
                <FiEdit className="text-green-600" />
                <FiTrash2 className="text-red-500" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CampManagement;
