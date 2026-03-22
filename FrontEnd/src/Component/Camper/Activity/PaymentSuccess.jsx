import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const tx_ref = params.get("tx_ref");

    fetch(`http://localhost:5000/api/chapa/verify/${tx_ref}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.status === "success") {
          setStatus("✅ Payment Successful");
        } else {
          setStatus("❌ Payment Failed");
        }
      })
      .catch(() => setStatus("❌ Verification Error"));
  }, []);

  return <h1 className="text-xl font-bold text-center mt-10">{status}</h1>;
}
