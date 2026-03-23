import { useState } from "react";
import { EnvelopeIcon, PhoneIcon, ClockIcon } from "@heroicons/react/24/outline";
import Sidebar from "../Sidebar/Sidebar";
import toast, { Toaster } from "react-hot-toast";

export default function ContactSupport() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Support request submitted!");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(data.error || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Toast container */}
      <Toaster position="top-right" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Contact Support</h1>

        {/* ================= Support Info Cards ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-5 text-center hover:shadow-lg transition">
            <EnvelopeIcon className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-1 text-gray-800">Email Support</h3>
            <p className="text-gray-600 text-sm">support@ethiocampground.com</p>
          </div>

          <div className="bg-white rounded-xl shadow p-5 text-center hover:shadow-lg transition">
            <PhoneIcon className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-1 text-gray-800">Call Us</h3>
            <p className="text-gray-600 text-sm">+251 956665176 </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5 text-center hover:shadow-lg transition">
            <ClockIcon className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-1 text-gray-800">Support Hours</h3>
            <p className="text-gray-600 text-sm">Mon – Fri, 9:00 AM – 6:00 PM</p>
          </div>
        </div>

        {/* ================= Contact Form ================= */}
        <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto mb-10">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Optional: FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="font-medium text-gray-800">How do I cancel a booking?</h3>
              <p className="text-gray-600 text-sm mt-1">You can cancel via My Trips page at least 24 hours before your visit.</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="font-medium text-gray-800">How can I get a refund?</h3>
              <p className="text-gray-600 text-sm mt-1">Refunds are processed within 5 business days after cancellation.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
