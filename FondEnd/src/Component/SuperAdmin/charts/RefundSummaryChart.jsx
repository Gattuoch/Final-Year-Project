import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { fetchRefundSummary } from "../services/api.js";

export default function RefundSummaryChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchRefundSummary().then(({ data }) => {
      const formatted = data.map(r => ({
        status: r._id,
        value: r.total,
      }));
      setData(formatted);
    });
  }, []);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm h-[360px]">
      <h3 className="text-lg font-semibold mb-4">Refund Summary</h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="status" />
          <YAxis />
          <Bar dataKey="value" fill="#EF4444" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
