import React, { useState } from "react";
import contactImage from "../../../assets/Contact-image.png";

export default function ContactFormSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        alert("Message sent successfully!");

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "General Inquiry",
          message: "",
        });
      } else {
        alert("Something went wrong. Try again.");
      }
    } catch (error) {
      alert("Server error: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="w-full bg-white py-20 px-6">
      {/* SECTION TITLE */}
      <h2 className="text-center text-4xl md:text-5xl font-extrabold text-gray-900 mb-16">
        Send Us a Message
      </h2>

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
        {/* LEFT — IMAGE */}
        <div>
          <img
            src={contactImage}
            alt="Office Building"
            className="rounded-2xl shadow-xl w-full object-cover"
          />
        </div>

        {/* RIGHT — FORM */}
        <div className="bg-gray-50 p-10 rounded-2xl shadow-md">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* NAME FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-700 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-700 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-700 focus:outline-none"
                required
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+251 912 345 678"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-700 focus:outline-none"
              />
            </div>

            {/* SUBJECT */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-700 focus:outline-none"
              >
                <option>General Inquiry</option>
                <option>Booking Support</option>
                <option>Camp Partnership</option>
                <option>Technical Issue</option>
                <option>Feedback</option>
              </select>
            </div>

            {/* MESSAGE */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Tell us how we can help you..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-700 focus:outline-none"
                required
              ></textarea>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-800 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-900 transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
