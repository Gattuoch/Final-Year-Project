import React, { useState, useEffect } from "react";
import {
  CalendarDaysIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BuildingOffice2Icon,
  ExclamationCircleIcon, // for pending
} from "@heroicons/react/24/outline";
import { useUser } from "../../../context/UserContext";
import api from "../../../services/api";
import Sidebar from "../Sidebar/Sidebar";
import ReservationHeader from "./ReservationHeader";
import toast from "react-hot-toast";

export default function MyReservations() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("active"); // default active
  const [stats, setStats] = useState({
    active: 0,
    upcoming: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/my-bookings");
        const allBookings = Array.isArray(res.data?.bookings) ? res.data.bookings : [];
        setBookings(allBookings);

        const today = new Date();
        const active = allBookings.filter(
          (b) => b.status === "confirmed" && new Date(b.checkInDate) <= today && new Date(b.checkOutDate) >= today
        ).length;
        const upcoming = allBookings.filter(
          (b) => b.status === "confirmed" && new Date(b.checkInDate) > today
        ).length;
        const pending = allBookings.filter(
          (b) => b.paymentStatus !== "paid" && b.status !== "cancelled"
        ).length;
        const completed = allBookings.filter(
          (b) => b.status === "completed" || (b.status === "confirmed" && new Date(b.checkOutDate) < today)
        ).length;
        const cancelled = allBookings.filter((b) => b.status === "cancelled").length;

        setStats({ active, upcoming, pending, completed, cancelled });
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load reservations.");
        toast.error("Could not load your bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getFilteredBookings = (type) => {
    if (!Array.isArray(bookings) || bookings.length === 0) return [];
    const today = new Date();
    return bookings.filter((b) => {
      const start = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      if (type === "active") return b.status === "confirmed" && start <= today && end >= today;
      if (type === "upcoming") return b.status === "confirmed" && start > today;
      if (type === "pending") return b.paymentStatus !== "paid" && b.status !== "cancelled";
      if (type === "completed") return b.status === "completed" || (b.status === "confirmed" && end < today);
      if (type === "cancelled") return b.status === "cancelled";
      return false;
    });
  };

  const activeBookings = getFilteredBookings("active");
  const upcomingBookings = getFilteredBookings("upcoming");
  const pendingBookings = getFilteredBookings("pending");
  const completedBookings = getFilteredBookings("completed");
  const cancelledBookings = getFilteredBookings("cancelled");

  const handleStatClick = (filter) => {
    setSelectedFilter(filter);
  };

  // Determine which section to show based on selected filter
  const renderSection = () => {
    switch (selectedFilter) {
      case "active":
        return activeBookings.length > 0 ? (
          <Section title="Active Reservations">
            {activeBookings.map((b) => (
              <BookingCard key={b._id} booking={b} status="Active" badgeColor="blue" />
            ))}
          </Section>
        ) : (
          <EmptyState message="No active reservations." />
        );
      case "upcoming":
        return upcomingBookings.length > 0 ? (
          <Section title="Upcoming Bookings">
            {upcomingBookings.map((b) => (
              <BookingCard key={b._id} booking={b} status="Upcoming" badgeColor="yellow" />
            ))}
          </Section>
        ) : (
          <EmptyState message="No upcoming bookings." />
        );
      case "pending":
        return pendingBookings.length > 0 ? (
          <Section title="Pending Bookings">
            {pendingBookings.map((b) => (
              <BookingCard key={b._id} booking={b} status="Pending" badgeColor="orange" />
            ))}
          </Section>
        ) : (
          <EmptyState message="No pending bookings." />
        );
      case "completed":
        return completedBookings.length > 0 ? (
          <Section title="Completed Visits">
            {completedBookings.map((b) => (
              <BookingCard key={b._id} booking={b} status="Completed" badgeColor="green" />
            ))}
          </Section>
        ) : (
          <EmptyState message="No completed visits." />
        );
      case "cancelled":
        return cancelledBookings.length > 0 ? (
          <Section title="Cancelled Bookings">
            {cancelledBookings.map((b) => (
              <BookingCard key={b._id} booking={b} status="Cancelled" badgeColor="red" />
            ))}
          </Section>
        ) : (
          <EmptyState message="No cancelled bookings." />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-10 overflow-y-auto">
          <ReservationHeader />
          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-5 gap-4 sm:gap-6 mt-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-xl mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-10 overflow-y-auto">
          <ReservationHeader />
          <div className="text-center py-20 text-red-500">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-10 overflow-y-auto">
        <ReservationHeader />

        {/* Stats Cards - Now 5 cards, clickable */}
        <section className="mt-6 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          <StatCard
            title="Active Reservations"
            value={stats.active}
            icon={<ClockIcon />}
            color="blue"
            isActive={selectedFilter === "active"}
            onClick={() => handleStatClick("active")}
          />
          <StatCard
            title="Upcoming Bookings"
            value={stats.upcoming}
            icon={<CalendarDaysIcon />}
            color="yellow"
            isActive={selectedFilter === "upcoming"}
            onClick={() => handleStatClick("upcoming")}
          />
          <StatCard
            title="Pending Bookings"
            value={stats.pending}
            icon={<ExclamationCircleIcon />}
            color="orange"
            isActive={selectedFilter === "pending"}
            onClick={() => handleStatClick("pending")}
          />
          <StatCard
            title="Completed Visits"
            value={stats.completed}
            icon={<CheckCircleIcon />}
            color="green"
            isActive={selectedFilter === "completed"}
            onClick={() => handleStatClick("completed")}
          />
          <StatCard
            title="Cancelled Bookings"
            value={stats.cancelled}
            icon={<XCircleIcon />}
            color="red"
            isActive={selectedFilter === "cancelled"}
            onClick={() => handleStatClick("cancelled")}
          />
        </section>

        {/* Dynamic Section based on selected filter */}
        <div className="mt-8">{renderSection()}</div>
      </main>
    </div>
  );
}

// Section Component
function Section({ title, children }) {
  return (
    <section className="animate-fade-up">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

// Empty State Component
function EmptyState({ message }) {
  return (
    <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100">
      {message}
    </div>
  );
}

// Stat Card Component (clickable)
function StatCard({ title, value, icon, color, isActive, onClick }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
  };

  const activeBorder = isActive ? "ring-2 ring-green-500 ring-offset-2" : "";

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md animate-scale-in hover:scale-[1.02] transition-all duration-200 cursor-pointer ${activeBorder}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <div className="w-6 h-6">{icon}</div>
      </div>
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-3">{value}</h3>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );
}

// Booking Card Component (unchanged but included for completeness)
function BookingCard({ booking, status, badgeColor }) {
  const campName = booking.tentId?.name || booking.campId?.name || "Unknown Camp";
  const location = booking.campId?.location?.address || "Ethiopia";
  const checkIn = new Date(booking.checkIn).toLocaleDateString();
  const checkOut = new Date(booking.checkOut).toLocaleDateString();
  const bookingId = booking._id ? booking._id.slice(-6).toUpperCase() : "###";

  const badgeStyles = {
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    orange: "bg-orange-100 text-orange-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm animate-fade-up hover:shadow-md transition-shadow duration-200 border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-3">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              badgeStyles[badgeColor] || "bg-gray-100"
            }`}
          >
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
          <p className="text-lg font-bold text-green-700">{booking.totalPrice?.toLocaleString()} ETB</p>
        </div>
      </div>
    </div>
  );
}

// Info Box Component
function InfoBox({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-semibold text-sm text-gray-800">{value}</p>
    </div>
  );
}