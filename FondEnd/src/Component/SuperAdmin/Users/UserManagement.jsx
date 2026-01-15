import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import API from "../services/api";
import Sidebar from "../sidebar/Sidebar";
import UserHeader from "./UserHeader";
import { useNavigate } from "react-router-dom";
// import { FaUserPlus } from "react-icons/fa";
import {
  FaUsers,
  FaUserCheck,
  FaUserPlus,
  FaCrown,
  FaUserSlash,
  FaEye,
  FaEdit,
  FaKey,
  FaBan,
  FaTrash,
  FaEllipsisV,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
/* ================= MODAL WRAPPER ================= */
const ModalWrapper = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
    <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
      {children}
    </div>
  </div>
);

/* ================= VIEW USER MODAL ================= */
const ViewUserModal = ({ user, onClose }) => (
  <ModalWrapper onClose={onClose}>
    <h2 className="text-xl font-bold mb-4">User Details</h2>

    {[
      ["Name", user.fullName],
      ["Email", user.email],
      ["Role", user.role],
      ["Status", user.isBanned ? "Banned" : "Active"],
      ["Premium", user.isPremium ? "Yes" : "No"],
    ].map(([k, v]) => (
      <div key={k} className="flex justify-between py-2 border-b">
        <span className="text-gray-500">{k}</span>
        <span className="font-medium">{v}</span>
      </div>
    ))}

    <button onClick={onClose} className="btn-primary w-full mt-4">
      Close
    </button>
  </ModalWrapper>
);

/* ================= EDIT USER MODAL ================= */
const EditUserModal = ({ user, onSave, onClose }) => {
  const [fullName, setFullName] = useState(user.fullName);
  // normalize frontend role values to backend enum values
  const normalizeRole = (r) => {
    if (r === "user") return "camper";
    if (r === "admin") return "system_admin";
    return r;
  };
  const [role, setRole] = useState(normalizeRole(user.role));

  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Edit User</h2>

      <input
        className="input w-full"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <select
        className="input w-full mt-3"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="camper">Camper</option>
        <option value="system_admin">Admin</option>
      </select>

      <div className="flex gap-3 mt-5">
        <button className="btn-secondary w-full" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn-primary w-full"
          onClick={() => onSave({ fullName, role })}
        >
          Save
        </button>
      </div>
    </ModalWrapper>
  );
};

/* ============== CONFIRM DELETE MODAL ============== */
const ConfirmDeleteModal = ({ user, onClose, onConfirm }) => {
  const [confirmText, setConfirmText] = useState("");
  const matches = confirmText.trim() === (user.fullName || "");

  const handleConfirm = async () => {
    const loading = toast.loading(`Deleting "${user.fullName}"...`);
    try {
      await onConfirm(user);
      toast.dismiss(loading);
      toast.success(`Deleted "${user.fullName}"`);
      setConfirmText("");
      onClose();
    } catch (err) {
      toast.dismiss(loading);
      const msg = err?.response?.data?.message || 'Delete failed';
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative bg-white rounded-2xl shadow-lg max-w-md w-full p-6">
        <div className="flex items-start gap-4">
          <div className="bg-red-100 p-3 rounded-full text-red-600">
            <FaTrash />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Delete user</h3>
            <p className="text-sm text-gray-600 mt-1">This will permanently delete <span className="font-medium">{user.fullName}</span>.</p>
            <p className="text-sm text-gray-500 mt-3">Type the user's full name to confirm:</p>
            <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="Type full name to confirm" className="mt-2 w-full border rounded-md px-3 py-2" />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
          <button disabled={!matches} onClick={handleConfirm} className={`px-4 py-2 rounded-md text-white ${!matches ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}>
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ================= RESET PASSWORD MODAL ================= */
const ResetPasswordModal = ({ user, onClose, onInvalidate }) => {
  const [loading, setLoading] = useState(false);

  const handleInvalidate = async () => {
    setLoading(true);
    try {
      await onInvalidate(user);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-2xl shadow-lg max-w-md w-full p-6"
      >
        <div className="flex items-start gap-4">
          <div className="bg-green-100 p-3 rounded-full text-green-600">
            <FaKey />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Temporary password sent</h3>
            <p className="text-sm text-gray-600 mt-2">
              A temporary password has been sent to <span className="font-medium">{user.email}</span>.
            </p>
            <p className="text-sm text-gray-500 mt-3">You can invalidate the temporary password if needed.</p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">Close</button>
          <button
            onClick={handleInvalidate}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}>
            {loading ? 'Invalidating...' : 'Invalidate temporary password'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ================= ACTION MENU ================= */
const MenuItem = ({ icon, label, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-100 ${className}`}
  >
    {icon} {label}
  </button>
);

const ActionMenu = ({ user, actions }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-gray-100"
      >
        <FaEllipsisV />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow border z-50">
          <MenuItem icon={<FaEye />} label="View" onClick={actions.view} />
          <MenuItem icon={<FaEdit />} label="Edit" onClick={actions.edit} />
          <MenuItem
            icon={<FaKey />}
            label="Reset Password"
            onClick={actions.reset}
          />
          <MenuItem
            icon={<FaCrown />}
            label={user.isPremium ? "Remove Premium" : "Make Premium"}
            onClick={actions.premium}
          />
          <MenuItem
            icon={<FaBan />}
            label={user.isBanned ? "Unban User" : "Ban User"}
            onClick={actions.ban}
          />
          <MenuItem
            icon={<FaTrash />}
            label="Delete"
            onClick={actions.delete}
            className="text-red-600 hover:bg-red-50"
          />
        </div>
      )}
    </div>
  );
};

