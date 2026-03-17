import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { useUser } from "../../../context/UserContext";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const displayName = user?.firstName || user?.fullName?.split(" ")[0] || user?.username || "Camper";

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 sm:px-6 py-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Welcome back, {displayName}! <span className="text-xl">👋</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your bookings and explore new adventures.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition"
            onClick={() => navigate("/camper-dashboard/notifications")}
          >
            <FaBell className="text-xl text-gray-600" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </div>

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