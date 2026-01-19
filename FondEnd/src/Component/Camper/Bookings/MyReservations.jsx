import {
  CalendarDaysIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BuildingOffice2Icon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { CalendarIcon } from "@heroicons/react/24/outline";

import Sidebar from "../Sidebar/Sidebar";
import ReservationHeader from "./ReservationHeader";

export default function MyReservations() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-10">
        <ReservationHeader />

        {/* ================= Stats ================= */}
        <section className="mt-6 grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <StatCard title="Active Reservations" value="3" color="blue" icon={<ClipboardDocumentCheckIcon />} />
          <StatCard title="Upcoming Bookings" value="5" color="yellow" icon={<ClockIcon />} />
          <StatCard title="Completed Visits" value="24" color="green" icon={<CheckCircleIcon />} />
          <StatCard title="Cancelled Bookings" value="2" color="red" icon={<XCircleIcon />} />
        </section>

        {/* ================= Active ================= */}
        <Section title="Active Reservations">
          <BookingCard
            type="active"
            name="Mountain View Hotel"
            bookingId="#R123456"
            room="Deluxe Suite • 2 Adults"
            location="Entoto Park, Addis Ababa"
            checkIn="2024-01-15"
            checkOut="2024-01-20"
            total="2,450 ETB"
          />
        </Section>

        {/* ================= Upcoming ================= */}
        <Section title="Upcoming Bookings">
          <StatusCard
            icon={<CalendarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-700" />}
            badge="Upcoming"
            badgeColor="yellow"
            status="Pending"
            totalColor="green"
          />
        </Section>

        {/* ================= Completed ================= */}
        <Section title="Completed Visits">
          <StatusCard
            icon={<CheckCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-green-700" />}
            badge="Completed"
            badgeColor="green"
            status="Completed"
            totalColor="green"
          />
        </Section>

        {/* ================= Cancelled ================= */}
        <Section title="Cancelled Bookings">
          <StatusCard
            icon={<XCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />}
            badge="Cancelled"
            badgeColor="red"
            status="Cancelled"
            totalColor="red"
          />
        </Section>
      </main>
    </div>
  );
}

/* ================= Section ================= */
function Section({ title, children }) {
  return (
    <section className="mt-10">
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
    <div className="bg-white rounded-xl sm:rounded-2xl border p-4 sm:p-6 shadow-sm">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <div className="w-5 h-5 sm:w-6 sm:h-6">{icon}</div>
      </div>
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-3">
        {value}
      </h3>
      <p className="text-xs sm:text-sm text-gray-500">{title}</p>
    </div>
  );
}

/* ================= Booking Card ================= */
function BookingCard({ type, name, bookingId, room, location, checkIn, checkOut, total }) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-3">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-xl flex items-center justify-center">
            <BuildingOffice2Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold">{name}</h3>
            <p className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
              <MapPinIcon className="w-4 h-4" />
              {location}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">{room}</p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs text-gray-500">Booking ID</p>
          <p className="font-semibold">{bookingId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <InfoBox label="Check-in" value={checkIn} />
        <InfoBox label="Check-out" value={checkOut} />
        <InfoBox label="Status" value="Confirmed" />
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
          <CalendarDaysIcon className="w-4 h-4 text-green-600" />
          {checkIn} → {checkOut}
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-bold text-green-600">{total}</p>
        </div>
      </div>
    </div>
  );
}

/* ================= Status Card ================= */
function StatusCard({ icon, badge, badgeColor, status, totalColor }) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-3">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-${badgeColor}-100`}>
            {icon}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-xl font-bold text-gray-900">
                Sunset Lodge
              </h3>
              <span className={`px-2 py-0.5 text-xs rounded-full bg-${badgeColor}-100 text-${badgeColor}-700`}>
                {badge}
              </span>
            </div>

            <p className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 mt-1">
              <MapPinIcon className="w-4 h-4" />
              Entoto Park, Addis Ababa
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Standard Room • 1 Adult
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs text-gray-500">Booking ID</p>
          <p className="font-semibold">#R778899</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <InfoBox label="Check-in" value="2024-03-01" />
        <InfoBox label="Check-out" value="2024-03-03" />
        <InfoBox label="Status" value={status} />
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
          <CalendarIcon className="w-4 h-4" />
          2024-03-01 → 2024-03-03
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs text-gray-500">Total</p>
          <p className={`text-lg font-bold text-${totalColor}-600`}>
            1,200 ETB
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= Info Box ================= */
function InfoBox({ label, value }) {
  return (
    <div className="bg-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-sm text-gray-800">{value}</p>
    </div>
  );
}
