import React from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaClock,
  FaRedo,
  FaReceipt,
} from "react-icons/fa";
import Sidebar from "../Sidebar/Sidebar";
import { EllipsisVerticalIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Payments() {
  const navigate = useNavigate();

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      {/* ================= MAIN CONTENT ================= */}
      <motion.main
        className="flex-1 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Payments</h1>
            <p className="text-gray-500 text-sm">
              Manage payment methods and transaction history
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium"
            onClick={() =>
              navigate("/camper-dashboard/reservations/new-booking")
            }
          >
            + Add Payment Method
          </motion.button>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Stat icon={<FaCheckCircle />} value="12,450 ETB" label="Total Paid" color="text-emerald-600" />
          <Stat icon={<FaClock />} value="1,200 ETB" label="Pending" color="text-yellow-500" />
          <Stat icon={<FaRedo />} value="450 ETB" label="Refunded" color="text-blue-500" />
          <Stat icon={<FaReceipt />} value="28" label="Transactions" color="text-purple-500" />
        </div>

        {/* ================= CONTENT GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ===== Payment Methods ===== */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Payment Methods</h2>

            {/* VISA CARD */}
            <motion.div
              className="relative rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 text-white"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-80">Primary Card</p>
                  <p className="text-xs opacity-70">Visa Debit</p>
                </div>

                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                  alt="Visa"
                  className="w-12 bg-white p-1 rounded"
                />
              </div>

              <div className="mt-8 tracking-widest text-lg font-medium">
                •••• •••• •••• 4532
              </div>

              <div className="mt-6 flex justify-between text-sm">
                <div>
                  <p className="opacity-70">Card Holder</p>
                  <p className="font-semibold">JOHN DOE</p>
                </div>

                <div>
                  <p className="opacity-70">Expires</p>
                  <p className="font-semibold">12/25</p>
                </div>
              </div>

              <button className="absolute bottom-5 right-5 bg-white/20 p-2 rounded-lg">
                <EllipsisVerticalIcon className="w-5 h-5" />
              </button>
            </motion.div>

            {/* MASTERCARD */}
            <motion.div
              className="rounded-2xl border bg-white p-6 flex justify-between items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex gap-4 items-center">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                    alt="Mastercard"
                    className="w-8"
                  />
                </div>

                <div>
                  <p className="font-semibold">Mastercard Debit</p>
                  <p className="text-sm text-gray-400 tracking-widest">
                    •••• •••• •••• 8765
                  </p>

                  <div className="mt-3 text-sm">
                    <p className="text-gray-500">Card Holder</p>
                    <p className="font-medium text-gray-800">JOHN DOE</p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-400">Expires</p>
                <p className="font-semibold mb-3">03/24</p>

                <div className="flex gap-4 text-sm">
                  <button className="text-emerald-600 font-medium">Edit</button>
                  <button className="text-red-500 font-medium">Remove</button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ===== Recent Transactions ===== */}
          <div>
            <h2 className="font-semibold text-lg mb-6">Recent Transactions</h2>

            <div className="space-y-4">
              <Transaction status="success" title="Payment Successful" date="2024-01-15" amount="1,200 ETB" />
              <Transaction status="pending" title="Payment Pending" date="2024-02-03" amount="1,200 ETB" />
              <Transaction status="refund" title="Refund Processed" date="2024-03-10" amount="450 ETB" />
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const Stat = ({ icon, value, label, color }) => (
  <motion.div
    className="bg-white rounded-xl p-6 flex items-center gap-4"
    whileHover={{ y: -5, scale: 1.03 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className={`text-2xl ${color}`}>{icon}</div>
    <div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  </motion.div>
);

const Transaction = ({ status, title, date, amount }) => {
  const colors = {
    success: "bg-emerald-100 text-emerald-600",
    pending: "bg-yellow-100 text-yellow-600",
    refund: "bg-red-100 text-red-600",
  };

  return (
    <motion.div
      className="bg-white rounded-xl p-4 flex justify-between items-center"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex gap-3 items-center">
        <div className={`p-2 rounded-full ${colors[status]}`}>●</div>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-xs text-gray-400">{date}</p>
        </div>
      </div>

      <p
        className={`font-bold ${
          status === "refund" ? "text-red-600" : "text-emerald-600"
        }`}
      >
        {amount}
      </p>
    </motion.div>
  );
};
