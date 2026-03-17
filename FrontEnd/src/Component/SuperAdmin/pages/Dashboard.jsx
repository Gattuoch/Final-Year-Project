// Dashboard.js
import React, { useState, useEffect, useMemo, memo, lazy, Suspense, useRef } from "react";
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
  FaSearch,
  FaFilter,
  FaChartLine,
  FaUserCheck,
  FaMoneyBillWave,
  FaExchangeAlt
} from "react-icons/fa";

import Sidebar from "../sidebar/Sidebar.jsx";
import Header from "../../SuperAdmin/header/Header.jsx";
import API from "../services/api.js";

// Lazy load charts
const RevenueChart = lazy(() => import("../../SuperAdmin/charts/RevenueChart.jsx"));
const VisitorChart = lazy(() => import("../../SuperAdmin/charts/VisitorChart.jsx"));
const BookingActivityChart = lazy(() => import("../charts/BookingActivityChart.jsx"));
const RefundSummaryChart = lazy(() => import("../charts/RefundSummaryChart.jsx"));

// User context
import { useUser } from "../../../context/UserContext.jsx";

/* ------------------ Animations ------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

// Memoized stat card component
const StatCard = memo(({ title, value, icon, bg, onClick }) => (
  <motion.div
    variants={fadeUp}
    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between gap-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center gap-4">
      <div className={`p-3.5 rounded-xl ${bg} bg-opacity-50 group-hover:bg-opacity-80 transition-colors`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">{value}</h2>
      </div>
    </div>
  </motion.div>
));

export default function Dashboard() {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chart data states
  const [revenueData, setRevenueData] = useState([]);
  const [visitorData, setVisitorData] = useState([]);
  const [bookingActivityData, setBookingActivityData] = useState([]);
  const [refundData, setRefundData] = useState([]);

  // Modal state
  const [selectedCard, setSelectedCard] = useState(null);
  const [detailsData, setDetailsData] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [filters, setFilters] = useState({ search: "", dateRange: { start: "", end: "" }, location: "" });
  const abortControllerRef = useRef(null);

  /* ------------------ Load all data and compute stats ------------------ */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [campsRes, venuesRes, bookingsRes, usersRes, visitorsRes] = await Promise.allSettled([
          API.get("/campHomeRoutes", { params: { limit: 1000 } }),
          API.get("/eventvenues"),
          API.get("/usersuperadmindashboard/bookings", { params: { limit: 1000 } }),
          API.get("/usersuperadmindashboard/users", { params: { limit: 1000 } }),
          API.get("/usersuperadmindashboard/visitors", { params: { limit: 1000 } }),
        ]);

        const camps = campsRes.status === "fulfilled" ? campsRes.value.data.camps || campsRes.value.data.data || [] : [];
        const venues = venuesRes.status === "fulfilled" ? venuesRes.value.data.eventVenues || venuesRes.value.data.data || [] : [];
        const bookings = bookingsRes.status === "fulfilled" ? bookingsRes.value.data || [] : [];
        const users = usersRes.status === "fulfilled" ? usersRes.value.data.users || usersRes.value.data.data || [] : [];
        const visitors = visitorsRes.status === "fulfilled" ? visitorsRes.value.data || [] : [];

        // Compute stats
        const totalCamps = camps.length;
        const totalVenues = venues.length;
        const totalBookings = bookings.length;
        const ticketsSold = bookings.reduce((sum, b) => sum + (b.tickets || 0), 0);
        
        const today = new Date().toDateString();
        const todayVisitors = visitors.filter(v => {
          const date = v.time ? new Date(v.time).toDateString() : null;
          return date === today;
        }).length;

        const totalEarnings = bookings
          .filter(b => b.status === "confirmed" || b.paymentStatus === "paid")
          .reduce((sum, b) => sum + (b.amount || 0), 0);

        const activeUsers = users.filter(u => u.status === "active" || u.isActive === true).length;

        setStats({
          totalCamps,
          totalVenues,
          totalBookings,
          ticketsSold,
          todayVisitors,
          totalEarnings,
          activeUsers,
          systemHealth: "Good",
        });

        // Prepare chart data
        // Revenue chart: monthly earnings
        const revenueByMonth = {};
        bookings.forEach(b => {
          if (b.amount && (b.status === "confirmed" || b.paymentStatus === "paid")) {
            const date = b.time || b.createdAt;
            if (date) {
              const month = new Date(date).toLocaleString('default', { month: 'short' });
              revenueByMonth[month] = (revenueByMonth[month] || 0) + (b.amount || 0);
            }
          }
        });
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const revenueChartData = months.map(month => ({ month, amount: revenueByMonth[month] || 0 }));
        setRevenueData(revenueChartData);

        // Visitor chart: last 7 days
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toDateString();
        }).reverse();
        const visitorCounts = last7Days.map(day => ({
          day: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
          visitors: visitors.filter(v => {
            const vDate = v.time ? new Date(v.time).toDateString() : null;
            return vDate === day;
          }).length
        }));
        setVisitorData(visitorCounts);

        // Booking activity: status distribution
        const statusCounts = {
          confirmed: bookings.filter(b => b.status === "confirmed" || b.paymentStatus === "paid").length,
          pending: bookings.filter(b => b.status === "pending").length,
          cancelled: bookings.filter(b => b.status === "cancelled").length,
        };
        setBookingActivityData([
          { name: 'Confirmed', value: statusCounts.confirmed },
          { name: 'Pending', value: statusCounts.pending },
          { name: 'Cancelled', value: statusCounts.cancelled },
        ]);

        // Refund summary
        const refundedBookings = bookings.filter(b => b.status === "refunded");
        setRefundData([
          { name: 'Refunded Bookings', count: refundedBookings.length },
          { name: 'Total Refunded (ETB)', amount: refundedBookings.reduce((sum, b) => sum + (b.amount || 0), 0) },
        ]);

      } catch (err) {
        console.error("Dashboard data error", err);
        toast.error("Failed to load dashboard data.");
        setStats({});
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedCard(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /* ------------------ Card Configuration ------------------ */
  const cards = useMemo(() => [
    {
      title: "Total Camps",
      value: stats?.totalCamps ?? 0,
      icon: <FaCampground className="text-blue-600 text-2xl" />,
      bg: "bg-blue-100",
      type: "camps",
    },
    {
      title: "Event Venues",
      value: stats?.totalVenues ?? 0,
      icon: <FaCalendarAlt className="text-pink-600 text-2xl" />,
      bg: "bg-pink-100",
      type: "venues",
    },
    {
      title: "Total Bookings",
      value: stats?.totalBookings ?? 0,
      icon: <FaTicketAlt className="text-green-600 text-2xl" />,
      bg: "bg-green-100",
      type: "bookings",
    },
    {
      title: "Tickets Sold",
      value: stats?.ticketsSold ?? 0,
      icon: <FaClipboardList className="text-orange-600 text-2xl" />,
      bg: "bg-orange-100",
      type: "tickets",
    },
    {
      title: "Visitors Today",
      value: stats?.todayVisitors ?? 0,
      icon: <FaUsers className="text-purple-600 text-2xl" />,
      bg: "bg-purple-100",
      type: "visitors",
    },
    {
      title: "Total Earnings",
      value: stats?.totalEarnings ? `ETB ${stats.totalEarnings.toLocaleString()}` : "ETB 0",
      icon: <FaDollarSign className="text-emerald-600 text-2xl" />,
      bg: "bg-emerald-100",
      type: "earnings",
    },
    {
      title: "Active Users",
      value: stats?.activeUsers ?? 0,
      icon: <FaCircle className="text-green-600 text-2xl" />,
      bg: "bg-blue-100",
      type: "users",
    },
    {
      title: "System Health",
      value: stats?.systemHealth ?? "Good",
      icon: <FaHeartbeat className="text-green-700 text-2xl" />,
      bg: "bg-green-100",
      type: "system",
    },
  ], [stats]);

  /* ------------------ Formatting helpers ------------------ */
  const formatCurrency = (amount) => `ETB ${amount?.toLocaleString() ?? 0}`;
  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString() : "-";

  const StatusBadge = ({ status }) => {
    const colors = {
      confirmed: "bg-green-100 text-green-800 border border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      cancelled: "bg-red-100 text-red-800 border border-red-200",
      refunded: "bg-purple-100 text-purple-800 border border-purple-200",
      active: "bg-green-100 text-green-800 border border-green-200",
      inactive: "bg-gray-100 text-gray-800 border border-gray-200",
    };
    const color = colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800 border border-gray-200";
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{status}</span>;
  };

  /* ------------------ Fetch Details with filters ------------------ */
  const fetchDetails = async (type) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setSelectedCard(type);
    setLoadingDetails(true);
    setFilters({ search: "", dateRange: { start: "", end: "" }, location: "" });

    try {
      const signal = controller.signal;
      let res;
      let data = [];

      switch (type) {
        case "Total Camps":
          res = await API.get("/campHomeRoutes", { params: { limit: 100 }, signal });
          data = (res.data.camps || res.data.data || []).map(camp => ({
            Name: camp.name,
            Location: camp.location,
            Status: camp.isActive ? <StatusBadge status="Active" /> : <StatusBadge status="Inactive" />,
            "Join Date": formatDate(camp.createdAt),
          }));
          break;

        case "Event Venues":
          res = await API.get("/eventvenues", { signal }).catch(() => null);
          data = (res?.data?.eventVenues || res?.data?.data || []).map(venue => ({
            Name: venue.name,
            Location: venue.address,
            Capacity: venue.capacity,
            Status: venue.isAvailable ? <StatusBadge status="Available" /> : <StatusBadge status="Unavailable" />,
          }));
          break;

        case "Total Bookings":
          res = await API.get("/usersuperadmindashboard/bookings", { params: { limit: 100, sort: "-createdAt" }, signal });
          data = (res.data || []).map(booking => ({
            Customer: booking.visitor || booking.email || "N/A",
            Tickets: booking.tickets || 1,
            Amount: formatCurrency(booking.amount),
            Status: <StatusBadge status={booking.status} />,
            Date: formatDate(booking.time || booking.createdAt),
          }));
          break;

        case "Tickets Sold":
          res = await API.get("/usersuperadmindashboard/bookings", { params: { limit: 100, sort: "-createdAt" }, signal });
          data = (res.data || []).flatMap(booking => 
            Array.from({ length: booking.tickets || 1 }, (_, i) => ({
              Customer: booking.visitor || booking.email,
              Event: booking.campName || booking.eventName,
              Price: formatCurrency((booking.amount || 0) / (booking.tickets || 1)),
              Status: <StatusBadge status={booking.status} />,
              Date: formatDate(booking.time || booking.createdAt),
            }))
          );
          break;

        case "Visitors Today":
          res = await API.get("/usersuperadmindashboard/visitors", { params: { limit: 100 }, signal });
          const today = new Date().toDateString();
          data = (res.data || [])
            .filter(v => {
              const date = v.time ? new Date(v.time).toDateString() : null;
              return date === today;
            })
            .map(v => ({
              Visitor: v.visitor || v.fullName || "Guest",
              Tickets: v.tickets,
              Amount: formatCurrency(v.amount),
              "Check‑in": v.time ? new Date(v.time).toLocaleTimeString() : "-",
            }));
          break;

        case "Total Earnings":
          res = await API.get("/usersuperadmindashboard/bookings", { params: { limit: 100, sort: "-createdAt" }, signal });
          data = (res.data || [])
            .filter(b => b.status === "confirmed" || b.paymentStatus === "paid")
            .map(b => ({
              Customer: b.visitor,
              Amount: formatCurrency(b.amount),
              Method: b.paymentMethod || "Online",
              Date: formatDate(b.time || b.createdAt),
            }));
          break;

        case "Active Users":
          res = await API.get("/usersuperadmindashboard/users", { params: { limit: 100 }, signal });
          data = (res.data.users || res.data.data || [])
            .filter(u => u.status === "active" || u.isActive === true)
            .map(u => ({
              Name: u.name,
              Email: u.email,
              Role: u.role,
              "Last Active": u.lastActive ? new Date(u.lastActive).toLocaleDateString() : "-",
            }));
          break;

        case "System Health":
          data = [
            { Service: "Database", Status: "✅ Connected", Latency: "12ms" },
            { Service: "API Server", Status: "✅ Online", Uptime: "99.9%" },
            { Service: "Payment Gateway", Status: "✅ Operational" },
          ];
          break;

        default:
          data = [];
      }
      setDetailsData(data);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Failed to fetch details", err);
        toast.error(`Could not load details for ${type}`);
        setDetailsData([]);
      }
    } finally {
      setLoadingDetails(false);
      abortControllerRef.current = null;
    }
  };

  // Filter details based on search and other filters
  const filteredDetails = useMemo(() => {
    let filtered = detailsData;

    // Global search (text search)
    if (filters.search) {
      filtered = filtered.filter(item =>
        JSON.stringify(item).toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Date range filter (if applicable)
    if (filters.dateRange.start && filters.dateRange.end) {
      const start = new Date(filters.dateRange.start).getTime();
      const end = new Date(filters.dateRange.end).getTime();
      filtered = filtered.filter(item => {
        const dateField = item.Date || item["Join Date"]; // try common date fields
        if (!dateField) return true;
        const itemDate = new Date(dateField).getTime();
        return itemDate >= start && itemDate <= end;
      });
    }

    // Location filter (for camps/venues)
    if (filters.location && (selectedCard === "Total Camps" || selectedCard === "Event Venues")) {
      filtered = filtered.filter(item =>
        item.Location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    return filtered;
  }, [detailsData, filters]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1">
          <Header setSidebarOpen={setSidebarOpen} userName={user?.name} />
          <div className="p-4 md:p-6 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden font-sans">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 w-full relative">
        <Header setSidebarOpen={setSidebarOpen} userName={user?.name} />

        <div className="p-4 md:p-6 lg:p-8 overflow-y-auto h-[calc(100vh-64px)]">
          
          {/* STATS GRID */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
          >
            {cards.map((c) => (
              <StatCard
                key={c.title}
                title={c.title}
                value={c.value}
                icon={c.icon}
                bg={c.bg}
                onClick={() => fetchDetails(c.title)}
              />
            ))}
          </motion.div>

          {/* CHARTS SECTION */}
          <Suspense fallback={<div className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>}>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaChartLine className="text-blue-500" /> Revenue Trends
                </h3>
                <div className="h-64">
                  <RevenueChart data={revenueData} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUsers className="text-purple-500" /> Visitor Analytics
                </h3>
                <div className="h-64">
                  <VisitorChart data={visitorData} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaTicketAlt className="text-green-500" /> Booking Activity
                </h3>
                <div className="h-64">
                  <BookingActivityChart data={bookingActivityData} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaExchangeAlt className="text-orange-500" /> Refund Summary
                </h3>
                <div className="h-64">
                  <RefundSummaryChart data={refundData} />
                </div>
              </div>
            </div>
          </Suspense>
        </div>

        {/* ------------------ DETAILS MODAL (with filters) ------------------ */}
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
                className="bg-white rounded-2xl w-full max-w-6xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
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
                    <button 
                      onClick={() => setSelectedCard(null)}
                      className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                {/* Filter Bar */}
                <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-3 items-center">
                  <div className="relative flex-1 min-w-[200px]">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                  </div>

                  {/* Date range filter (only for bookings/earnings/visitors) */}
                  {(selectedCard === "Total Bookings" || selectedCard === "Total Earnings" || selectedCard === "Visitors Today") && (
                    <>
                      <input 
                        type="date" 
                        value={filters.dateRange.start}
                        onChange={(e) => setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, start: e.target.value } }))}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-400">to</span>
                      <input 
                        type="date" 
                        value={filters.dateRange.end}
                        onChange={(e) => setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, end: e.target.value } }))}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </>
                  )}

                  {/* Location filter (for camps/venues) */}
                  {(selectedCard === "Total Camps" || selectedCard === "Event Venues") && (
                    <input 
                      type="text" 
                      placeholder="Filter by location..." 
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
                    />
                  )}

                  {/* Reset filters button */}
                  <button 
                    onClick={() => setFilters({ search: "", dateRange: { start: "", end: "" }, location: "" })}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    Reset
                  </button>
                </div>

                {/* Modal Body - Beautiful Table */}
                <div className="flex-1 overflow-auto p-0">
                  {loadingDetails ? (
                    <div className="p-6 space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="animate-pulse flex gap-4">
                          <div className="h-6 bg-gray-200 rounded w-1/5"></div>
                          <div className="h-6 bg-gray-200 rounded w-1/5"></div>
                          <div className="h-6 bg-gray-200 rounded w-1/5"></div>
                          <div className="h-6 bg-gray-200 rounded w-1/5"></div>
                        </div>
                      ))}
                    </div>
                  ) : filteredDetails.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                      <p>No records found.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                          <tr>
                            {Object.keys(filteredDetails[0]).map((key) => (
                              <th key={key} className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap bg-gray-50">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredDetails.map((item, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white hover:bg-blue-50/50' : 'bg-gray-50/50 hover:bg-blue-50/50'}>
                              {Object.values(item).map((val, i) => (
                                <td key={i} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                  {typeof val === "object" && val !== null && val.$$typeof ? val : String(val)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                
                {/* Modal Footer */}
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