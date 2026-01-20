// Dashboard.js
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCampground,
  FaTicketAlt,
  FaUsers,
  FaDollarSign,
  FaHeartbeat,
  FaClipboardList,
  FaCalendarAlt,
  FaCircle,
  FaTimes,
  FaSearch
} from "react-icons/fa";

import Sidebar from "../sidebar/Sidebar";
import Header from "../../SuperAdmin/header/Header.jsx";
import RevenueChart from "../../SuperAdmin/charts/RevenueChart.jsx";
import VisitorChart from "../../SuperAdmin/charts/VisitorChart.jsx";
import BookingActivityChart from "../charts/BookingActivityChart.jsx";
import RefundSummaryChart from "../charts/RefundSummaryChart.jsx";

import API, { fetchDashboardStats } from "../services/api.js";

/* ------------------ Animations ------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedCard, setSelectedCard] = useState(null);
  const [detailsData, setDetailsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingDetails, setLoadingDetails] = useState(false);

  /* ------------------ Load Dashboard Stats ------------------ */
  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await fetchDashboardStats();
        setStats(data);
        if (data?.message) {
            // Optional: toast.success(data.message);
        }
      } catch (err) {
        console.error("Dashboard stats error", err);
        toast.error("Failed to load dashboard data.");
        setStats({}); // Fallback
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedCard(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-500">
        <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  /* ------------------ Card Config ------------------ */
  const cards = [
    {
      title: "Total Camps",
      value: stats?.totalCamps || 0,
      icon: <FaCampground className="text-blue-600 text-2xl" />,
      bg: "bg-blue-100",
      type: "camps",
    },
    {
      title: "Event Venues",
      value: stats?.totalVenues || 0,
      icon: <FaCalendarAlt className="text-pink-600 text-2xl" />,
      bg: "bg-pink-100",
      type: "venues",
    },
    {
      title: "Total Bookings",
      value: stats?.totalBookings || 0,
      icon: <FaTicketAlt className="text-green-600 text-2xl" />,
      bg: "bg-green-100",
      type: "bookings",
    },
    {
      title: "Tickets Sold",
      value: stats?.ticketsSold || 0,
      icon: <FaClipboardList className="text-orange-600 text-2xl" />,
      bg: "bg-orange-100",
      type: "tickets",
    },
    {
      title: "Visitors Today",
      value: stats?.todayVisitors || 0,
      icon: <FaUsers className="text-purple-600 text-2xl" />,
      bg: "bg-purple-100",
      type: "visitors",
    },
    {
      title: "Total Earnings",
      value: `ETB ${Number(stats?.totalEarnings || 0).toLocaleString()}`,
      icon: <FaDollarSign className="text-emerald-600 text-2xl" />,
      bg: "bg-emerald-100",
      type: "earnings",
    },
    {
      title: "Active Users",
      value: stats?.activeUsers || 0,
      icon: <FaCircle className="text-green-600 text-2xl" />,
      bg: "bg-blue-100",
      type: "users",
    },
    {
      title: "System Health",
      value: stats?.systemHealth || "Good",
      icon: <FaHeartbeat className="text-green-700 text-2xl" />,
      bg: "bg-green-100",
      type: "system",
    },
  ];

  /* ------------------ Helpers ------------------ */
  const formatStatValue = (v) => {
    if (v === null || v === undefined) return "-";
    if (typeof v === "number") return v.toLocaleString();
    return v;
  };

  const formatDetailValue = (val) => {
    if (val === null || val === undefined) return "-";
    if (Array.isArray(val)) return val.length ? `Array(${val.length})` : "-";
    
    if (typeof val === "object") {
      // Smart object formatting
      if (val.name) return val.name;
      if (val.title) return val.title;
      if (val.fullName) return val.fullName;
      if (val.email) return val.email;
      if (val._id) return val._id.substring(0, 8) + "...";
      return "{...}";
    }
    return String(val);
  };

  /* ------------------ Fetch Details ------------------ */
  const fetchDetails = async (type) => {
    setSelectedCard(type);
    setLoadingDetails(true);
    setSearchTerm(""); // Reset search

    try {
      let res;
      let data = [];

      switch (type) {
        case "Total Camps":
          res = await API.get("/campHomeRoutes", { params: { limit: 50 } });
          data = res.data.camps || res.data.data || [];
          break;

        case "Event Venues":
          res = await API.get("/eventvenues").catch(() => null);
          data = (res?.data?.eventVenues || res?.data?.data) || [];
          break;

        case "Total Bookings":
          res = await API.get("/usersuperadmindashboard/bookings", { params: { limit: 50, sort: "-createdAt" } });
          data = res.data || [];
          break;

        case "Tickets Sold":
          res = await API.get("/usersuperadmindashboard/bookings", { params: { limit: 50, sort: "-createdAt" } });
          // Flatten booking data to show ticket info
          data = (res.data || []).map(b => ({
            bookingId: b.bookingId || b._id,
            user: b.visitor || b.email,
            tickets: b.tickets || 1,
            amount: b.amount,
            date: b.time || b.createdAt
          }));
          break;

        case "Visitors Today":
          res = await API.get("/usersuperadmindashboard/visitors", { params: { limit: 100, today: "true" } });
          data = (res.data || []).map(v => ({
             visitor: v.visitor || v.fullName || "Guest",
             bookingId: v.bookingId,
             tickets: v.tickets,
             amount: v.amount,
             time: v.time ? new Date(v.time).toLocaleTimeString() : "-"
          }));
          break;

        case "Total Earnings":
          res = await API.get("/usersuperadmindashboard/bookings", { params: { limit: 50, sort: "-createdAt", status: "confirmed" } });
          data = (res.data || []).map(b => ({
            id: b.bookingId,
            payer: b.visitor,
            amount: b.amount,
            method: b.paymentMethod || "Online",
            date: b.time
          }));
          break;

        case "Active Users":
          res = await API.get("/usersuperadmindashboard/users", { params: { status: "active", limit: 50 } });
          data = res.data.users || res.data.data || [];
          break;

        case "System Health":
          // Mock or real system log data
          data = [
            { check: "Database", status: "Connected", latency: "12ms" },
            { check: "API Server", status: "Online", uptime: "99.9%" },
            { check: "Payment Gateway", status: "Operational", pending: 0 }
          ];
          break;

        default:
          data = [];
      }
      setDetailsData(Array.isArray(data) ? data : [data]);

    } catch (err) {
      console.error("Failed to fetch details", err);
      toast.error(`Could not load details for ${type}`);
      setDetailsData([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Filter data based on search
  const filteredDetails = detailsData.filter(item => 
    JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden font-sans">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 w-full relative">
        <Header setSidebarOpen={setSidebarOpen} />

        <div className="p-4 md:p-6 lg:p-8 overflow-y-auto h-[calc(100vh-64px)]">
          
          {/* STATS GRID */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
          >
            {cards.map((c) => (
              <motion.div
                key={c.title}
                variants={fadeUp}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between gap-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
                onClick={() => fetchDetails(c.title)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3.5 rounded-xl ${c.bg} bg-opacity-50 group-hover:bg-opacity-80 transition-colors`}>
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{c.title}</p>
                    <h2 className="text-2xl font-bold text-gray-800 mt-1">{formatStatValue(c.value)}</h2>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CHARTS SECTION */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Trends</h3>
              <RevenueChart />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Visitor Analytics</h3>
              <VisitorChart />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
             <BookingActivityChart />
             <RefundSummaryChart />
          </div>
        </div>

        {/* ------------------ DETAILS MODAL ------------------ */}
        <AnimatePresence>
          {selectedCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedCard(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="bg-white rounded-2xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {cards.find(x => x.title === selectedCard)?.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{selectedCard} Details</h3>
                      <p className="text-xs text-gray-500">
                        Showing {filteredDetails.length} record{filteredDetails.length !== 1 && 's'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative hidden sm:block">
                      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                      <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
                      />
                    </div>
                    <button 
                      onClick={() => setSelectedCard(null)}
                      className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-auto p-0">
                  {loadingDetails ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                      <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-2"></div>
                      <p className="text-sm">Fetching data...</p>
                    </div>
                  ) : filteredDetails.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                      <p>No records found.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                        <tr>
                          {Object.keys(filteredDetails[0] || {}).map((key) => (
                            <th key={key} className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredDetails.map((item, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                            {Object.values(item).map((val, i) => (
                              <td key={i} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                {formatDetailValue(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                
                {/* Modal Footer (Optional) */}
                <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-right">
                  <span className="text-xs text-gray-400">Press ESC to close</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}