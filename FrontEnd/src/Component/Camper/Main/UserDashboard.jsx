import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaQrcode } from "react-icons/fa";

export default function UserDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/bookings/my-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setTickets(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT SECTION: TICKET LIST */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Tickets
            </h2>
            <button className="text-emerald-600 font-medium hover:underline">
              View All
            </button>
          </div>

          {loading ? (
            <p className="text-gray-500 text-center py-10">Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed">
              No tickets found. Book a trip to see them here!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {tickets.map((ticket) => (
                <TicketCard
                  key={ticket._id}
                  status={ticket.status === 'confirmed' ? "Active" : ticket.status}
                  // Dynamic Color Logic
                  statusColor={
                    ticket.status === 'confirmed' ? "bg-green-100 text-green-700" :
                    ticket.status === 'completed' ? "bg-gray-100 text-gray-600" :
                    ticket.status === 'cancelled' ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }
                  title={ticket.tentId?.name || "Campsite Entry"}
                  park={ticket.campId?.name || "Unknown Park"}
                  date={new Date(ticket.checkIn).toLocaleDateString()}
                  price={`${ticket.totalPrice} ETB`}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANEL: PROMO / QR PREVIEW */}
        <div className="bg-gradient-to-br from-emerald-600 to-green-500 rounded-2xl shadow-lg p-8 text-white flex flex-col justify-between h-64 lg:h-auto">
          <div>
            <h3 className="text-2xl font-bold mb-2">My Wallet</h3>
            <p className="opacity-90">Scan your QR code at the gate for quick entry.</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl self-start mt-4">
            <FaQrcode className="text-4xl text-white" />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= TICKET CARD ================= */

function TicketCard({
  status,
  statusColor,
  title,
  park,
  date,
  price,
}) {
  return (
    <div className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition bg-white">
      <div className="flex justify-between items-start mb-4">
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${statusColor}`}
        >
          {status}
        </span>
        <FaQrcode className="text-gray-300 hover:text-gray-600 transition cursor-pointer text-lg" />
      </div>

      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{title}</h3>
      <p className="text-gray-500 text-sm mt-1 line-clamp-1">{park}</p>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50 text-sm">
        <span className="text-gray-500 flex items-center gap-2 font-medium">
          📅 {date}
        </span>
        <span className="font-bold text-gray-900">{price}</span>
      </div>
    </div>
  );
}