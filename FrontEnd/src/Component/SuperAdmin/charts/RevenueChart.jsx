import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchRevenueChart } from "../services/api.js";

export default function RevenueChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchRevenueChart().then(({ data }) => {
      const months = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec",
      ];

      setData(
        data.map(d => ({
          month: months[d._id - 1],
          value: d.revenue,
        }))
      );
    });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
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
  );
}
