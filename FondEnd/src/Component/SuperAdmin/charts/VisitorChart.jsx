import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { visitorData } from "../data/dashboardData"; 
import Card from "../ui/Card";

export default function VisitorChart() {
  return (
    <Card title="Visitor Trends">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={visitorData}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
