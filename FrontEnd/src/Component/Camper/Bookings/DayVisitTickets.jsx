import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  TicketIcon,
  GlobeAltIcon,
  FlagIcon,
  PlusIcon,
  ClockIcon,
  CalendarIcon,
  MapPinIcon,
  StarIcon,
  HeartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../Sidebar/Sidebar";

export default function DayVisitTickets() {
  const [open, setOpen] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState("Domestic Visitor");
  const [ticketPrices, setTicketPrices] = useState({});

  const handleOpenModal = (type) => {
    setSelectedTicketType(type);
    // set price mapping
    if (type === "Domestic Visitor") {
      setTicketPrices({ "Adult (18+)": 250, "Child (3–17)": 150, "Infant (0–2)": 0 });
    } else {
      setTicketPrices({ "Adult (18+)": 25, "Child (3–17)": 15, "Infant (0–2)": 0 });
    }
    setOpen(true);
  };

  const handlePurchase = () => {
    toast.success("Ticket purchased successfully!", { duration: 3000 });
    setOpen(false);
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Toaster position="top-right" />
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Day Visit Tickets</h1>
                <p className="text-gray-500">Purchase tickets for Entoto Park day visits</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
                  <ClockIcon className="w-5 h-5" />
                  My Tickets
                </button>
                <button
                  onClick={() => handleOpenModal("Domestic Visitor")}
                  className="flex items-center gap-2 px-4 h-10 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition"
                >
                  <PlusIcon className="w-5 h-5" />
                  Buy New Ticket
                </button>
              </div>
            </div>

            {/* Ticket Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TicketCard
                title="Domestic Visitor"
                subtitle="For Ethiopian residents"
                badge="Popular"
                icon={<FlagIcon className="w-6 h-6 text-blue-600" />}
                border="border-emerald-600"
                buttonColor="bg-emerald-600 hover:bg-emerald-700"
                buttonText="Purchase Domestic Ticket"
                onBuy={() => handleOpenModal("Domestic Visitor")}
                prices={[
                  { label: "Adult (18+)", desc: "Full access", price: 250 },
                  { label: "Child (3–17)", desc: "Age verification", price: 150 },
                  { label: "Infant (0–2)", desc: "Free entry", price: 0, free: true },
                ]}
              />
              <TicketCard
                title="International Visitor"
                subtitle="For foreign tourists"
                badge="Premium"
                icon={<GlobeAltIcon className="w-6 h-6 text-orange-600" />}
                border="border-yellow-300"
                bg="bg-yellow-50"
                buttonColor="bg-orange-500 hover:bg-orange-600"
                buttonText="Purchase International Ticket"
                onBuy={() => handleOpenModal("International Visitor")}
                prices={[
                  { label: "Adult (18+)", desc: "Full access", price: 25 },
                  { label: "Child (3–17)", desc: "Age verification", price: 15 },
                  { label: "Infant (0–2)", desc: "Free entry", price: 0, free: true },
                ]}
              />
            </div>

            {/* Info Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <InfoBox title="Available Tickets">
                <InfoTicket title="Adult (18+)" subtitle="250 ETB" count="12 available" />
                <InfoTicket title="Child (3–17)" subtitle="150 ETB" count="8 available" />
                <InfoTicket title="Infant (0–2)" subtitle="Free" count="Unlimited" />
              </InfoBox>
              <InfoBox title="Booking Information">
                <InfoRow icon={<CalendarIcon className="w-5 h-5" />} label="Dates" value="Next 12 days" />
                <InfoRow icon={<ClockIcon className="w-5 h-5" />} label="Time" value="8 AM – 6 PM" />
                <InfoRow icon={<MapPinIcon className="w-5 h-5" />} label="Location" value="Entoto Park" />
              </InfoBox>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoFeature
                icon={<MapPinIcon className="w-6 h-6 text-emerald-600" />}
                title="Entoto Park Access"
                text="Explore one of Addis Ababa’s most scenic and historic natural parks."
              />
              <InfoFeature
                icon={<HeartIcon className="w-6 h-6 text-red-500" />}
                title="Environmental Benefits"
                text="Your visit supports conservation and sustainable tourism."
              />
              <InfoFeature
                icon={<StarIcon className="w-6 h-6 text-yellow-500" />}
                title="Visitor Experience"
                text="Enjoy hiking, fresh air, panoramic views, and cultural landmarks."
              />
            </div>
          </div>

          {open && (
            <PurchaseTicketModal
              ticketType={selectedTicketType}
              prices={ticketPrices}
              onClose={() => setOpen(false)}
              onConfirm={handlePurchase}
            />
          )}
        </main>
      </div>
    </>
  );
}

/* ---------------- PURCHASE MODAL ---------------- */
function PurchaseTicketModal({ ticketType, prices, onClose, onConfirm }) {
  const [selected, setSelected] = useState(Object.keys(prices)[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("8:00 AM – 10:00 AM");
  const [quantity, setQuantity] = useState(1);

  const subtotal = prices[selected] * quantity;
  const serviceFee = subtotal > 0 ? 10 : 0;
  const total = subtotal + serviceFee;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">{ticketType} Ticket</h2>
          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="h-11 rounded-lg border px-3"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              {Object.keys(prices).map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>

            <input
              type="date"
              className="h-11 rounded-lg border px-3"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <select
              className="h-11 rounded-lg border px-3"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option>8:00 AM – 10:00 AM</option>
              <option>10:00 AM – 12:00 PM</option>
              <option>12:00 PM – 2:00 PM</option>
              <option>2:00 PM – 4:00 PM</option>
            </select>

            <input
              type="number"
              min="1"
              className="h-11 rounded-lg border px-3"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Number of tickets"
            />
          </div>

          <textarea
            rows="3"
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Any special needs or requirements..."
          />

          {/* Price summary */}
          <div className="grid grid-cols-3 text-center border-t pt-4">
            <div>
              <p className="text-sm text-gray-500">Subtotal</p>
              <p className="font-bold">{subtotal} ETB</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Service Fee</p>
              <p className="font-bold">{serviceFee} ETB</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-bold text-emerald-600">{total} ETB</p>
            </div>
          </div>

          <button
            onClick={onConfirm}
            className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2"
          >
            <TicketIcon className="w-5 h-5" />
            Confirm Booking & Pay
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SUPPORTING COMPONENTS ---------------- */
function TicketCard({ title, subtitle, badge, icon, prices, buttonText, border, bg = "bg-white", buttonColor, onBuy }) {
  return (
    <div className={`rounded-2xl border-2 ${border} ${bg} p-6 space-y-6`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white shadow flex items-center justify-center">{icon}</div>
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        {badge && (
          <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">{badge}</span>
        )}
      </div>
      {prices.map((p, i) => (
        <div key={i} className="flex justify-between bg-gray-50 p-4 rounded-xl">
          <div>
            <p className="font-medium">{p.label}</p>
            <p className="text-sm text-gray-500">{p.desc}</p>
          </div>
          <p className={`font-bold ${p.free ? "text-emerald-600" : ""}`}>{p.price}</p>
        </div>
      ))}
      <button
        onClick={onBuy}
        className={`w-full h-12 rounded-xl text-white font-medium flex items-center justify-center gap-2 ${buttonColor}`}
      >
        <TicketIcon className="w-5 h-5" />
        {buttonText}
      </button>
    </div>
  );
}

function InfoBox({ title, children }) {
  return (
    <div className="bg-white border rounded-2xl p-6 space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function InfoTicket({ title, subtitle, count }) {
  return (
    <div className="flex justify-between bg-gray-50 p-4 rounded-xl">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <p className="font-semibold text-emerald-600">{count}</p>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
      <div className="flex items-center gap-3">
        {icon}
        <p className="font-medium">{label}</p>
      </div>
      <p className="font-bold">{value}</p>
    </div>
  );
}

function InfoFeature({ icon, title, text }) {
  return (
    <div className="bg-white border rounded-2xl p-6 space-y-3">
      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">{icon}</div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}
