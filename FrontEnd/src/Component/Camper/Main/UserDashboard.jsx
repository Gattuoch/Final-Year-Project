import { FaBell, FaPlus, FaQrcode } from "react-icons/fa";

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SECTION */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Tickets
            </h2>
            <button className="text-emerald-600 font-medium hover:underline">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* CARD */}
            <TicketCard
              status="Active"
              statusColor="bg-green-100 text-green-700"
              title="Day Visit - Adult"
              park="Entoto Natural Park"
              date="Dec 12, 2024"
              price="$15.00"
            />

            <TicketCard
              status="Used"
              statusColor="bg-gray-100 text-gray-600"
              title="Day Visit - Adult"
              park="Entoto Natural Park"
              date="Nov 28, 2024"
              price="$15.00"
            />

            <TicketCard
              status="Active"
              statusColor="bg-green-100 text-green-700"
              title="Day Visit - Child"
              park="Entoto Natural Park"
              date="Dec 12, 2024"
              price="$8.00"
            />

            <TicketCard
              status="Refund"
              statusColor="bg-yellow-100 text-yellow-700"
              title="Day Visit - Adult"
              park="Entoto Natural Park"
              date="Nov 20, 2024"
              price="$15.00"
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-emerald-600 rounded-2xl shadow-sm"></div>
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
    <div className="border rounded-2xl p-5 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full ${statusColor}`}
        >
          {status}
        </span>
        <FaQrcode className="text-gray-400 text-lg" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-500 text-sm mt-1">{park}</p>

      <div className="flex justify-between items-center mt-4 text-sm">
        <span className="text-gray-500 flex items-center gap-2">
          📅 {date}
        </span>
        <span className="font-semibold text-gray-900">{price}</span>
      </div>
    </div>
  );
}
