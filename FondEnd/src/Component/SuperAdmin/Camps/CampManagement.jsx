import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { FaCampground, FaCheckCircle, FaClock, FaBan, FaCloudUploadAlt, FaEllipsisV } from "react-icons/fa";

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
  { title: "Total Camps", key: "total", color: "text-blue-600", icon: <FaCampground className="text-blue-600 text-xl md:text-2xl" />, bgColor: "bg-blue-100" },
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

    // Filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [regionFilter, setRegionFilter] = useState("");
    const [minRating, setMinRating] = useState(null);
    const [ratingMode, setRatingMode] = useState(null);
    const [sortBy, setSortBy] = useState("-createdAt");
    const [page, setPage] = useState(1);
    const [limit] = useState(20);

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
        case "total":
          setSearch("");
          setStatusFilter("");
          setRegionFilter("");
          setMinRating(null);
          setRatingMode(null);
          break;
        case "active":
          // show camps whose badge/status is Active
          setSearch("");
          setStatusFilter("Active");
          setRegionFilter("");
          setMinRating(null);
          setRatingMode(null);
          break;
        case "pending":
          // show camps whose badge/status is Pending
          setSearch("");
          setStatusFilter("Pending");
          setRegionFilter("");
          setMinRating(null);
          setRatingMode(null);
          break;
        case "inactive":
          // show camps whose badge/status is Inactive
          setSearch("");
          setStatusFilter("Inactive");
          setRegionFilter("");
          setMinRating(null);
          setRatingMode(null);
          break;
        default:
          break;
      }
    };

    const fetchStats = async () => {
      try {
        const res = await API.get("/campHomeRoutes/all");
        const items = res.data.data || res.data || [];
    const total = items.length;
    // Count by badge/status (case-insensitive)
    const activeCount = items.filter((c) => (c.badge || "").toLowerCase() === "active").length;
    const pendingCount = items.filter((c) => (c.badge || "").toLowerCase() === "pending").length;
    const inactiveCount = items.filter((c) => (c.badge || "").toLowerCase() === "inactive").length;
    const s = { total, active: activeCount, pending: pendingCount, inactive: inactiveCount };
        setStats((prev) => prev.map((p) => ({ ...p, value: s[p.key] ?? 0 })));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load stats");
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
          location: camp.location || "",
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
                  <p className="text-sm text-gray-500 mt-1">Region: {camp.location || '-'} • Badge: {camp.badge || '-'}</p>
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
              <p className="text-sm"><strong>Location:</strong> {camp.location}</p>
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

    const EditModal = ({ camp, onClose, onSaved }) => {
      const [form, setForm] = useState({
        name: camp.name || "",
        location: camp.location || "",
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
                        <td>{camp.location || "-"}</td>
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
                          <p className="text-xs text-gray-400">{camp.location || "-"} · {camp.reviews ? `${camp.reviews} reviews` : '-'}</p>
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
          </div>
        </main>
      </div>
    );
  };

  export default CampManagement;
