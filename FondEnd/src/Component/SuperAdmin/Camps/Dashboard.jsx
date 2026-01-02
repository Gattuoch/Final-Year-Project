import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Users,
  DollarSign,
  BarChart,
  Settings,
  Bell
} from "lucide-react";
import { FaCampground } from "react-icons/fa";

import {
  LineChart,
  Line,
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import Logo from "../../assets/super-admin-image.png";

/* ---------- DATA (from image style) ---------- */

const revenueData = [
  { month: "Jan", value: 45000 },
  { month: "Feb", value: 52000 },
  { month: "Mar", value: 48000 },
  { month: "Apr", value: 61000 },
  { month: "May", value: 58000 }
];

const visitorData = [
  { day: "Mon", value: 1200 },
  { day: "Tue", value: 1400 },
  { day: "Wed", value: 1100 },
  { day: "Thu", value: 1600 },
  { day: "Fri", value: 1800 }
];

/* ---------- DASHBOARD ---------- */

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* SIDEBAR */}
      <aside className="w-[260px] bg-white border-r px-6 py-6">
        <img src={Logo} alt="logo" className="mb-8" />

        <nav className="space-y-2 text-gray-600 text-sm">
          <MenuItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          <MenuItem icon={<FaCampground size={18} />} label="Camps" />
          <MenuItem icon={<Calendar size={18} />} label="Events" />
          <MenuItem icon={<BookOpen size={18} />} label="Bookings" />
          <MenuItem icon={<Users size={18} />} label="Users" />
          <MenuItem icon={<DollarSign size={18} />} label="Finance" />
          <MenuItem icon={<BarChart size={18} />} label="Analytics" />
          <MenuItem icon={<Settings size={18} />} label="Settings" />
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1">
        {/* HEADER */}
        <header className="flex justify-between items-center bg-white border-b px-8 py-5">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Super Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Global system overview and analytics
            </p>
          </div>

          <div className="flex items-center gap-5">
            <Bell className="text-gray-500" />
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/40"
                className="rounded-full"
                alt="admin"
              />
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">
                  Super Administrator
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-8 space-y-8">
          {/* TOP STATS */}
          <div className="grid grid-cols-4 gap-6">
            <Stat title="Total Camps" value="248" change="+12%" />
            <Stat title="Event Venues" value="156" change="+8%" />
            <Stat title="Total Bookings" value="12,847" change="+24%" />
            <Stat title="Tickets Sold" value="45,692" change="+18%" />
          </div>

          {/* SECOND ROW */}
          <div className="grid grid-cols-4 gap-6">
            <Stat title="Visitors Today" value="2,847" />
            <Stat title="Total Earnings" value="$847,329" />
            <Stat title="Active Users" value="1,247" />
            <Stat title="System Health" value="Excellent" green />
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-2 gap-6">
            {/* Revenue */}
            <Card title="Revenue Trends">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22c55e"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Visitors */}
            <Card title="Visitor Trends">
              <ResponsiveContainer width="100%" height={260}>
                <RBarChart data={visitorData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </RBarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function MenuItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer
        ${active ? "bg-green-50 text-green-600 font-medium" : "hover:bg-gray-100"}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

function Stat({ title, value, change, green }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500">{title}</p>
      <h3
        className={`text-2xl font-semibold mt-2 ${
          green ? "text-green-600" : "text-gray-800"
        }`}
      >
        {value}
      </h3>
      {change && (
        <p className="text-xs text-green-500 mt-1">
          ↑ {change} this month
        </p>
      )}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}
