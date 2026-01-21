import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeftIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import Telebirr from "../../../assets/telebirr.png";
import Chapa from "../Activity/Chapa";

function BookingForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exchangeRate] = useState(0.0083); // ETB → USD
  const [amountUSD, setAmountUSD] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const bookingId = location.state?.bookingId;
  const bookingTotalETB = location.state?.totalPrice || 0;

  useEffect(() => {
    if (!bookingId) navigate("/camper-dashboard/campsite-directory");
  }, [bookingId, navigate]);

  useEffect(() => {
    setAmountUSD((bookingTotalETB * exchangeRate).toFixed(2));
  }, [bookingTotalETB, exchangeRate]);

  if (!bookingId) return null;

  return (
    <div className="min-h-screen bg-[#f7fbf7] p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-green-700 transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Booking
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Secure Payment</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-1">
            <LockClosedIcon className="w-4 h-4 text-green-600" />
            Your transaction is encrypted and secure.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Options */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Payment now</h2>

              <div className="space-y-4">
                {/* Chapa */}
                <div className="relative p-5 border rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between border-green-600 bg-green-50/50 ring-1 ring-green-600 shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full border flex items-center justify-center border-green-600 bg-green-600">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Chapa (Telebirr)</p>
                      <p className="text-sm text-gray-500">Local payment via Telebirr, CBE, or Banks</p>
                    </div>
                  </div>
                  <img src={Telebirr} alt="Telebirr" className="h-8 w-auto object-contain opacity-90" />
                </div>

                {/* Chapa Payment Form */}
                <div className="mt-6 h-7 w-full ">
                  <Chapa bookingId={bookingId} amountETB={bookingTotalETB} />
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Booking Summary</h2>
              <div className="space-y-3 pb-6 border-b border-gray-100 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Booking Reference</span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{bookingId.slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Method</span>
                  <span className="font-medium capitalize text-gray-900">Chapa</span>
                </div>
              </div>

              <div className="pt-6">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-gray-600 font-medium">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {bookingTotalETB.toLocaleString()} ETB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
