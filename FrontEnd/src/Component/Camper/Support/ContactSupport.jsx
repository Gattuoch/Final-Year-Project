import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EnvelopeIcon, PhoneIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useUser } from "../../../context/UserContext";
import api from "../../../services/api";
import Sidebar from "../Sidebar/Sidebar";
import toast, { Toaster } from "react-hot-toast";

export default function ContactSupport() {
  const { user } = useUser();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.fullName || user.firstName + " " + user.lastName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/support", form);
      toast.success(res.data.message || "Support request sent!");
      setForm({ name: user?.fullName || "", email: user?.email || "", subject: "", message: "" });
    } catch (err) {
      console.error("Support error:", err);
      toast.error(err.response?.data?.error || "Failed to send message. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-6 text-gray-800"
        >
          Contact Support
        </motion.h1>

        {/* Info Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10"
        >
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow p-5 text-center hover:shadow-lg transition">
            <EnvelopeIcon className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-1 text-gray-800">Email Support</h3>
            <p className="text-gray-600 text-sm">support@ethiocampground.com</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow p-5 text-center hover:shadow-lg transition">
            <PhoneIcon className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-1 text-gray-800">Call Us</h3>
            <p className="text-gray-600 text-sm">+251 956665176</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow p-5 text-center hover:shadow-lg transition">
            <ClockIcon className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-1 text-gray-800">Support Hours</h3>
            <p className="text-gray-600 text-sm">Mon – Fri, 9:00 AM – 6:00 PM</p>
          </motion.div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto mb-10"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Send us a message</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <motion.div whileHover={{ scale: 1.01 }} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="font-medium text-gray-800">How do I cancel a booking?</h3>
              <p className="text-gray-600 text-sm mt-1">
                You can cancel via My Trips page at least 24 hours before your visit.
              </p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.01 }} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="font-medium text-gray-800">How can I get a refund?</h3>
              <p className="text-gray-600 text-sm mt-1">
                Refunds are processed within 5 business days after cancellation.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
