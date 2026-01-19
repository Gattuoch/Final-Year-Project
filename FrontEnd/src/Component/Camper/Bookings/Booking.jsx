import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import ReservationHeader from "./ReservationHeader";
import camp from "../../../assets/Camp.png"
import { useNavigate } from "react-router-dom";

export default function Booking() {
  const [facility, setFacility] = useState("Pine Valley Campsite - Spot 12");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [tent, setTent] = useState(false);
  const [parking, setParking] = useState(true);
  const [special, setSpecial] = useState("");
  const navigate = useNavigate();
  const basePrice = 45;
  const tentPrice = tent ? 10 : 0;
  const parkingPrice = parking ? 5 : 0;
  const serviceFee = 5;

  const total = basePrice + tentPrice + parkingPrice + serviceFee;

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="hidden lg:block w-72">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1">

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6 px-4 lg:px-10">

          {/* LEFT FORM */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h1 className="text-3xl font-bold mb-1">New Booking</h1>
            <p className="text-gray-500 mb-6">
              Book your campsite easily and quickly.
            </p>

            {/* Facility */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facility
              </label>
              <select
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Pine Valley Campsite - Spot 12</option>
                <option>Lake View Campsite - Spot 7</option>
                <option>River Side Campsite - Spot 2</option>
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
              <h3 className="font-medium mb-4">Guests</h3>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-medium">Adults</div>
                  <div className="text-gray-400 text-sm">Ages 13 or above</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-100"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                  >
                    −
                  </button>
                  <span className="text-lg font-medium">{adults}</span>
                  <button
                    className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-100"
                    onClick={() => setAdults(adults + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Children</div>
                  <div className="text-gray-400 text-sm">Ages 2–12</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-100"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                  >
                    −
                  </button>
                  <span className="text-lg font-medium">{children}</span>
                  <button
                    className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-100"
                    onClick={() => setChildren(children + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Extras */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Extras</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={tent}
                      onChange={(e) => setTent(e.target.checked)}
                    />
                    <span className="font-medium">Tent rental</span>
                  </div>
                  <span className="font-medium text-gray-600">+$10</span>
                </label>

                <label className="flex items-center justify-between border border-gray-200 rounded-xl p-4 bg-blue-50">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={parking}
                      onChange={(e) => setParking(e.target.checked)}
                    />
                    <span className="font-medium">Vehicle parking</span>
                  </div>
                  <span className="font-medium text-gray-600">+$5</span>
                </label>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests
              </label>
              <textarea
                value={special}
                onChange={(e) => setSpecial(e.target.value)}
                rows="4"
                className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any special requests..."
              />
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="w-full lg:w-full">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-lg mb-4">Booking Summary</h2>

              {/* Image */}
    <div className="w-full h-52 md:h-64 rounded-xl overflow-hidden mb-5 border border-gray-100">
      <img
         src={camp}
        alt="camping"
        className="w-full h-full object-cover"
      />
    </div>

              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Base price (1 night)</span>
                  <span>${basePrice}</span>
                </div>
                {tent && (
                  <div className="flex justify-between">
                    <span>Tent rental</span>
                    <span>${tentPrice}</span>
                  </div>
                )}
                {parking && (
                  <div className="flex justify-between">
                    <span>Vehicle parking</span>
                    <span>${parkingPrice}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>${serviceFee}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-5 pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total}</span>
                </div>

                <button className="w-full mt-5 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
                 onClick={() => navigate("/camper-dashboard/reservations/confirm-booking")}>
                  Confirm Booking
                </button>

                <p className="text-center text-xs text-gray-400 mt-3">
                  You won’t be charged yet
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
