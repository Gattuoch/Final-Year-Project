import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="flex justify-between items-center bg-white px-8 py-5 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Super Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Global system overview and analytics
        </p>
      </div>

      <div className="flex items-center gap-5">
        <Bell className="text-gray-500" />
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            className="rounded-full"
            alt="admin"
          />
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-500">Super Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
