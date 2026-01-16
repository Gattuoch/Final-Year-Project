import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { FaCampground, FaCheckCircle, FaClock, FaBan, FaCloudUploadAlt, FaEllipsisV, FaMapMarkedAlt, FaTicketAlt, FaUsers, FaThLarge, FaMoneyBillWave, FaUserCheck, FaHeartbeat } from "react-icons/fa";

import Sidebar from "../sidebar/Sidebar";
import CampHeader from "./CampHeader";
import API from "../services/api";
import toast from "react-hot-toast";

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

const defaultStats = [
  { title: "Overview", key: "overview", color: "text-indigo-600", icon: <FaThLarge className="text-indigo-600 text-xl md:text-2xl" />, bgColor: "bg-indigo-100" },
  { title: "Total Camps", key: "total", color: "text-blue-600", icon: <FaCampground className="text-blue-600 text-xl md:text-2xl" />, bgColor: "bg-blue-100" },
  { title: "Event Venues", key: "venues", color: "text-purple-600", icon: <FaMapMarkedAlt className="text-purple-600 text-xl md:text-2xl" />, bgColor: "bg-purple-100" },
  { title: "Total Bookings", key: "bookings", color: "text-yellow-600", icon: <FaTicketAlt className="text-yellow-600 text-xl md:text-2xl" />, bgColor: "bg-yellow-100" },
  { title: "Users", key: "users", color: "text-teal-600", icon: <FaUsers className="text-teal-600 text-xl md:text-2xl" />, bgColor: "bg-teal-100" },
  { title: "Active Camps", key: "active", color: "text-green-600", icon: <FaCheckCircle className="text-green-600 text-xl md:text-2xl" />, bgColor: "bg-green-100" },
  { title: "Pending Review", key: "pending", color: "text-orange-500", icon: <FaClock className="text-orange-500 text-xl md:text-2xl" />, bgColor: "bg-orange-100" },
  { title: "Inactive", key: "inactive", color: "text-red-500", icon: <FaBan className="text-red-500 text-xl md:text-2xl" />, bgColor: "bg-red-100" },
];

