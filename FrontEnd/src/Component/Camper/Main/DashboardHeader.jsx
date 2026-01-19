import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";

const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* LEFT */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, John!
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your bookings and explore new adventures
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <div className="relative cursor-pointer">
            <FaBell className="text-xl text-gray-600" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </div>

          {/* Button */}
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
            onClick={() =>
              navigate("/camper-dashboard/reservations/new-booking")
            }
          >
            + New Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
