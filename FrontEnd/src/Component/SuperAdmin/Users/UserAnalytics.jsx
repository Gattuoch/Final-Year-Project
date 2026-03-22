import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

/* ---------- Data ---------- */

const userGrowthData = [
  { month: "Jan", users: 12000 },
  { month: "Feb", users: 13500 },
  { month: "Mar", users: 14200 },
  { month: "Apr", users: 15800 },
  { month: "May", users: 16500 },
  { month: "Jun", users: 17200 },
  { month: "Jul", users: 18000 },
  { month: "Aug", users: 18800 },
  { month: "Sep", users: 19500 },
  { month: "Oct", users: 20200 },
  { month: "Nov", users: 21000 },
  { month: "Dec", users: 22000 },
];

const userTypesData = [
  { name: "Regular", value: 714 },
  { name: "Premium", value: 212 },
  { name: "Camp Owner", value: 71 },
  { name: "Banned", value: 6 },
];

const COLORS = ["#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"];

/* ---------- Component ---------- */

const UserAnalytics = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* User Growth */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          User Growth
        </h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Types Distribution */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          User Types Distribution
        </h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={userTypesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ percent }) =>
                  `${(percent * 100).toFixed(1)}%`
                }
              >
                {userTypesData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;
