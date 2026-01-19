import React, { useState } from "react";
import Telebirr from "../../../assets/telebirr.png";
import { useNavigate } from "react-router-dom";
export default function NewBooking() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [walletOption, setWalletOption] = useState("apple");
  const [localWallet, setLocalWallet] = useState("telebirr");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f7fbf7] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800">New Booking</h1>
        <p className="text-gray-500 mt-1">
          Pay now to confirm your campsite instantly
        </p>

        {/* Steps */}
        <div className="flex items-center gap-6 mt-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center">
              1
            </div>
            <p className="text-gray-500">Review booking</p>
          </div>

          <div className="flex-1 h-px bg-gray-200" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center">
              2
            </div>
            <p className="font-semibold text-gray-700">Choose & pay</p>
          </div>

          <div className="flex-1 h-px bg-gray-200" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center">
              3
            </div>
            <p className="text-gray-500">Success</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {/* Left */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold">Payment method</h2>
            <p className="text-gray-500 mt-1">
              Pay now with card or wallet for the fastest check-in experience.
            </p>

            {/* Payment Options */}
            <div className="mt-6 space-y-4">
              <div
                className={`p-4 rounded-lg border ${
                  paymentMethod === "card"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <div>
                    <p className="font-semibold">Card</p>
                    <p className="text-gray-500 text-sm">
                      Visa, Mastercard, Amex
                    </p>
                  </div>
                </label>
              </div>

              <div
                className={`p-4 rounded-lg border ${
                  paymentMethod === "wallet"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={paymentMethod === "wallet"}
                    onChange={() => setPaymentMethod("wallet")}
                  />
                  <div>
                    <p className="font-semibold">Wallet</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Conditional Render */}
            {paymentMethod === "card" && (
              <>
                {/* Card Details */}
                <div className="mt-6 space-y-4">
                  <input
                    type="text"
                    placeholder="1234 1234 1234 1234"
                    className="w-full p-3 border border-gray-200 rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="p-3 border border-gray-200 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      className="p-3 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>

                {/* Billing Details */}
                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold text-gray-800">
                    Billing details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full name"
                      className="p-3 border border-gray-200 rounded-lg"
                    />
                  
                  </div>
                  <input
                    type="text"
                    placeholder="Billing country or region"
                    className="w-full p-3 border border-gray-200 rounded-lg"
                  />
                </div>
              </>
            )}

            {paymentMethod === "wallet" && (
              <>
                {/* Wallet Options */}
                <div className="mt-6 space-y-4">
                  <div className="space-y-3">
                    <div className="mt-3 space-y-4">
                      {/* Telebirr Logo */}
                      <div className="flex justify-center">
                        <img
                          src={Telebirr}
                          alt="Telebirr"
                          className="h-14 object-contain"
                        />
                      </div>

                      <input
                        type="number"
                        placeholder="Phone Number"
                        className="w-full p-3 border border-gray-200 rounded-lg"
                      />

                      <input
                        type="number"
                        placeholder="Amount"
                        className="w-full p-3 border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Confirm Button */}
            <div className="mt-6">
              <button
                onClick={handlePayment}
                className="w-full bg-green-800 text-white p-3 rounded-lg font-semibold"
              >
                {loading ? "Processing payment..." : "Confirm & Pay $55"}
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">Booking summary</h2>
              <button
                className="text-green-800 font-semibold cursor-pointer"
                onClick={() =>
                  navigate("/camper-dashboard/reservations/new-booking")
                }
              >
                Back to review
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-gray-600">Pine Valley Campsite · Spot 12</p>
              <p className="text-gray-600">2 guests</p>
              <p className="text-gray-600">Jun 21 – Jun 23 (2 nights)</p>
              <p className="text-gray-800 font-semibold mt-2">Pay now </p>
            </div>

            <div className="mt-6 space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Base price (2 nights)</span>
                <span>$45 × 2</span>
              </div>
              <div className="flex justify-between">
                <span>Extras</span>
                <span>$5</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>$5</span>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Total due now</span>
                <span className="font-bold text-xl">$55</span>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                You will be charged immediately. Your booking is confirmed as
                soon as payment succeeds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
