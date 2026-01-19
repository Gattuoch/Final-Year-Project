import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import Telebirr from "../../../assets/telebirr.png"; 
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios"; 
import { ArrowLeftIcon, LockClosedIcon } from "@heroicons/react/24/solid";

// Initialize Stripe
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

function BookingForm() {
  const [paymentMethod, setPaymentMethod] = useState("chapa"); // Default to Chapa
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Converter State
  const [exchangeRate] = useState(0.0083); // 1 ETB = 0.0083 USD
  const [amountUSD, setAmountUSD] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const stripe = useStripe();
  const elements = useElements();

  // Retrieve booking details
  const bookingId = location.state?.bookingId;
  const bookingTotalETB = location.state?.totalPrice || 0;

  // Redirect if accessed directly without booking state
  useEffect(() => {
    if (!bookingId) {
      alert("No active booking found. Redirecting to search.");
      navigate("/camper-dashboard/campsite-directory");
    }
  }, [bookingId, navigate]);

  // Calculate USD
  useEffect(() => {
    if (bookingTotalETB) {
      setAmountUSD((bookingTotalETB * exchangeRate).toFixed(2));
    }
  }, [bookingTotalETB, exchangeRate]);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    // ✅ FIX: Check for both token names to prevent login errors
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    
    if (!token) {
      setError("You must be logged in to make a payment.");
      setLoading(false);
      // Optional: Redirect to login after a delay
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const payload = { bookingId };

      if (paymentMethod === "stripe") {
        // --- STRIPE FLOW (USD) ---
        if (!stripe || !elements) return;

        const { data } = await axios.post(
          "http://localhost:5000/api/payment/create-intent",
          payload,
          config
        );

        const cardElement = elements.getElement(CardElement);
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
          data.clientSecret,
          {
            payment_method: {
              card: cardElement,
              billing_details: { name: "Valued Customer" }, 
            },
          }
        );

        if (stripeError) throw new Error(stripeError.message);
        if (paymentIntent.status === "succeeded") {
            navigate("/camper-dashboard/reservations/success");
        }

      } else if (paymentMethod === "chapa") {
        // --- CHAPA FLOW (ETB) ---
        const { data } = await axios.post(
          "http://localhost:5000/api/payment/chapa-init",
          payload,
          config
        );

        // ✅ Handle both possible response keys
        const paymentUrl = data.paymentUrl || data.checkout_url;

        if (paymentUrl) {
            window.location.href = paymentUrl;
        } else {
            throw new Error("Failed to initialize Chapa payment");
        }
      }

    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.error || err.message || "Payment failed.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

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
          
          {/* LEFT: Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Choose Payment Method</h2>
              
              <div className="space-y-4">
                
                {/* Option 1: Chapa */}
                <div 
                  onClick={() => setPaymentMethod("chapa")}
                  className={`relative p-5 border rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between
                    ${paymentMethod === "chapa" 
                      ? "border-green-600 bg-green-50/50 ring-1 ring-green-600 shadow-md" 
                      : "border-gray-200 hover:border-green-400 hover:shadow-sm"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center 
                      ${paymentMethod === "chapa" ? "border-green-600 bg-green-600" : "border-gray-300"}`}>
                      {paymentMethod === "chapa" && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Chapa (Telebirr)</p>
                      <p className="text-sm text-gray-500">Local payment via Telebirr, CBE, or Banks</p>
                    </div>
                  </div>
                  <img src={Telebirr} alt="Telebirr" className="h-8 w-auto object-contain opacity-90" />
                </div>

                {/* Option 2: Stripe */}
                <div 
                  onClick={() => setPaymentMethod("stripe")}
                  className={`relative p-5 border rounded-xl cursor-pointer transition-all duration-200
                    ${paymentMethod === "stripe" 
                      ? "border-blue-600 bg-blue-50/30 ring-1 ring-blue-600 shadow-md" 
                      : "border-gray-200 hover:border-blue-400 hover:shadow-sm"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center 
                        ${paymentMethod === "stripe" ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}>
                        {paymentMethod === "stripe" && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">Credit / Debit Card</p>
                        <p className="text-sm text-gray-500">Secure International Payment via Stripe</p>
                      </div>
                    </div>
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                      USD
                    </span>
                  </div>

                  {/* Converter Info */}
                  {paymentMethod === "stripe" && (
                    <div className="mt-4 pl-9">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <CardElement options={{
                          style: {
                            base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                            invalid: { color: '#9e2146' },
                          },
                        }}/>
                      </div>
                      <p className="text-xs text-blue-600 mt-2 font-medium">
                        * Currency converted: {bookingTotalETB} ETB ≈ ${amountUSD} USD
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Pay Button */}
            <button 
              onClick={handlePayment} 
              disabled={loading || (paymentMethod === "stripe" && !stripe)}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all duration-300 transform active:scale-[0.98]
                ${loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : paymentMethod === "chapa" 
                    ? "bg-green-700 hover:bg-green-800 shadow-green-200"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                }
              `}
            >
              {loading 
                ? "Processing Secure Payment..." 
                : paymentMethod === "chapa" 
                  ? `Pay ${bookingTotalETB.toLocaleString()} ETB`
                  : `Pay $${amountUSD} USD`
              }
            </button>
          </div>

          {/* RIGHT: Summary Card */}
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
                  <span className="font-medium capitalize text-gray-900">{paymentMethod}</span>
                </div>
              </div>

              <div className="pt-6">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-gray-600 font-medium">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {paymentMethod === "stripe" ? `$${amountUSD}` : `${bookingTotalETB.toLocaleString()} ETB`}
                  </span>
                </div>
                
                {paymentMethod === "stripe" && (
                  <p className="text-right text-xs text-gray-400">
                    ~ {bookingTotalETB.toLocaleString()} ETB
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function NewBooking() {
  return (
    <Elements stripe={stripePromise}>
      <BookingForm />
    </Elements>
  );
}