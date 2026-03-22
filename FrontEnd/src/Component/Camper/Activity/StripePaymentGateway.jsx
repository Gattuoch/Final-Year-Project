
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import PaymentForm from "./PaymentForm.jsx";


const StripePaymentGateway = () => {
  const PUBLIC_KEY =
    "pk_test_51SrjqoRyku0LE3Okzy8LQOD1vWbzu4eRhK4YSQZmsnZmYTLfhab1YqKsLSa6v2xInpsuNgsv0Dskygy6Ubtf8mby00DypMJeol";

  const stripeTestPromise = loadStripe(PUBLIC_KEY);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
  <Elements stripe={stripeTestPromise}>
    <PaymentForm />
  </Elements>
</div>

  );
};

export default StripePaymentGateway;

