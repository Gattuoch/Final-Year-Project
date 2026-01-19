// Dashboard.js
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaCampground,
  FaTicketAlt,
  FaUsers,
  FaDollarSign,
  FaHeartbeat,
  FaClipboardList,
  FaCalendarAlt,
  FaCircle,
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
  const [loadingDetails, setLoadingDetails] = useState(false);

  /* ------------------ Load Dashboard Stats ------------------ */
  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await fetchDashboardStats();
        setStats(data);
        // Show a success toast when dashboard stats load
        try {
          const msg = data?.message || "Dashboard data loaded successfully";
          toast.success(msg);
        } catch (e) {
          console.debug("Toast error", e);
        }
      } catch (err) {
        console.error("Dashboard stats error", err);
        toast.error("Failed to load dashboard stats. You may need to login again.");
        // ensure stats is at least an empty object to avoid runtime errors
        setStats({});
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading dashboard...</div>;
  }

  /* ------------------ Card Config ------------------ */
  const cards = [
    {
      title: "Total Camps",
      value: stats.totalCamps,
      icon: <FaCampground className="text-blue-600 text-2xl" />,
      bg: "bg-blue-100",
      type: "camps",
    },
    {
      title: "Event Venues",
      value: stats.totalVenues,
      icon: <FaCalendarAlt className="text-pink-600 text-2xl" />,
      bg: "bg-pink-100",
      type: "venues",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: <FaTicketAlt className="text-green-600 text-2xl" />,
      bg: "bg-green-100",
      type: "bookings",
    },
    {
      title: "Tickets Sold",
      value: stats.ticketsSold,
      icon: <FaClipboardList className="text-orange-600 text-2xl" />,
      bg: "bg-orange-100",
      type: "tickets",
    },
    {
      title: "Visitors Today",
      value: stats.todayVisitors,
      icon: <FaUsers className="text-purple-600 text-2xl" />,
      bg: "bg-purple-100",
      type: "visitors",
    },
    {
      title: "Total Earnings",
      // show earnings in Ethiopian Birr (ETB)
      value: `ETB ${Number(stats.totalEarnings || 0).toLocaleString()}`,
      icon: <FaDollarSign className="text-emerald-600 text-2xl" />,
      bg: "bg-emerald-100",
      type: "earnings",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: <FaCircle className="text-green-600 text-2xl" />,
      bg: "bg-blue-100",
      type: "users",
    },
    {
      title: "System Health",
      value: stats.systemHealth,
      icon: <FaHeartbeat className="text-green-700 text-2xl" />,
      bg: "bg-green-100",
      type: "system",
    },
  ];

  const formatStatValue = (v) => {
    if (v === null || v === undefined) return "-";
    if (typeof v === "number") return v.toLocaleString();
    return v;
  };

  const formatDetailValue = (val) => {
    if (val === null || val === undefined) return "-";
    if (Array.isArray(val)) return val.length ? val.join(", ") : "-";
    if (typeof val === "object") {
      // Prefer readable fields
      const prefer = ["name", "fullName", "title", "user", "camp", "email", "location"];
      for (const p of prefer) {
        if (val[p]) return String(val[p]);
      }
      if (val._id) return String(val._id);
      // If object has a few primitive keys, show a compact summary
      const entries = Object.entries(val).filter(([, v]) => typeof v !== 'object');
      if (entries.length > 0 && entries.length <= 4) {
        return entries.map(([k, v]) => `${k}: ${String(v)}`).join(" • ");
      }
      // Fallback: show a placeholder (don't dump full JSON)
      return "[object]";
    }
    return String(val);
  };

  /* ------------------ Fetch Details ------------------ */
  const fetchDetails = async (type) => {
    setSelectedCard(type);
    setLoadingDetails(true);

    try {
      let res;
      let data = [];

      switch (type) {
        case "Total Camps":
          // CampHome listing used elsewhere: /campHomeRoutes
          res = await API.get("/campHomeRoutes", { params: { limit: 50 } });
          data = res.data.camps || res.data.data || res.data;
          break;

        case "Event Venues":
          // try eventvenues endpoint, fallback to empty
          res = await API.get("/eventvenues").catch(() => null);
          data = (res && (res.data.eventVenues || res.data.data || res.data)) || [];
          break;

        case "Total Bookings":
          // use usersuperadmindashboard bookings endpoint
          res = await API.get("/usersuperadmindashboard/bookings", { params: { limit: 50, sort: "-createdAt" } });
          data = res.data || [];
          break;

        case "Tickets Sold":
          // reuse bookings and show ticket counts per booking
          res = await API.get("/usersuperadmindashboard/bookings", { params: { limit: 50, sort: "-createdAt" } });
          const rawTickets = res.data || [];
          data = rawTickets.map((b) => ({
            bookingId: b.bookingId || b.id || b._id,
            user: b.visitor || b.email || "-",
            tent: b.tent || "-",
            tickets: b.tickets || 0,
            amount: b.amount || 0,
            status: b.status || "-",
          }));
          break;

        case "Visitors Today":
          // Ask backend for bookings created today (faster & reliable)
          res = await API.get("/usersuperadmindashboard/visitors", { params: { limit: 200, sort: "-createdAt", today: "true" } });
          // backend returns compact mapped objects (visitor, bookingId, tickets, amount, time)
          const rawVisitors = res.data || [];
          // normalize shape for the table: visitor, bookingId, tickets, amount, date
          data = rawVisitors.map((b) => ({
            visitor: b.visitor || b.email || b.fullName || 'Anonymous',
            bookingId: b.bookingId || b.id || b._id,
            tickets: b.tickets ?? b.guests ?? 1,
            amount: b.amount ?? b.total ?? b.totalPrice ?? 0,
            date: b.time || b.createdAt || b.date || null,
          }));
          break;

        case "Total Earnings":
          // show recent paid bookings with amounts
          res = await API.get("/usersuperadmindashboard/bookings", { params: { limit: 50, sort: "-createdAt" } });
          data = (res.data || []).map((b) => ({
            bookingId: b.bookingId || b._id || b.id,
            user: b.visitor || b.email || "-",
            amount: b.amount || 0,
            date: b.time || b.createdAt || "-",
          }));
          break;

        case "Active Users":
          // use the dashboard users endpoint which supports status and pagination
          res = await API.get("/usersuperadmindashboard/users", { params: { status: "active", limit: 50 } });
          data = res.data.users || res.data.data || res.data.users || res.data;
          break;

        case "System Health":
          // no dedicated endpoint; use current stats summary
          data = [{ systemHealth: stats?.systemHealth || "Unknown" }];
          break;

        default:
          data = [];
      }

      setDetailsData(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Failed to fetch details", err);
      setDetailsData([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 w-full">
        <Header setSidebarOpen={setSidebarOpen} />

  <div className="p-4 md:p-6">
          {/* STATS */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          >
            {cards.map((c) => (
              <motion.div
                key={c.title}
                variants={fadeUp}
                className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between gap-4 cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-transform"
                onClick={() => fetchDetails(c.title)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl flex items-center justify-center`} style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.2))' }}>
                    <div className={`rounded-md p-3 ${c.bg}`}>
                      {c.icon}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">{c.title}</p>
                    <h2 className="text-2xl sm:text-3xl font-bold">{formatStatValue(c.value)}</h2>
                    {/* Optional small delta if available in stats (e.g., campsChange) */}
                    {stats && stats[`${c.type}Change`] !== undefined && (
                      <div className="text-xs mt-1 text-gray-500">
                        <span className={`${stats[`${c.type}Change`] >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stats[`${c.type}Change`] >= 0 ? '▲' : '▼'} {Math.abs(stats[`${c.type}Change`])}%
                        </span>
                        <span className="ml-2">vs last period</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-gray-300">{/* spacing placeholder for alignment */}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="text-sm font-semibold mb-3">Revenue Overview</h3>
              <RevenueChart />
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="text-sm font-semibold mb-3">Visitors Analytics</h3>
              <VisitorChart />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-6 mb-10">
            <BookingActivityChart />
            <RefundSummaryChart />
          </div>
        </div>

        {/* ------------------ DETAILS MODAL ------------------ */}
        {selectedCard && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-xl">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {/* try to find the matching card icon */}
                    {cards.find(x => x.title === selectedCard)?.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedCard} Details</h3>
                    <p className="text-sm text-gray-500">{detailsData.length} items</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    placeholder="Search details..."
                    className="px-3 py-2 border rounded-md text-sm"
                    onChange={(e) => {
                      const q = (e.target.value || "").toLowerCase();
                      if (!q) {
                        setDetailsData((d) => d.slice());
                        return;
                      }
                      setDetailsData((d) => d.filter(it => JSON.stringify(it).toLowerCase().includes(q)));
                    }}
                  />
                  <button
                    className="text-gray-500 hover:text-gray-900"
                    onClick={() => setSelectedCard(null)}
                  >
                    Close
                  </button>
                </div>
              </div>

              {loadingDetails ? (
                <p>Loading...</p>
              ) : detailsData.length === 0 ? (
                <p className="text-gray-500">No data found.</p>
              ) : (
                <div className="overflow-x-auto">
                  {/* Special rendering for Visitors Today to match other detail views */}
                  {selectedCard === "Visitors Today" ? (
                    <table className="w-full table-auto text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 sticky top-0">
                          <th className="p-3 text-xs text-gray-600 uppercase tracking-wider border-b">Visitor</th>
                          <th className="p-3 text-xs text-gray-600 uppercase tracking-wider border-b">Booking ID</th>
                          <th className="p-3 text-xs text-gray-600 uppercase tracking-wider border-b">Tickets</th>
                          <th className="p-3 text-xs text-gray-600 uppercase tracking-wider border-b">Amount</th>
                          <th className="p-3 text-xs text-gray-600 uppercase tracking-wider border-b">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailsData.map((v, idx) => (
                          <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="p-3 align-top text-sm border-b">{formatDetailValue(v.visitor)}</td>
                            <td className="p-3 align-top text-sm border-b">{v.bookingId || '-'}</td>
                            <td className="p-3 align-top text-sm border-b">{v.tickets ?? '-'}</td>
                            <td className="p-3 align-top text-sm border-b">{v.amount ? `ETB ${Number(v.amount).toLocaleString()}` : '-'}</td>
                            <td className="p-3 align-top text-sm border-b">{v.date ? new Date(v.date).toLocaleString() : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full table-auto text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 sticky top-0">
                          {Object.keys(detailsData[0]).map((key) => (
                            <th key={key} className="p-3 text-xs text-gray-600 uppercase tracking-wider border-b">
                              {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {detailsData.map((item, idx) => (
                          <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            {Object.values(item).map((val, i) => (
                              <td key={i} className="p-3 align-top text-sm border-b">
                                {val === null || val === undefined ? '-' : formatDetailValue(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
