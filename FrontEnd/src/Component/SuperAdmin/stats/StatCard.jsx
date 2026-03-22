export default function StatCard({ title, value, change, green }) {
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