const CampManagement = () => {
    // helper to format price as ETB
    const formatETB = (v) => {
      if (v === undefined || v === null || v === "") return "-";
      const n = Number(v) || 0;
      return `${n.toLocaleString('en-US')} ETB`;
    };

    const imageFallback = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";
    const handleImgError = (e) => {
      try {
        e.target.onerror = null;
        e.target.src = imageFallback;
      } catch (err) {}
    };

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [camps, setCamps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(defaultStats);
  const [showTotalModal, setShowTotalModal] = useState(false);
  const [totalCampsList, setTotalCampsList] = useState([]);
  const [showOverviewModal, setShowOverviewModal] = useState(false);
  const [overviewData, setOverviewData] = useState({ camps: 0, venues: 0, bookings: 0, users: 0, ticketsSold: 0, visitorsToday: 0, earnings: 0, activeUsers: 0, systemHealth: 'Unknown' });
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [showStatTableModal, setShowStatTableModal] = useState(false);
  const [statTableTitle, setStatTableTitle] = useState("");
  const [statTableItems, setStatTableItems] = useState([]);

    // Filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [regionFilter, setRegionFilter] = useState("");
    const [minRating, setMinRating] = useState(null);
    const [ratingMode, setRatingMode] = useState(null);
    const [sortBy, setSortBy] = useState("-createdAt");
    const [page, setPage] = useState(1);
    const [limit] = useState(20);

    // Helper to render location safely when backend may return either a string
    // or an object { address, region, description }. Avoid passing objects
    // directly to JSX (causes "Objects are not valid as a React child").
    const renderLocation = (loc) => {
      // Return a small, attractive piece of JSX instead of raw JSON.
      if (!loc) return <span className="text-gray-500">-</span>;
      if (typeof loc === "string") return <span className="text-gray-700">{loc}</span>;

      // loc is an object { address, region, description }
      const address = loc.address || "";
      const region = loc.region || "";
      const desc = loc.description || "";

      return (
        <div className="flex flex-col">
          {address ? <span className="text-gray-800 truncate">{address}</span> : null}
          {(region || desc) ? (
            <span className="text-xs text-gray-500 truncate">{[region, desc].filter(Boolean).join(" • ")}</span>
          ) : null}
        </div>
      );
    };
    // Helper to produce a plain string for inputs / payloads (don't return '-')
    const normalizeLocationForInput = (loc) => {
      if (!loc) return "";
      if (typeof loc === "string") return loc;
      if (loc.address) return loc.address;
      if (loc.region) return loc.region;
      try { return JSON.stringify(loc); } catch (e) { return ""; }
    };
    useEffect(() => {
      fetchStats();
    }, []);

    useEffect(() => {
      fetchCamps();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, statusFilter, regionFilter, sortBy, page, minRating, ratingMode]);

    const handleStatClick = (key) => {
      setPage(1);
      switch (key) {
        case "overview":
          // open overview totals modal
          setShowOverviewModal(true);
          return;
        case "total":
          setSearch("");
          setStatusFilter("");
          setRegionFilter("");
          setMinRating(null);
          setRatingMode(null);
          // open table modal with all camps
          setStatTableTitle("All Camps");
          setStatTableItems(totalCampsList.length ? totalCampsList : camps);
          setShowStatTableModal(true);
          break;
        case "venues":
          // open venues list
          viewResource('venues');
          break;
        case "bookings":
          viewResource('bookings');
          break;
        case "users":
          viewResource('users');
          break;
        case "active":
          // show camps whose badge/status is Active
          setSearch("");
          setStatusFilter("Active");
          setRegionFilter("");
          setMinRating(null);
          setRatingMode(null);
          // open table modal with active camps
          setStatTableTitle("Active Camps");
          setStatTableItems((totalCampsList.length ? totalCampsList : camps).filter((c) => (c.badge || "").toLowerCase() === "active"));
          setShowStatTableModal(true);
          break;
        case "pending":
          // show camps whose badge/status is Pending
          setSearch("");
          setStatusFilter("Pending");
          setRegionFilter("");
          setMinRating(null);
          setRatingMode(null);
          setStatTableTitle("Pending Review");
          setStatTableItems((totalCampsList.length ? totalCampsList : camps).filter((c) => (c.badge || "").toLowerCase() === "pending"));
          setShowStatTableModal(true);
          break;
        case "inactive":
          // show camps whose badge/status is Inactive
          setSearch("");
          setStatusFilter("Inactive");
          setRegionFilter("");
          setMinRating(null);
          setRatingMode(null);
          setStatTableTitle("Inactive Camps");
          setStatTableItems((totalCampsList.length ? totalCampsList : camps).filter((c) => (c.badge || "").toLowerCase() === "inactive"));
          setShowStatTableModal(true);
          break;
        default:
          break;
      }
    };

    const resourceEndpoint = {
      camps: '/campHomeRoutes',
      venues: '/eventvenues',
      bookings: '/bookings',
      users: '/users',
    };

    const viewResource = async (resource) => {
      const ep = resourceEndpoint[resource] || resource;
      const loadingToast = toast.loading('Loading ' + resource + '...');
      try {
        setLoading(true);
        const res = await API.get(ep, { params: { page: 1, limit: 1000 } });
        const items = res?.data?.data || res?.data || [];
        const titleMap = { camps: 'Camps', venues: 'Event Venues', bookings: 'Bookings', users: 'Users' };
        setStatTableTitle(titleMap[resource] || resource);
        setStatTableItems(items);
        setShowStatTableModal(true);
        toast.dismiss(loadingToast);
      } catch (err) {
        toast.dismiss(loadingToast);
        console.error(err);
        toast.error('Failed to load ' + resource);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      setLoadingOverview(true);
      try {
        // fetch several resources in parallel; use settled to tolerate partial failures
        const [cRes, vRes, bRes, uRes] = await Promise.allSettled([
          API.get('/campHomeRoutes', { params: { page: 1, limit: 1000 } }),
          API.get('/eventvenues'),
          API.get('/bookings'),
          API.get('/users'),
        ]);

        // collect results (use empty arrays when a resource failed)
        const camps = cRes.status === 'fulfilled' ? (cRes.value.data.data || cRes.value.data || []) : [];
        const venues = vRes.status === 'fulfilled' ? (vRes.value.data.data || vRes.value.data || []) : [];
        const bookings = bRes.status === 'fulfilled' ? (bRes.value.data.data || bRes.value.data || []) : [];
        const users = uRes.status === 'fulfilled' ? (uRes.value.data.data || uRes.value.data || []) : [];

        // report specific failures (avoid a noisy generic toast)
        if (cRes.status === 'rejected') {
          console.warn('Camps stats failed:', cRes.reason);
          toast.error('Failed to load camp stats');
        }
        if (vRes.status === 'rejected') {
          console.warn('Event venues failed:', vRes.reason);
          toast.error('Failed to load event venues');
        }
        if (bRes.status === 'rejected') {
          console.warn('Bookings failed:', bRes.reason);
          toast.error('Failed to load bookings');
        }
        if (uRes.status === 'rejected') {
          console.warn('Users failed:', uRes.reason);
          toast.error('Failed to load users');
        }

        const total = camps.length;
        setTotalCampsList(camps);

        const activeCount = camps.filter((c) => (c.badge || '').toLowerCase() === 'active').length;
        const pendingCount = camps.filter((c) => (c.badge || '').toLowerCase() === 'pending').length;
        const inactiveCount = camps.filter((c) => (c.badge || '').toLowerCase() === 'inactive').length;

        // derive additional metrics (safe with empty arrays)
        const ticketsSold = bookings.reduce((s, b) => {
          const v = Number(b.ticketsSold ?? b.tickets ?? b.quantity ?? b.count ?? 0) || 0;
          return s + v;
        }, 0);

        const earnings = bookings.reduce((s, b) => {
          const v = Number(b.total ?? b.amount ?? b.price ?? b.paidAmount ?? 0) || 0;
          return s + v;
        }, 0);

        const todayStr = new Date().toDateString();
        const visitorsToday = bookings.filter((b) => b.createdAt && new Date(b.createdAt).toDateString() === todayStr).length;

        const activeUsers = users.filter((u) => (u.isActive || u.active || (u.status && String(u.status).toLowerCase() === 'active'))).length || users.length;

        const systemHealth = (cRes.status === 'fulfilled' && vRes.status === 'fulfilled' && bRes.status === 'fulfilled' && uRes.status === 'fulfilled') ? 'Good' : 'Degraded';

        setOverviewData({ camps: total, venues: venues.length, bookings: bookings.length, users: users.length, ticketsSold, visitorsToday, earnings, activeUsers, systemHealth });

        // Set stats by mapping keys to their computed values
        const mapping = { total, active: activeCount, pending: pendingCount, inactive: inactiveCount, venues: venues.length, bookings: bookings.length, users: users.length };
        setStats((prev) => prev.map((p) => ({ ...p, value: mapping[p.key] ?? 0 })));
      } catch (err) {
        // This should be rare; log and surface a single meaningful message
        console.error('Unexpected error in fetchStats:', err);
        toast.error('Could not load overview data');
      } finally {
        setLoadingOverview(false);
      }
    };

    const fetchCamps = async () => {
      setLoading(true);
      try {
        const params = {
          search: search || undefined,
          location: regionFilter || undefined,
          badge: statusFilter || undefined,
          page,
          limit,
        };

        const computeSort = (s) => {
          if (!s) return undefined;
          if (s.startsWith("-")) return `${s.slice(1)}:desc`;
          return `${s}:asc`;
        };

        params.sort = computeSort(sortBy);
        if (minRating && ratingMode === "min") params.minRating = minRating;

        const res = await API.get("/campHomeRoutes", { params });
        let items = res.data.data || [];

        if (ratingMode === "pending") items = items.filter((c) => (c.rating || 0) >= 3 && (c.rating || 0) < 4);
        if (ratingMode === "inactive") items = items.filter((c) => (c.rating || 0) < 3);

        setCamps(items);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load camps");
      } finally {
        setLoading(false);
      }
    };

    const handleEdit = (id) => {
      const c = camps.find((x) => x._id === id);
      if (c) setEditCamp(c);
    };

    const changeCampStatus = async (camp, status) => {
      const mapping = {
        Active: { statusColor: '#d1fae5', TextColor: '#065f46' },
        Pending: { statusColor: '#ffedd5', TextColor: '#92400e' },
        Inactive: { statusColor: '#fee2e2', TextColor: '#991b1b' },
      };
      const colors = mapping[status] || {};
      const loading = toast.loading(`Updating status to ${status}...`);
      try {
        // PUT requires name and location (Joi validation). Include them to avoid 400.
        const payload = {
          name: camp.name || "",
          location: normalizeLocationForInput(camp.location),
          badge: status,
          statusColor: colors.statusColor,
          TextColor: colors.TextColor,
          // include other optional fields to avoid accidental overwrites
          description: camp.description || "",
          price: camp.price ?? 0,
          amenities: camp.amenities || [],
          image: camp.image || "",
        };
        await API.put(`/campHomeRoutes/${camp._id}`, payload);
        toast.dismiss(loading);
        toast.success(`Camp "${camp.name}" marked ${status}`);
        // optimistic update
        setCamps((prev) => prev.map((p) => (p._id === camp._id ? { ...p, badge: status, ...colors } : p)));
        fetchStats();
      } catch (err) {
        toast.dismiss(loading);
        const msg = err?.response?.data?.message || 'Failed to update status';
        toast.error(msg);
      }
    };

    const handleAdminDelete = async (campOrId) => {
      let id;
      let name = "";
      let price = null;
      if (campOrId && typeof campOrId === "object") {
        id = campOrId._id;
        name = campOrId.name || "";
        price = campOrId.price ?? null;
      } else {
        id = campOrId;
        const c = camps.find((x) => x._id === id) || {};
        name = c.name || "";
        price = c.price ?? null;
      }

      try {
        const res = await API.delete(`/campHomeRoutes/${id}`);
        const backendMsg = res?.data?.message;
        const successMsg = backendMsg || `Deleted camp "${name || id}"`;
        toast.success(price ? `${successMsg} — ${formatETB(price)}` : successMsg);
        await fetchCamps();
        await fetchStats();
        return true;
      } catch (err) {
        console.error(err);
        const backendMsg = err?.response?.data?.message;
        const message = backendMsg || `Failed to delete "${name || id}"`;
        toast.error(message);
        return false;
      }
    };

    const [confirmDeleteCamp, setConfirmDeleteCamp] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const requestDelete = (camp) => setConfirmDeleteCamp(camp);

    const ConfirmDeleteModal = ({ camp, onClose }) => {
      const [confirmText, setConfirmText] = useState("");
      if (!camp) return null;

      const matchesName = confirmText.trim() === (camp.name || "");

      const handleConfirmDelete = async () => {
        const loadingToast = toast.loading(`Deleting "${camp.name}"...`);
        try {
          setDeleting(true);
          const ok = await handleAdminDelete(camp);
          toast.dismiss(loadingToast);
          if (ok) {
            toast.success(`Deleted "${camp.name}"`);
            setConfirmText("");
            onClose();
          } else {
            toast.error(`Failed to delete "${camp.name}"`);
          }
        } catch (err) {
          toast.dismiss(loadingToast);
          const msg = err?.response?.data?.message || 'Delete failed';
          toast.error(msg);
        } finally {
          setDeleting(false);
        }
      };

      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
            <div className="px-6 py-5 flex items-center gap-4 bg-red-50">
              <div className="bg-red-100 text-red-600 rounded-full p-3">
                <FiTrash2 className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Delete "{camp.name}"?</h3>
                <p className="text-sm text-gray-500 mt-1">This action is permanent and cannot be undone.</p>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4">
                <img src={camp.image || imageFallback} alt={camp.name} className="w-24 h-24 rounded-lg object-cover shadow-sm" onError={handleImgError} crossOrigin="anonymous" referrerPolicy="no-referrer" loading="lazy" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">You're about to delete the camp:</p>
                  <h4 className="text-md font-medium mt-2">{camp.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">Region: {renderLocation(camp.location)} • Badge: {camp.badge || '-'}</p>
                  <p className="text-sm text-gray-500 mt-2">To confirm, type the camp name exactly.</p>
                  <input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Type camp name to confirm"
                    className="mt-2 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-red-200"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={onClose} disabled={deleting} className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmDelete}
                  disabled={!matchesName || deleting}
                  className={`px-4 py-2 rounded-md text-white ${!matchesName || deleting ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {deleting ? 'Deleting...' : `Delete "${camp.name}"`}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      );
    };

    /* ================= VIEW / EDIT MODALS ================= */
    const [viewCamp, setViewCamp] = useState(null);
    const [editCamp, setEditCamp] = useState(null);
    const [createOpen, setCreateOpen] = useState(false);

    const ViewModal = ({ camp, onClose }) => (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
        <div className="bg-white rounded-2xl w-full max-w-2xl p-6 relative">
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">✕</button>
          <h2 className="text-xl font-bold mb-4">{camp.name}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <img src={camp.image || imageFallback} alt={camp.name} className="w-full h-48 object-cover rounded-lg" onError={handleImgError} crossOrigin="anonymous" referrerPolicy="no-referrer" loading="lazy" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">{camp.description}</p>
              <p className="text-sm"><strong>Location:</strong> {renderLocation(camp.location)}</p>
              <p className="text-sm"><strong>Badge:</strong> {camp.badge || '-'}</p>
              <p className="text-sm"><strong>Price:</strong> {camp.price ? formatETB(camp.price) : '-'}</p>
              <p className="text-sm"><strong>Rating:</strong> {camp.rating ?? '-'}</p>
              <p className="text-sm"><strong>Amenities:</strong> {camp.amenities && camp.amenities.length ? camp.amenities.join(', ') : '-'}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-3 justify-end">
            <button onClick={onClose} className="btn-secondary">Close</button>
          </div>
        </div>
      </div>
    );

    const TotalCampsModal = ({ items, onClose }) => {
      return (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 p-6 overflow-auto">
          <div className="bg-white rounded-2xl w-full max-w-5xl p-6 relative shadow-2xl border">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
            <h2 className="text-2xl font-bold mb-4">All Camps ({items.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((c) => (
                <div key={c._id} className="flex flex-col bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md">
                  <div className="h-40 w-full overflow-hidden bg-gray-100">
                    <img src={c.image || (c.images && c.images[0]) || imageFallback} alt={c.name} className="w-full h-full object-cover" onError={handleImgError} />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">{c.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${c.badge ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-400'}`}>{c.badge || '-'}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 flex-1">
                      {renderLocation(c.location)}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-gray-700 font-medium">{c.price ? formatETB(c.price) : '-'}</div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setViewCamp(c); onClose(); }} className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">View</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

      const TotalsModal = ({ data, onClose, onView }) => {
        return (
          <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 p-6 overflow-auto">
            <div className="bg-white rounded-2xl w-full max-w-3xl p-6 relative shadow-2xl border">
              <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
              <h2 className="text-2xl font-bold mb-4">Overview Totals</h2>
                      <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="p-3 text-left">Metric</th>
                              <th className="p-3 text-left">Value</th>
                              <th className="p-3 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t hover:bg-gray-50">
                              <td className="p-3 flex items-center gap-3"><FaCampground className="text-blue-600"/> <span className="font-medium">Total Camps</span></td>
                              <td className="p-3">{data.camps ?? 0}</td>
                              <td className="p-3 text-center"><button onClick={() => onView('camps')} className="px-3 py-1 bg-blue-600 text-white rounded-md">View</button></td>
                            </tr>

                            <tr className="border-t hover:bg-gray-50">
                              <td className="p-3 flex items-center gap-3"><FaMapMarkedAlt className="text-purple-600"/> <span className="font-medium">Event Venues</span></td>
                              <td className="p-3">{data.venues ?? 0}</td>
                              <td className="p-3 text-center"><button onClick={() => onView('venues')} className="px-3 py-1 bg-purple-600 text-white rounded-md">View</button></td>
                            </tr>

                            <tr className="border-t hover:bg-gray-50">
                              <td className="p-3 flex items-center gap-3"><FaTicketAlt className="text-yellow-600"/> <span className="font-medium">Total Bookings</span></td>
                              <td className="p-3">{data.bookings ?? 0}</td>
                              <td className="p-3 text-center"><button onClick={() => onView('bookings')} className="px-3 py-1 bg-yellow-600 text-white rounded-md">View</button></td>
                            </tr>

                            <tr className="border-t hover:bg-gray-50">
                              <td className="p-3 flex items-center gap-3"><FaTicketAlt className="text-amber-500"/> <span className="font-medium">Tickets Sold</span></td>
                              <td className="p-3">{data.ticketsSold ?? 0}</td>
                              <td className="p-3 text-center">-</td>
                            </tr>

                            <tr className="border-t hover:bg-gray-50">
                              <td className="p-3 flex items-center gap-3"><FaUserCheck className="text-green-600"/> <span className="font-medium">Visitors Today</span></td>
                              <td className="p-3">{data.visitorsToday ?? 0}</td>
                              <td className="p-3 text-center">-</td>
                            </tr>

                            <tr className="border-t hover:bg-gray-50">
                              <td className="p-3 flex items-center gap-3"><FaMoneyBillWave className="text-teal-700"/> <span className="font-medium">Total Earnings</span></td>
                              <td className="p-3">{formatETB(data.earnings ?? 0)}</td>
                              <td className="p-3 text-center">-</td>
                            </tr>

                            <tr className="border-t hover:bg-gray-50">
                              <td className="p-3 flex items-center gap-3"><FaUsers className="text-teal-500"/> <span className="font-medium">Active Users</span></td>
                              <td className="p-3">{data.activeUsers ?? 0}</td>
                              <td className="p-3 text-center"><button onClick={() => onView('users')} className="px-3 py-1 bg-teal-600 text-white rounded-md">View</button></td>
                            </tr>

                            <tr className="border-t hover:bg-gray-50">
                              <td className="p-3 flex items-center gap-3"><FaHeartbeat className={`text-${data.systemHealth === 'Good' ? 'green' : 'red'}-500`}/> <span className="font-medium">System Health</span></td>
                              <td className="p-3"><span className={`px-2 py-1 rounded-full text-sm ${data.systemHealth === 'Good' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{data.systemHealth}</span></td>
                              <td className="p-3 text-center">-</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
              <div className="mt-4 flex justify-end">
                <button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50">Close</button>
              </div>
            </div>
          </div>
        );
      };

    const StatTableModal = ({ title, items, onClose }) => {
      const [q, setQ] = useState("");
      const [pageIdx, setPageIdx] = useState(1);
      const [perPage] = useState(10);
      const [sortKey, setSortKey] = useState("-createdAt");

      const filtered = useMemo(() => {
        let list = Array.isArray(items) ? items : [];
        if (q) {
          const qq = q.toLowerCase();
          list = list.filter((c) => {
            const name = (c.name || "").toString().toLowerCase();
            const badge = (c.badge || "").toString().toLowerCase();
            const loc = typeof c.location === "string" ? (c.location || "").toLowerCase() : (((c.location && (c.location.address || c.location.region)) || "") + "").toLowerCase();
            return name.includes(qq) || badge.includes(qq) || loc.includes(qq) || (c._id || "").toLowerCase().includes(qq);
          });
        }

        const [key, dir] = sortKey.startsWith("-") ? [sortKey.slice(1), -1] : [sortKey, 1];
        list = [...list].sort((a, b) => {
          if (key === "createdAt") {
            return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          }
          if (key === "name") {
            return dir * (String(a.name || "").localeCompare(String(b.name || "")));
          }
          if (key === "price") {
            return dir * ((a.price || 0) - (b.price || 0));
          }
          return 0;
        });

        return list;
      }, [items, q, sortKey]);

      const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
      const pageItems = filtered.slice((pageIdx - 1) * perPage, pageIdx * perPage);

      const exportCSV = () => {
        const rows = [
          ["ID", "Name", "Badge", "Location", "Rating", "Price", "Created"],
          ...filtered.map((c) => [
            c._id,
            c.name || "",
            c.badge || "",
            typeof c.location === 'string' ? c.location : (c.location && (c.location.address || c.location.region)) || '',
            c.rating || "",
            c.price || "",
            c.createdAt ? new Date(c.createdAt).toISOString() : "",
          ]),
        ];
        const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      };

      useEffect(() => {
        setPageIdx(1);
      }, [q, sortKey, items]);

      return (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 p-6 overflow-auto">
          <div className="bg-white rounded-2xl w-full max-w-6xl p-6 relative shadow-2xl border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{title} ({filtered.length})</h2>
                <p className="text-sm text-gray-500">Quickly search, sort, page and export the list of camps.</p>
              </div>
              <div className="flex items-center gap-3">
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, badge, location or id" className="px-3 py-2 border rounded-md" />
                <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="px-3 py-2 border rounded-md">
                  <option value="-createdAt">Newest</option>
                  <option value="createdAt">Oldest</option>
                  <option value="name">Name A-Z</option>
                  <option value="-name">Name Z-A</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="price">Price: Low to High</option>
                </select>
                <button onClick={exportCSV} className="px-3 py-2 bg-indigo-600 text-white rounded-md">Export CSV</button>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Camp</th>
                    <th className="p-3 text-left">Location</th>
                    <th className="p-3 text-center">Badge</th>
                    <th className="p-3 text-center">Rating</th>
                    <th className="p-3 text-center">Price</th>
                    <th className="p-3 text-center">Created</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((c) => (
                    <tr key={c._id} className="border-t hover:bg-gray-50">
                      <td className="p-3 flex items-center gap-3">
                        <img src={c.image || (c.images && c.images[0]) || imageFallback} alt={c.name} className="w-12 h-12 rounded-lg object-cover" onError={handleImgError} />
                        <div>
                          <div className="font-semibold">{c.name}</div>
                          <div className="text-xs text-gray-400">ID: {c._id}</div>
                        </div>
                      </td>
                      <td className="p-3">{renderLocation(c.location)}</td>
                      <td className="p-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm ${c.badge ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-400'}`}>{c.badge || '-'}</span>
                      </td>
                      <td className="p-3 text-center">{c.rating ? `⭐ ${c.rating}` : '-'}</td>
                      <td className="p-3 text-center font-semibold">{c.price ? formatETB(c.price) : '-'}</td>
                      <td className="p-3 text-center">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-'}</td>
                      <td className="p-3 text-center">
                        <div className="inline-flex items-center">
                          <ActionMenu camp={c} onView={() => setViewCamp(c)} onEdit={() => handleEdit(c._id)} onDelete={() => requestDelete(c)} onChangeStatus={changeCampStatus} />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pageItems.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-gray-500">No camps found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">Showing {(pageIdx - 1) * perPage + 1} - {Math.min(pageIdx * perPage, filtered.length)} of {filtered.length}</div>
              <div className="flex items-center gap-2">
                <button disabled={pageIdx <= 1} onClick={() => setPageIdx((p) => Math.max(1, p - 1))} className={`px-3 py-1 rounded-md border ${pageIdx <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>Prev</button>
                <div className="px-3 py-1 border rounded-md">{pageIdx} / {totalPages}</div>
                <button disabled={pageIdx >= totalPages} onClick={() => setPageIdx((p) => Math.min(totalPages, p + 1))} className={`px-3 py-1 rounded-md border ${pageIdx >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}>Next</button>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const EditModal = ({ camp, onClose, onSaved }) => {
      const [form, setForm] = useState({
        name: camp.name || "",
        location: normalizeLocationForInput(camp.location),
        price: camp.price || "",
        badge: camp.badge || "",
        image: camp.image || "",
        description: camp.description || "",
        amenities: camp.amenities ? camp.amenities.join(", ") : "",
      });
      const [uploadingImageEdit, setUploadingImageEdit] = useState(false);
      const [uploadedFileNameEdit, setUploadedFileNameEdit] = useState(null);
      const [imgOkEdit, setImgOkEdit] = useState(true);

      const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

      const save = async () => {
        try {
          const payload = {
            ...form,
            price: form.price ? Number(form.price) : 0,
            amenities: form.amenities ? form.amenities.split(",").map((s) => s.trim()).filter(Boolean) : [],
          };

          const res = await API.put(`/campHomeRoutes/${camp._id}`, payload);
          const updated = res?.data?.data || res?.data || payload;
          toast.success(`Camp "${updated.name || payload.name}" updated successfully${updated.price ? ` — ${formatETB(updated.price)}` : ''}`);
          onSaved();
          onClose();
        } catch (err) {
          console.error(err);
          toast.error("Failed to update camp");
        }
      };

      const canSave = (form.name || "").trim() !== "" && (form.location || "").trim() !== "";

      return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl w-full max-w-4xl p-0 relative shadow-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-gray-50 p-4 flex items-center justify-center">
                <div className="w-full">
                  <img src={form.image || imageFallback} alt={form.name} className="w-full h-48 object-cover rounded-lg shadow-sm" onError={handleImgError} crossOrigin="anonymous" referrerPolicy="no-referrer" loading="lazy" />
                  <div className="mt-3">
                    <input className="w-full px-3 py-2 border rounded-md" value={form.image} onChange={(e) => handleChange('image', e.target.value)} placeholder="Image URL" />
                    <div className="mt-2 flex items-center gap-3">
                      <label className="text-sm text-gray-600">Or upload</label>
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files && e.target.files[0];
                        if (!file) return;
                        try {
                          setUploadingImageEdit(true);
                          const fd = new FormData();
                          fd.append('avatar', file);
                          const res = await API.post('/auth/profile/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                          const url = res?.data?.url;
                          if (url) { handleChange('image', url); setUploadedFileNameEdit(file.name); toast.success('Image uploaded'); }
                          else toast.error('Upload succeeded but no URL returned');
                        } catch (err) { console.error(err); toast.error('Failed to upload'); }
                        finally { setUploadingImageEdit(false); }
                      }} />
                      <label className="px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">Choose file</label>
                    </div>
                    {uploadedFileNameEdit && <div className="text-xs text-gray-500 mt-2">{uploadedFileNameEdit}</div>}
                  </div>
                </div>
              </div>

              <div className="md:w-2/3 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Edit Camp</h2>
                    <p className="text-sm text-gray-500">Update camp details and status</p>
                  </div>
                    <div className="flex items-center gap-3">
                      <select value={form.badge} onChange={(e) => handleChange('badge', e.target.value)} className="px-3 py-2 border rounded-md">
                        <option value="">Status</option>
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm text-gray-600">Camp name</label>
                    <input className="w-full mt-1 px-3 py-2 border rounded-md" value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Location</label>
                    <input className="w-full mt-1 px-3 py-2 border rounded-md" value={form.location} onChange={(e) => handleChange('location', e.target.value)} />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Price (ETB)</label>
                    <input className="w-full mt-1 px-3 py-2 border rounded-md" value={form.price} onChange={(e) => handleChange('price', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Status</label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-md" value={form.badge} onChange={(e) => handleChange('badge', e.target.value)}>
                      <option value="">— Select —</option>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-600">Description</label>
                    <textarea className="w-full mt-1 px-3 py-2 border rounded-md" rows={4} value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-600">Amenities</label>
                    <input className="w-full mt-1 px-3 py-2 border rounded-md" value={form.amenities} onChange={(e) => handleChange('amenities', e.target.value)} placeholder="Comma separated" />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                  <button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button onClick={save} disabled={!canSave} className={`px-5 py-2 rounded-md text-white ${!canSave ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>Save changes</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      );
    };

    const NewCampModal = ({ onClose, onCreated }) => {
      const [form, setForm] = useState({
        name: "",
        location: "",
        price: "",
        badge: "",
        image: "",
        description: "",
        amenities: "",
      });
      const [errors, setErrors] = useState({});
      const [imgOk, setImgOk] = useState(true);
      const [uploadingImage, setUploadingImage] = useState(false);
      const [uploadedFileName, setUploadedFileName] = useState(null);

      const handleChange = (k, v) => {
        setForm((f) => ({ ...f, [k]: v }));
        setErrors((e) => ({ ...e, [k]: "" }));
        if (k === "image") setImgOk(true);
      };

      const create = async () => {
        const name = (form.name || "").trim();
        const location = (form.location || "").trim();
        const newErrors = {};
        if (!name) newErrors.name = "Please enter a camp name";
        if (!location) newErrors.location = "Please enter a location";
        if (Object.keys(newErrors).length) {
          setErrors(newErrors);
          toast.error("Please fix the highlighted fields");
          return;
        }

        try {
          const payload = {
            ...form,
            name,
            location,
            price: form.price ? Number(form.price) : 0,
            amenities: form.amenities ? form.amenities.split(",").map((s) => s.trim()).filter(Boolean) : [],
          };

          const res = await API.post(`/campHomeRoutes`, payload);
          const created = res?.data?.data || res?.data || payload;
          toast.success(`Camp "${created.name || payload.name}" created successfully`);
          onCreated && onCreated(created);
          onClose();
        } catch (err) {
          console.error("Create camp failed:", err?.response || err);
          const msg = err?.response?.data?.message || "Failed to create camp";
          toast.error(msg);
        }
      };

      const canCreate = (form.name || "").trim() !== "" && (form.location || "").trim() !== "";

      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 relative shadow-xl">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
            <h2 className="text-2xl font-bold mb-4">Create New Camp</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Camp name</label>
                  <input
                    className={`w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.name ? 'border-red-300' : 'border-gray-200'}`}
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter camp name"
                  />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <input
                      className={`w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.location ? 'border-red-300' : 'border-gray-200'}`}
                      value={form.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder="City, region or address"
                    />
                    {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Price (ETB)</label>
                    <input
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={form.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      placeholder="e.g. 49.99"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Badge</label>
                  <input
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={form.badge}
                    onChange={(e) => handleChange('badge', e.target.value)}
                    placeholder="Adventure, Luxury, Family"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={4}
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Short description for the camp"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Amenities</label>
                  <input
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={form.amenities}
                    onChange={(e) => handleChange('amenities', e.target.value)}
                    placeholder="Comma separated (water, electricity, toilets)"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center md:items-stretch">
                <label className="text-sm font-medium text-gray-700">Image</label>
                <div className="mt-2 w-full">
                  <div className="w-full h-44 rounded-lg border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {form.image && imgOk ? (
                      <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={() => setImgOk(false)} />
                    ) : (
                      <div className="text-center p-4">
                        <FaCloudUploadAlt className="text-3xl text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-500 mt-2">Paste an image URL or upload from your device</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex flex-col gap-2">
                    <input
                      className="w-full px-3 py-2 border rounded-md"
                      value={form.image}
                      onChange={(e) => handleChange('image', e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                    />

                    <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-600">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files && e.target.files[0];
                          if (!file) return;
                          try {
                            setUploadingImage(true);
                            const fd = new FormData();
                            fd.append('avatar', file);
                            const res = await API.post('/auth/profile/avatar', fd, {
                              headers: { 'Content-Type': 'multipart/form-data' },
                            });
                            const url = res?.data?.url;
                            if (url) {
                              handleChange('image', url);
                              setUploadedFileName(file.name);
                              toast.success('Image uploaded and set');
                            } else {
                              toast.error('Upload succeeded but no URL returned');
                            }
                          } catch (err) {
                            console.error('Image upload failed', err?.response || err);
                            toast.error('Failed to upload image');
                          } finally {
                            setUploadingImage(false);
                          }
                        }}
                      />
                      <span className="px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50">Choose file</span>
                      <span className="text-xs text-gray-400">{uploadedFileName || 'No file selected'}</span>
                      {uploadingImage && <span className="text-xs text-gray-500">Uploading…</span>}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button
                onClick={create}
                disabled={!canCreate}
                className={`px-5 py-2 rounded-md text-white ${!canCreate ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              >
                Create Camp
              </button>
            </div>
          </div>
        </div>
      );

    };

    /* ================= STATUS MENU ================= */
    const StatusMenu = ({ camp, onChangeStatus }) => {
      const [open, setOpen] = useState(false);
      const ref = React.useRef();
      useEffect(() => {
        const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
      }, []);

      return (
        <div ref={ref} className="relative inline-block">
          <button onClick={() => setOpen(!open)} className="p-2 rounded-md bg-white hover:bg-gray-50 active:scale-95 transition"><FaEllipsisV className="text-gray-600" /></button>
          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow border z-50 overflow-hidden">
              <button onClick={() => { onChangeStatus(camp, 'Active'); setOpen(false); }} className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-100"> <FaCheckCircle className="text-green-500"/> Active</button>
              <button onClick={() => { onChangeStatus(camp, 'Pending'); setOpen(false); }} className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-100"> <FaClock className="text-orange-500"/> Pending</button>
              <button onClick={() => { onChangeStatus(camp, 'Inactive'); setOpen(false); }} className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-100"> <FaBan className="text-red-500"/> Inactive</button>
            </div>
          )}
        </div>
      );
    };

    /* ================= ACTION MENU (single control) ================= */
    const ActionMenu = ({ camp, onView, onEdit, onDelete, onChangeStatus }) => {
      const [open, setOpen] = useState(false);
      const ref = React.useRef();
      useEffect(() => {
        const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
      }, []);

      return (
        <div ref={ref} className="relative inline-block text-left">
          <button onClick={() => setOpen(!open)} className="p-2 rounded-md bg-white hover:bg-gray-50 active:scale-95 transition flex items-center gap-2 border">
            <FaEllipsisV className="text-gray-600" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow border z-50 overflow-hidden">
              <button onClick={() => { onView && onView(camp); setOpen(false); }} className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-100"><FiEye className="text-blue-500"/> View</button>
              <button onClick={() => { onEdit && onEdit(camp._id); setOpen(false); }} className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-100"><FiEdit className="text-green-600"/> Edit</button>
              <div className="border-t" />
              <button onClick={() => { onChangeStatus && onChangeStatus(camp, 'Active'); setOpen(false); }} className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-100"><FaCheckCircle className="text-green-500"/> Mark Active</button>
              <button onClick={() => { onChangeStatus && onChangeStatus(camp, 'Pending'); setOpen(false); }} className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-100"><FaClock className="text-orange-500"/> Mark Pending</button>
              <button onClick={() => { onChangeStatus && onChangeStatus(camp, 'Inactive'); setOpen(false); }} className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-100"><FaBan className="text-red-500"/> Mark Inactive</button>
              <div className="border-t" />
              <button onClick={() => { onDelete && onDelete(camp); setOpen(false); }} className="flex items-center gap-3 px-4 py-2 w-full text-red-600 hover:bg-red-50"><FiTrash2/> Delete</button>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="flex min-h-screen bg-gray-100 overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 w-full">
          <CampHeader setSidebarOpen={setSidebarOpen} onAdd={() => setCreateOpen(true)} />

          <div className="p-3 sm:p-4 md:p-6">
            {/* ---------------- STATS ---------------- */}
            <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
              {stats.map((s) => (
                <motion.div key={s.title} variants={fadeUp} whileHover={{ scale: 1.03 }} onClick={() => handleStatClick(s.key)} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md">
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">{s.title}</p>
                    <h2 className={`text-lg sm:text-2xl font-bold ${s.color}`}>{s.value}</h2>
                  </div>
                  <div className={`${s.bgColor} p-2 sm:p-3 rounded-xl`}>{s.icon}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* ---------------- FILTERS ---------------- */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white p-4 rounded-xl shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <input placeholder="Search camps..." value={search} onChange={(e) => setSearch(e.target.value)} className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded-lg px-4 py-2 text-sm focus-within:border-green-600">
                <option value="">All Badges</option>
                <option value="Adventure">Adventure</option>
                <option value="Luxury">Luxury</option>
                <option value="Family">Family</option>
                <option value="Budget">Budget</option>
              </select>
              <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} className="border rounded-lg px-4 py-2 text-sm focus-within:border-green-400">
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
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded-lg px-4 py-2 text-sm focus-within:border-green-600">
                <option value="-createdAt">Sort by: Recent</option>
                <option value="name">Name: A-Z</option>
                <option value="-price">Price: High to Low</option>
                <option value="price">Price: Low to High</option>
              </select>
            </motion.div>

            {/* ---------------- TABLE (DESKTOP) ---------------- */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="hidden md:block bg-white rounded-xl shadow-sm overflow-x-auto">
              <table className="min-w-225 w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                  <tr>
                    <th className="p-4">Camp</th>
                    <th>Location</th>
                    <th>Badge</th>
                    <th>Amenities</th>
                    <th>Rating</th>
                    <th>Price</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} className="p-4 text-center">Loading camps...</td></tr>
                  ) : camps.length === 0 ? (
                    <tr><td colSpan={7} className="p-4 text-center text-gray-500">No camps found</td></tr>
                  ) : (
                    camps.map((camp) => (
                      <tr key={camp._id} className="border-t hover:bg-gray-50 transition">
                        <td className="p-4 flex items-center gap-3">
                          <img src={camp.image || (camp.images && camp.images[0]) || imageFallback} alt={camp.name} className="w-12 h-12 rounded-lg object-cover" onError={handleImgError} crossOrigin="anonymous" referrerPolicy="no-referrer" loading="lazy" />
                          <div><p className="font-semibold">{camp.name}</p><p className="text-sm text-gray-400">ID: {camp._id}</p></div>
                        </td>
                        <td>{renderLocation(camp.location)}</td>
                        <td>
                          {camp.statusColor || camp.TextColor ? (
                            <span style={{ backgroundColor: camp.statusColor || undefined, color: camp.TextColor || undefined }} className="px-3 py-1 rounded-full text-sm">
                              {camp.badge || "-"}
                            </span>
                          ) : (
                            <span className={`px-3 py-1 rounded-full text-sm ${camp.badge ? "bg-gray-100 text-gray-700" : "bg-gray-50 text-gray-400"}`}>{camp.badge || "-"}</span>
                          )}
                        </td>
                        <td>{camp.amenities && camp.amenities.length ? camp.amenities.join(", ") : "-"}</td>
                        <td>{camp.rating ? `⭐ ${camp.rating}` : "-"}</td>
                        <td className="font-semibold">{camp.price ? formatETB(camp.price) : "-"}</td>
                        <td className="flex justify-center gap-3 text-xl p-4 items-center">
                          <ActionMenu camp={camp} onView={() => setViewCamp(camp)} onEdit={() => handleEdit(camp._id)} onDelete={() => requestDelete(camp)} onChangeStatus={changeCampStatus} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </motion.div>

            {/* ---------------- MOBILE CARDS ---------------- */}
            <motion.div variants={stagger} initial="hidden" animate="visible" className="md:hidden space-y-4">
              {loading ? (
                <motion.div variants={fadeUp} whileTap={{ scale: 0.97 }} className="bg-white p-4 rounded-xl shadow-sm">Loading camps...</motion.div>
              ) : camps.length === 0 ? (
                <motion.div variants={fadeUp} whileTap={{ scale: 0.97 }} className="bg-white p-4 rounded-xl shadow-sm"><div className="text-center text-gray-500">No camps found</div></motion.div>
              ) : (
                camps.map((camp) => (
                  <motion.div variants={fadeUp} whileTap={{ scale: 0.97 }} key={camp._id} className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:gap-3">
                      <div onClick={() => setViewCamp(camp)} className="flex items-center gap-3 cursor-pointer flex-1">
                        <img src={camp.image || (camp.images && camp.images[0]) || imageFallback} alt={camp.name} className="w-20 h-20 rounded-lg object-cover shrink-0" onError={handleImgError} crossOrigin="anonymous" referrerPolicy="no-referrer" loading="lazy" />
                        <div>
                          <p className="font-semibold">{camp.name}</p>
                          <p className="text-xs text-gray-400">{renderLocation(camp.location)} · {camp.reviews ? `${camp.reviews} reviews` : '-'}</p>
                          {camp.description && (<p className="text-sm text-gray-600 mt-2 line-clamp-2">{camp.description}</p>)}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${camp.badge ? "bg-gray-100 text-gray-700" : "bg-gray-50 text-gray-400"}`}>{camp.badge || "-"}</span>
                        <span className="text-sm text-yellow-700">{camp.rating ? `⭐ ${camp.rating}` : "-"}</span>
                      </div>
                      <div className="text-xs text-gray-400">Added: {new Date(camp.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="truncate">{camp.amenities && camp.amenities.length ? camp.amenities.join(", ") : "-"}</span>
                      <span className="font-semibold">{camp.price ? formatETB(camp.price) : "-"}</span>
                    </div>
                    <div className="flex justify-end gap-3 mt-4 text-lg">
                      <ActionMenu camp={camp} onView={() => setViewCamp(camp)} onEdit={() => handleEdit(camp._id)} onDelete={() => requestDelete(camp)} onChangeStatus={changeCampStatus} />
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>

            {viewCamp && <ViewModal camp={viewCamp} onClose={() => setViewCamp(null)} />}
            {editCamp && <EditModal camp={editCamp} onClose={() => setEditCamp(null)} onSaved={() => { fetchCamps(); fetchStats(); }} />}
            {createOpen && <NewCampModal onClose={() => setCreateOpen(false)} onCreated={() => { fetchCamps(); fetchStats(); }} />}
            {confirmDeleteCamp && (<ConfirmDeleteModal camp={confirmDeleteCamp} onClose={() => setConfirmDeleteCamp(null)} />)}
            {showOverviewModal && (
              <TotalsModal
                data={overviewData}
                onClose={() => setShowOverviewModal(false)}
                onView={(r) => { viewResource(r); setShowOverviewModal(false); }}
              />
            )}
            {showStatTableModal && (
              <StatTableModal
                title={statTableTitle}
                items={statTableItems}
                onClose={() => setShowStatTableModal(false)}
              />
            )}
          </div>
        </main>
      </div>
    );
  };

  export default CampManagement;
