export default function MenuItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer
      ${active ? "bg-green-50 text-green-600 font-medium" : "hover:bg-gray-100"}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
