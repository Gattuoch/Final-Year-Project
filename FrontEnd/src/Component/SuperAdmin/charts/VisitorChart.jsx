import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchVisitorChart } from "../services/api.js";

export default function VisitorChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchVisitorChart().then(({ data }) => {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      setData(
        data.map(d => ({
          day: days[d._id - 1],
          value: d.visitors,
        }))
      );
    });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
}
