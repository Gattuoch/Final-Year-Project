export default function StatCard({ title, value, color, icon }) {
  return (
    <div className="bg-white rounded-xl p-5 flex justify-between items-center shadow-sm">
      <div>
        <p className="text-gray-500">{title}</p>
        <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
      </div>
      <div className="bg-gray-100 p-3 rounded-lg">
        {icon}
      </div>
    </div>
  );
}
