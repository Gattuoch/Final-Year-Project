import React from "react";
import contactImage from '../../../assets/Contact-image.png'

export default function ContactFormSection() {
  return (
    <div className="w-full bg-white py-20 px-6">
      
      {/* SECTION TITLE */}
      <h2 className="text-center text-4xl md:text-5xl font-extrabold text-gray-900 mb-16">
        Send Us a Message
      </h2>

      {/* MAIN GRID (IMAGE + FORM) */}
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

          {/* FORM */}
          <form className="space-y-6">

            {/* NAME FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-700 focus:outline-none"
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
                placeholder="john.doe@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-700 focus:outline-none"
              />
            </div>

            {/* PHONE NUMBER */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="text"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-700 focus:outline-none"
              >
                <option>General Inquiry</option>
                <option>Booking Support</option>
                <option> Camp Partnership</option>
                <option>Technical Issue </option>
                <option> Feedback </option>
              </select>
            </div>

            {/* MESSAGE */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Message
              </label>
              <textarea
                rows="5"
                placeholder="Tell us how we can help you..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-700 focus:outline-none"
              ></textarea>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full bg-green-800 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-900 transition"
            >
              Send Message
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}
