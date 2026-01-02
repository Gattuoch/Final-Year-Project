import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", value: 850 },
  { month: "Feb", value: 720 },
  { month: "Mar", value: 640 },
  { month: "Apr", value: 580 },
  { month: "May", value: 490 },
  { month: "Jun", value: 420 },
];

export default function RefundSummaryChart() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm h-[360px]">
      <h3 className="text-lg font-semibold mb-4">Refund Summary</h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <Bar dataKey="value" fill="#EF4444" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
