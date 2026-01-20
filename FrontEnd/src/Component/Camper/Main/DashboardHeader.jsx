import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "Camper" });

  useEffect(() => {
    // ✅ Fetch User Data from Local Storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      // specific logic to get the best display name
      const name = parsed.firstName || parsed.fullName?.split(" ")[0] || parsed.username || "Camper";
      setUser({ ...parsed, name });
    }
  }, []);

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 sm:px-6 py-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* LEFT: Dynamic Welcome Message */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Welcome back, {user.name}! <span className="text-xl">👋</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your bookings and explore new adventures.
          </p>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-4">
          
          {/* Notification Icon */}
          <div className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition">
            <FaBell className="text-xl text-gray-600" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </div>

          {/* Profile Icon (Optional Visual) */}
          <div className="hidden sm:block">
             <FaUserCircle className="text-3xl text-gray-300" />
          </div>

          {/* New Booking Button */}
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition shadow-md hover:shadow-lg"
            onClick={() => navigate("/camper-dashboard/campsite-directory")}
          >
            + New Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;