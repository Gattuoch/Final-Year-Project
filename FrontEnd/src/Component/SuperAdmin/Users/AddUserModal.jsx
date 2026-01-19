import { useState } from "react";
import { FiX, FiCopy } from "react-icons/fi";
import API from "../services/api";
import toast from "react-hot-toast";

export default function AddUserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [errorMgs, setErrorMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // POST to backend users create endpoint
      const res = await API.post("/users/create", form);
      const tempPassword = res?.data?.tempPassword;
      const user = res?.data?.user;

      if (tempPassword) {
        // show a small confirmation with the temp password and allow copy
        setCreatedUser(user || null);
        setTempPassword(tempPassword);
        setCreated(true);
      } else {
        // no temp password returned - just close and notify
        toast.success(res?.data?.message || "User created");
        onSuccess && onSuccess();
        onClose && onClose();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const [created, setCreated] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);
  const [tempPassword, setTempPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const handleDone = () => {
    onSuccess && onSuccess();
    onClose && onClose();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tempPassword);
      toast.success("Password copied to clipboard");
      setCopied(true);
      // reset copied status after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add New User</h2>
          <button onClick={onClose}>
            <FiX />
          </button>
        </div>

        {errorMgs && <p className="text-red-500 text-sm mb-2">{errorMgs}</p>}

        {!created ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              required
              className="w-full border rounded-lg px-4 py-2"
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              className="w-full border rounded-lg px-4 py-2"
              onChange={handleChange}
            />
            <select
              name="role"
              className="w-full border rounded-lg px-4 py-2"
              onChange={handleChange}
            >
              <option value="user">Camper</option>
              <option value="admin">Admin</option>
              <option value="system_admin">System Admin</option>
            </select>

            <button
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-md border">
              <p className="text-sm text-gray-700">User created successfully</p>
              {createdUser && (
                <p className="text-sm text-gray-600">Name: <span className="font-medium">{createdUser.fullName || createdUser.name || '-'}</span></p>
              )}
              {createdUser && (
                <p className="text-sm text-gray-600">Email: <span className="font-medium">{createdUser.email || '-'}</span></p>
              )}
              <div className="mt-3 p-3 bg-white rounded-md border flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Temporary password</p>
                  <p className="font-mono text-sm mt-1">{tempPassword}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleCopy} className="px-3 py-2 bg-gray-100 rounded-md flex items-center gap-2">
                    <FiCopy /> {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button onClick={handleDone} className="px-3 py-2 bg-green-600 text-white rounded-md">Done</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
