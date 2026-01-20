import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaClock,
  FaRedo,
  FaReceipt,
  FaCreditCard,
  FaMobileAlt,
  FaPlus,
  FaEllipsisV
} from "react-icons/fa";
import Sidebar from "../Sidebar/Sidebar";

export default function Payments() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPaid: 0,
    pending: 0,
    refunded: 0,
    count: 0
  });

  // ✅ Fetch Real Payment Data (Derived from Bookings)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Using the existing booking endpoint as the source of truth for payments
        const res = await axios.get("http://localhost:5000/api/bookings/my-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const bookings = res.data.data;
          
          // 1. Calculate Stats
          const newStats = bookings.reduce((acc, curr) => {
            acc.count++;
            const amount = curr.totalPrice || 0;
            
            if (curr.paymentStatus === 'paid') {
              acc.totalPaid += amount;
            } else if (curr.paymentStatus === 'unpaid' && curr.status !== 'cancelled') {
              acc.pending += amount;
            } else if (curr.status === 'cancelled') {
              acc.refunded += amount; // Assuming cancelled = refunded for this view
            }
            return acc;
          }, { totalPaid: 0, pending: 0, refunded: 0, count: 0 });

          setStats(newStats);
          setTransactions(bookings); // Store all bookings as transactions
        }
      } catch (err) {
        console.error("Payment fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payments & Wallet</h1>
            <p className="text-gray-500 text-sm mt-1">
              Track your spending and manage payment methods
            </p>
          </div>

          <button
            onClick={() => navigate("/camper-dashboard/campsite-directory")}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-lg shadow-emerald-200"
          >
            <FaPlus size={14} /> New Transaction
          </button>
        </motion.div>

        {/* ================= STATS ROW ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard 
            icon={<FaCheckCircle />} 
            value={`${stats.totalPaid.toLocaleString()} ETB`} 
            label="Total Paid" 
            color="text-emerald-600" 
            bg="bg-emerald-50" 
          />
          <StatCard 
            icon={<FaClock />} 
            value={`${stats.pending.toLocaleString()} ETB`} 
            label="Pending" 
            color="text-amber-500" 
            bg="bg-amber-50" 
          />
          <StatCard 
            icon={<FaRedo />} 
            value={`${stats.refunded.toLocaleString()} ETB`} 
            label="Refunded / Cancelled" 
            color="text-blue-500" 
            bg="bg-blue-50" 
          />
          <StatCard 
            icon={<FaReceipt />} 
            value={stats.count} 
            label="Total Transactions" 
            color="text-purple-500" 
            bg="bg-purple-50" 
          />
        </div>

        {/* ================= CONTENT GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ===== LEFT: Payment Methods ===== */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Payment Methods</h2>
              <button className="text-sm text-emerald-600 font-semibold hover:underline">Manage</button>
            </div>

            {/* Chapa Card (Visual Representation of Telebirr/Local) */}
            <motion.div
              whileHover={{ y: -4 }}
              className="relative rounded-2xl bg-gradient-to-br from-green-700 to-emerald-500 p-6 text-white shadow-xl shadow-emerald-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-emerald-100 text-xs font-medium uppercase tracking-wider">Default Method</p>
                  <h3 className="text-lg font-bold mt-1">Telebirr / Chapa</h3>
                </div>
                <FaMobileAlt className="text-2xl text-emerald-100 opacity-80" />
              </div>

              <div className="mt-8 mb-6">
                <p className="font-mono text-xl tracking-widest opacity-90">
                  +251 ••• ••• 890
                </p>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-emerald-200 uppercase">Account Holder</p>
                  <p className="text-sm font-semibold tracking-wide mt-0.5">Mobile Money</p>
                </div>
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm cursor-pointer hover:bg-white/30 transition">
                  <FaEllipsisV size={14} />
                </div>
              </div>
            </motion.div>

            {/* Generic Card (Placeholder for International) */}
            <motion.div
              whileHover={{ y: -4 }}
              className="relative rounded-2xl bg-white border border-gray-200 p-6 text-gray-800 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Secondary</p>
                  <h3 className="text-lg font-bold mt-1">Credit Card</h3>
                </div>
                <FaCreditCard className="text-2xl text-gray-400" />
              </div>
              <div className="mt-6 mb-2">
                <p className="font-mono text-lg text-gray-500 tracking-widest">
                  •••• •••• •••• 4242
                </p>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>Exp 12/25</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Stripe</span>
              </div>
            </motion.div>
          </div>

          {/* ===== RIGHT: Transaction History ===== */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
              <button className="text-sm text-gray-500 hover:text-gray-900">Filter</button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-400">Loading transactions...</div>
              ) : transactions.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <FaReceipt size={24} />
                  </div>
                  <p className="text-gray-500">No transactions found yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {transactions.map((tx) => (
                    <TransactionRow 
                      key={tx._id} 
                      tx={tx} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const StatCard = ({ icon, value, label, color, bg }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4"
  >
    <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center text-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
    </div>
  </motion.div>
);

const TransactionRow = ({ tx }) => {
  // Determine Status Look
  const isPaid = tx.paymentStatus === 'paid';
  const isCancelled = tx.status === 'cancelled';
  const isPending = !isPaid && !isCancelled;

  let statusText = isPaid ? "Success" : isPending ? "Pending" : "Refunded";
  let statusColor = isPaid ? "text-emerald-600 bg-emerald-50" : isPending ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";
  let icon = isPaid ? <FaCheckCircle /> : isPending ? <FaClock /> : <FaRedo />;

  // Formatting Date
  const dateStr = new Date(tx.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 hover:bg-gray-50 transition flex items-center justify-between group"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${statusColor}`}>
          {icon}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">
            {tx.tentId?.name || tx.campId?.name || "Campsite Booking"}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-2">
            <span>{dateStr}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{tx.paymentOption || "Chapa"}</span>
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className={`font-bold ${isCancelled ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
          -{tx.totalPrice?.toLocaleString()} ETB
        </p>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor}`}>
          {statusText}
        </span>
      </div>
    </motion.div>
  );
};