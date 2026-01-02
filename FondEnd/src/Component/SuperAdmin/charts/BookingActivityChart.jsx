import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "Camps", value: 45 },
  { name: "Events", value: 35 },
  { name: "Day Passes", value: 20 },
];

const COLORS = ["#10B981", "#8B5CF6", "#F59E0B"];

export default function BookingActivityChart() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm h-[360px]">
      <h3 className="text-lg font-semibold mb-4">Booking Activity</h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={110}
            dataKey="value"
            label={({ value }) => `${value}%`}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Legend
            verticalAlign="middle"
            align="right"
            layout="vertical"
            iconType="square"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
