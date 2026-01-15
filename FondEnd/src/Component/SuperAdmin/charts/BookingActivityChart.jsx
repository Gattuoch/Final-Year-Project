import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { fetchBookingActivity } from "../services/api.js";

const COLORS = ["#10B981", "#8B5CF6", "#F59E0B"];

export default function BookingActivityChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchBookingActivity().then(({ data }) => {
      const camps = data.filter(b => b.type === "camp").length;
      const events = data.filter(b => b.type === "event").length;
      const dayPasses = data.filter(b => b.type === "day_pass").length;

      const total = camps + events + dayPasses || 1;

      setData([
        { name: "Camps", value: Math.round((camps / total) * 100) },
        { name: "Events", value: Math.round((events / total) * 100) },
        { name: "Day Passes", value: Math.round((dayPasses / total) * 100) },
      ]);
    });
  }, []);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm h-[360px]">
      <h3 className="text-lg font-semibold mb-4">Booking Activity</h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={110}
            dataKey="value"
            label={({ value }) => `${value}%`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>

          <Legend
            verticalAlign="middle"
            align="right"
            layout="vertical"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
