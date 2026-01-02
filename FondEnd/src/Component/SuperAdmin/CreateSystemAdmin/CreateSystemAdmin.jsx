import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserShield } from "react-icons/fa";
import { createSystemAdmin } from "../../services/admin.service";

export default function CreateSystemAdmin() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(null);

    if (!form.name || (!form.email && !form.phone)) {
      return setError("Name and Email or Phone are required");
    }

    // try {
    //   setLoading(true);
    //   const res = await createSystemAdmin(form);

    //   setSuccess(res.data);
    //   setForm({ name: "", email: "", phone: "" });
    // } catch (err) {
    //   setError(
    //     err.response?.data?.message || "Failed to create system admin"
    //   );
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-xl shadow-md p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-xl">
            <FaUserShield className="text-blue-600 text-xl" />
          </div>
          <h2 className="text-lg font-semibold text-gray-700">
            Create System Admin
          </h2>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="bg-green-100 text-green-700 text-sm p-3 rounded mb-4">
            <p className="font-semibold mb-1">
              System Admin Created Successfully
            </p>
            <p>Email: {success.credentials.email}</p>
            <p>
              Temporary Password:{" "}
              <span className="font-bold">
                {success.credentials.temporaryPassword}
              </span>
            </p>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 text-sm"
          />

          <input
            type="email"
            name="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 text-sm"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create System Admin"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
