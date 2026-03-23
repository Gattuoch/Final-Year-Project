import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CalendarDaysIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BuildingOffice2Icon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

import Sidebar from "../Sidebar/Sidebar";
import ReservationHeader from "./ReservationHeader";

export default function MyReservations() {
  // ✅ Initialize as empty array to prevent "undefined" errors
  const [bookings, setBookings] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stats State
  const [stats, setStats] = useState({
    active: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  });

  // Fetch Bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await axios.get("http://localhost:5000/api/bookings/my-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ FIX 1: Robust Data Handling
        // If res.data.data is undefined, fallback to empty array []
        const allBookings = Array.isArray(res.data.data) ? res.data.data : [];
        
        setBookings(allBookings);

        // ✅ FIX 2: Safely Calculate Stats
        const today = new Date();
        const active = allBookings.filter(b => b.status === "confirmed" && new Date(b.checkIn) <= today && new Date(b.checkOut) >= today).length;
        const upcoming = allBookings.filter(b => b.status === "confirmed" && new Date(b.checkIn) > today).length;
        const completed = allBookings.filter(b => b.status === "completed" || (b.status === "confirmed" && new Date(b.checkOut) < today)).length;
        const cancelled = allBookings.filter(b => b.status === "cancelled").length;

        setStats({ active, upcoming, completed, cancelled });

      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load reservations.");
        setBookings([]); // Prevent crash on error
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // ✅ FIX 3: Robust Filter Helper
  const getFilteredBookings = (type) => {
    if (!Array.isArray(bookings)) return []; // Safety check

    const today = new Date();
    return bookings.filter((b) => {
      if (!b) return false;
      const start = new Date(b.checkIn);
      const end = new Date(b.checkOut);

      if (type === "active") return b.status === "confirmed" && start <= today && end >= today;
      if (type === "upcoming") return b.status === "confirmed" && start > today;
      if (type === "completed") return b.status === "completed" || (b.status === "confirmed" && end < today);
      if (type === "cancelled") return b.status === "cancelled";
      return false;
    });
  };

  const activeBookings = getFilteredBookings("active");
  const upcomingBookings = getFilteredBookings("upcoming");
  const completedBookings = getFilteredBookings("completed");
  const cancelledBookings = getFilteredBookings("cancelled");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-10 overflow-y-auto">
        <ReservationHeader />

        {/* ================= Stats ================= */}
        <section className="mt-6 grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <StatCard title="Active Reservations" value={stats.active} color="blue" icon={<ClipboardDocumentCheckIcon />} />
          <StatCard title="Upcoming Bookings" value={stats.upcoming} color="yellow" icon={<ClockIcon />} />
          <StatCard title="Completed Visits" value={stats.completed} color="green" icon={<CheckCircleIcon />} />
          <StatCard title="Cancelled Bookings" value={stats.cancelled} color="red" icon={<XCircleIcon />} />
        </section>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading reservations...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : (
          <>
            {/* ================= Active ================= */}
            {activeBookings.length > 0 && (
              <Section title="Active Reservations">
                {activeBookings.map((b) => (
                  <BookingCard key={b._id} booking={b} status="Active" badgeColor="blue" />
                ))}
              </Section>
            )}

            {/* ================= Upcoming ================= */}
            {upcomingBookings.length > 0 && (
              <Section title="Upcoming Bookings">
                {upcomingBookings.map((b) => (
                  <BookingCard key={b._id} booking={b} status="Upcoming" badgeColor="yellow" />
                ))}
              </Section>
            )}

            {/* ================= Completed ================= */}
            {completedBookings.length > 0 && (
              <Section title="Completed Visits">
                {completedBookings.map((b) => (
                  <BookingCard key={b._id} booking={b} status="Completed" badgeColor="green" />
                ))}
              </Section>
            )}

            {/* ================= Cancelled ================= */}
            {cancelledBookings.length > 0 && (
              <Section title="Cancelled Bookings">
                {cancelledBookings.map((b) => (
                  <BookingCard key={b._id} booking={b} status="Cancelled" badgeColor="red" />
                ))}
              </Section>
            )}

            {bookings.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                You have no reservations yet.
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

/* ================= Section ================= */
function Section({ title, children }) {
  return (
    <section className="mt-10 animate-fade-up">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
        {title}
      </h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

/* ================= Stat Card ================= */
function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md animate-scale-in hover:scale-[1.02] transition-transform duration-200">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <div className="w-6 h-6">{icon}</div>
      </div>
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-3">{value}</h3>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );
}

/* ================= Dynamic Booking Card ================= */
function BookingCard({ booking, status, badgeColor }) {
  // Safe Accessor for Camp Name and Location
  // Check both campId (old structure) and tentId (new structure) to find the name
  const campName = booking.tentId?.name || booking.campId?.name || "Unknown Camp";
  const location = booking.campId?.location?.address || "Ethiopia";
  const checkIn = new Date(booking.checkIn).toLocaleDateString();
  const checkOut = new Date(booking.checkOut).toLocaleDateString();
  const bookingId = booking._id ? booking._id.slice(-6).toUpperCase() : "###";

  const badgeStyles = {
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm animate-fade-up hover:shadow-md transition-shadow duration-200 border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-3">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${badgeStyles[badgeColor] || "bg-gray-100"}`}>
            <BuildingOffice2Icon className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">{campName}</h3>
              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${badgeStyles[badgeColor]}`}>
                {status}
              </span>
            </div>
            <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <MapPinIcon className="w-4 h-4" />
              {location}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {booking.guests} Guests • {booking.tentId ? "Tent" : "Standard"}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Booking ID</p>
          <p className="font-mono font-semibold text-gray-700">#{bookingId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
        <InfoBox label="Check-in" value={checkIn} />
        <InfoBox label="Check-out" value={checkOut} />
        <InfoBox label="Payment" value={booking.paymentStatus === "paid" ? "Paid" : "Pending"} />
      </div>

      <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarDaysIcon className="w-4 h-4 text-green-600" />
          {checkIn} <span className="text-gray-300">→</span> {checkOut}
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-bold text-green-700">
            {booking.totalPrice?.toLocaleString()} ETB
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= Info Box ================= */
function InfoBox({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-semibold text-sm text-gray-800">{value}</p>
    </div>
  );
}