import { Bell, Plus } from "lucide-react";

export default function Topbar() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-semibold">Camp Management</h2>
        <p className="text-gray-500">Manage all camps across the platform</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg">
          <Plus size={18} />
          Add New Camp
        </button>

        <Bell className="text-gray-500 cursor-pointer" />

        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40"
            alt="Admin"
            className="w-9 h-9 rounded-full"
          />
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-500">Super Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
