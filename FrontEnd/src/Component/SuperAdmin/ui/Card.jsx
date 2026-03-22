export default function Card({ title, children }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}
