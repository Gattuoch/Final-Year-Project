import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useState } from "react";

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#3b82f6", // Tailwind blue-500
      color: "#111827", // Tailwind gray-900
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fbbf24" }, // yellow-400
      "::placeholder": { color: "#93c5fd" }, // blue-300
    },
    invalid: {
      iconColor: "#ef4444", // red-500
      color: "#b91c1c", // red-700
    },
  },
};

const PaymentForm = () => {
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amountInDollars = 4564;
    const finalTotal = amountInDollars * 100;

    if (!stripe || !elements) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      try {
        const { id } = paymentMethod;
        const response = await axios.post("http://localhost:5000/payment", {
          amount: finalTotal,
          id,
        });

        if (response.data.success) {
          console.log("Successful payment");
          setSuccess(true);
        }
      } catch (error) {
        console.log("Error", error);
      }
    } else {
      console.log(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8">
        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-900">
              Complete Payment
            </h2>

            <fieldset className="border border-gray-200 rounded-lg p-4">
              <legend className="text-gray-700 font-medium mb-2">Card Details</legend>
              <div className="p-2 border border-gray-300 rounded-md">
                <CardElement options={CARD_OPTIONS} />
              </div>
            </fieldset>

            <div className="text-center">
              <p className="text-gray-700 font-medium text-lg mb-2">$65,069.00</p>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Pay Now
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600">
              Payment Successful!
            </h2>
            <p className="text-gray-700 mt-2">Thank you for your payment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentForm;