/* ================= MAIN ================= */

export default function UserManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [resetUser, setResetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      const res = await API.get("/usersuperadmindashboard/users");
      setUsers(res.data.users);
      setFilteredUsers(res.data.users);
    } catch (error) {
      console.error("Failed to load users", error);
    }
  };
  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    loadDashboard();
  }, []);

  /* ================= LOAD DASHBOARD ================= */

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsRes, growthRes, distRes, usersRes] = await Promise.all([
        API.get("/usersuperadmindashboard/stats"),
        API.get("/usersuperadmindashboard/growth"),
        API.get("/usersuperadmindashboard/distribution"),
        API.get("/usersuperadmindashboard/users"),
      ]);

      setStats([
        {
          title: "Total Users",
          value: statsRes.data.totalUsers,
          filter: "all",
          icon: <FaUsers />,
          color: "text-blue-600",
          bg: "bg-blue-100",
        },
        {
          title: "Active Users",
          value: statsRes.data.activeUsers,
          filter: "active",
          icon: <FaUserCheck />,
          color: "text-green-600",
          bg: "bg-green-100",
        },
        {
          title: "New (30d)",
          value: statsRes.data.newUsers,
          filter: "new",
          icon: <FaUserPlus />,
          color: "text-purple-600",
          bg: "bg-purple-100",
        },
        {
          title: "Premium",
          value: statsRes.data.premiumUsers,
          filter: "premium",
          icon: <FaCrown />,
          color: "text-yellow-600",
          bg: "bg-yellow-100",
        },
        {
          title: "Banned",
          value: statsRes.data.bannedUsers,
          filter: "banned",
          icon: <FaUserSlash />,
          color: "text-red-600",
          bg: "bg-red-100",
        },
      ]);

      setGrowthData(growthRes.data);

      const colors = ["#3b82f6", "#22c55e", "#a855f7", "#ef4444"];
      setPieData(distRes.data.map((d, i) => ({ ...d, color: colors[i] })));

      setUsers(usersRes.data.users);
      setFilteredUsers(usersRes.data.users);
    } catch (e) {
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */

  const applyFilter = (filter, list = users) => {
    setCurrentFilter(filter);

    if (filter === "all") return setFilteredUsers(list);
    if (filter === "active")
      return setFilteredUsers(list.filter((u) => !u.isBanned));
    if (filter === "premium")
      return setFilteredUsers(list.filter((u) => u.isPremium));
    if (filter === "banned")
      return setFilteredUsers(list.filter((u) => u.isBanned));
    if (filter === "new") {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      return setFilteredUsers(list.filter((u) => new Date(u.createdAt) >= d));
    }
  };

  /* ================= UPDATE LOCAL ================= */

  const updateUser = (id, changes) => {
    const updated = users.map((u) => (u._id === id ? { ...u, ...changes } : u));
    setUsers(updated);
    applyFilter(currentFilter, updated);
  };

  /* ================= ACTIONS ================= */

  const handleResetPassword = async (user) => {
    const loading = toast.loading(`Sending temporary password to ${user.email}...`);
    try {
      await API.post(`/usersadmin/${user._id}/reset-password`);
      toast.dismiss(loading);
      toast.success("Temporary password sent to user email");
      // open modal that gives revoke option
      setResetUser(user);
    } catch (err) {
      toast.dismiss(loading);
      const msg = err?.response?.data?.message || "Failed to send temporary password";
      toast.error(msg);
    }
  };

  const performInvalidate = async (user) => {
    const loading = toast.loading(`Invalidating temporary password for ${user.email}...`);
    try {
      // backend currently may not have this endpoint; attempt delete and show graceful error if missing
      await API.delete(`/usersadmin/${user._id}/temp-password`);
      toast.dismiss(loading);
      toast.success("Temporary password invalidated");
      setResetUser(null);
    } catch (err) {
      toast.dismiss(loading);
      const msg = err?.response?.data?.message || "Failed to invalidate (endpoint may be missing)";
      toast.error(msg);
    }
  };

  const handleTogglePremium = async (user) => {
    updateUser(user._id, { isPremium: !user.isPremium });
    try {
      await API.put(`/usersadmin/${user._id}/premium`);
    } catch {
      updateUser(user._id, { isPremium: user.isPremium });
    }
  };

  const handleBanToggle = async (user) => {
    updateUser(user._id, { isBanned: !user.isBanned });
    try {
      await API.put(`/usersadmin/${user._id}/ban`);
    } catch {
      updateUser(user._id, { isBanned: user.isBanned });
    }
  };

  const handleDelete = async (user) => {
    // kept for backward compatibility; prefer opening modal
    if (!window.confirm(`Delete ${user.fullName}?`)) return;
    try {
      await API.delete(`/usersadmin/${user._id}`);
    } catch (err) {
      console.error(err);
    }
    const updated = users.filter((u) => u._id !== user._id);
    setUsers(updated);
    applyFilter(currentFilter, updated);
  };

  const performDelete = async (user) => {
    await API.delete(`/usersadmin/${user._id}`);
    const updated = users.filter((u) => u._id !== user._id);
    setUsers(updated);
    applyFilter(currentFilter, updated);
  };

  /* ================= ACTION MENU ================= */

  const ActionMenu = ({ user }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
      const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
      document.addEventListener("mousedown", close);
      return () => document.removeEventListener("mousedown", close);
    }, []);

    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="p-3 hover:bg-gray-100 rounded-lg"
        >
          <FaEllipsisV />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow border z-50">
            <MenuItem
              icon={<FaEye />}
              label="View"
              onClick={() => setViewUser(user)}
            />
            <MenuItem
              icon={<FaEdit />}
              label="Edit"
              onClick={() => setEditUser(user)}
            />
            <MenuItem
              icon={<FaKey />}
              label="Reset Password"
              onClick={() => handleResetPassword(user)}
            />
            <MenuItem
              icon={<FaCrown />}
              label={user.isPremium ? "Remove Premium" : "Make Premium"}
              onClick={() => handleTogglePremium(user)}
            />
            <MenuItem
              icon={<FaBan />}
              label={user.isBanned ? "Unban User" : "Ban User"}
              onClick={() => handleBanToggle(user)}
            />
            <MenuItem
              icon={<FaTrash />}
              label="Delete"
              onClick={() => setDeleteUser(user)}
              className="text-red-600 hover:bg-red-50"
            />
          </div>
        )}
      </div>
    );
  };

  const MenuItem = ({ icon, label, onClick, className = "" }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-100 ${className}`}
    >
      {icon} {label}
    </button>
  );

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1">
        <UserHeader setSidebarOpen={setSidebarOpen} />
        {/* <div className="p-6 flex justify-end">
          <button
            onClick={() => navigate("/super-admin/create-system-admin")}
            className="btn-primary flex items-center gap-2 text-green-700 cursor-pointer"
          >
            <FaUserPlus /> Create System Admin
          </button>
        </div> */}

        {/* STATS */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((s, i) => (
            <div
              key={i}
              onClick={() => applyFilter(s.filter)}
              className="group bg-white p-4 rounded-xl shadow 
                 flex justify-between cursor-pointer 
                 transition hover:bg-green-700 hover:text-white"
            >
              <div>
                <p className="text-gray-500 text-sm transition group-hover:text-white">
                  {s.title}
                </p>
                <h2 className="text-2xl font-bold transition group-hover:text-white">
                  {s.value}
                </h2>
              </div>

              <div
                className={`p-3 rounded-xl text-xl transition 
        ${s.bg} ${s.color} group-hover:bg-white group-hover:text-green-700`}
              >
                {s.icon}
              </div>
            </div>
          ))}
        </div>

        {/* ================= CHARTS ================= */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow">
            <h3 className="font-semibold mb-4">User Growth</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-semibold mb-4">User Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label={({ value }) => `${value}%`}
                >
                  {pieData.map((p, i) => (
                    <Cell key={i} fill={p.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MOBILE USERS */}
        <div className="p-6 space-y-4 md:hidden">
          {filteredUsers.map((u) => (
            <div
              key={u._id}
              className="bg-white p-4 rounded-xl shadow flex justify-between"
            >
              <div>
                <h3 className="font-bold">{u.fullName}</h3>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
              <ActionMenu
                user={u}
                onView={() => setViewUser(u)}
                onEdit={() => setEditUser(u)}
                onReset={() => handleResetPassword(u)}
                onPremium={() => API.put(`/usersadmin/${u._id}/premium`)}
                onBan={() => API.put(`/usersadmin/${u._id}/ban`)}
                onDelete={() => API.delete(`/usersadmin/${u._id}`)}
              />
            </div>
          ))}
        </div>

        {/* DESKTOP TABLE */}
        <div className="p-6 hidden md:block bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full min-w-225">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-center">Role</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-4">{u.fullName}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4 text-center">{u.role}</td>
                  <td className="p-4 text-center">
                    {u.isBanned ? "Banned" : "Active"}
                  </td>
                  <td className="p-4 text-center">
                    <ActionMenu
                      user={u}
                      onView={() => setViewUser(u)}
                      onEdit={() => setEditUser(u)}
                      onReset={() => handleResetPassword(u)}
                      onPremium={() => API.put(`/usersadmin/${u._id}/premium`)}
                      onBan={() => API.put(`/usersadmin/${u._id}/ban`)}
                      onDelete={() => API.delete(`/usersadmin/${u._id}`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {viewUser && (
          <ViewUserModal user={viewUser} onClose={() => setViewUser(null)} />
        )}
        {editUser && (
          <EditUserModal
            user={editUser}
            onClose={() => setEditUser(null)}
            onSave={async (changes) => {
              try {
                await API.put(`/usersadmin/${editUser._id}`, changes);
                updateUser(editUser._id, changes);
                toast.success("User updated");
                setEditUser(null);
              } catch (err) {
                console.error(err);
                toast.error("Failed to update user");
              }
            }}
          />
        )}
        {deleteUser && (
          <ConfirmDeleteModal user={deleteUser} onClose={() => setDeleteUser(null)} onConfirm={performDelete} />
        )}
        {resetUser && (
          <ResetPasswordModal
            user={resetUser}
            onClose={() => setResetUser(null)}
            onInvalidate={performInvalidate}
          />
        )}
      </main>
    </div>
  );
}
