import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OTPVerification = () => {
  const [target, setTarget] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("verification");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("https://ethio-camp-ground-backend-lega.onrender.com/api/auth/verify-otp", {
        target,
        code,
        type,
      });

      setMessage(res.data.message);

      // ---- Redirect after 1 second ----
      if (res.data.isVerified) {
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }

    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed");
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-200">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Verify OTP
        </h2>

        {/* TARGET INPUT */}
        <label className="block mb-2 font-semibold">Target (Phone or Email)</label>
        <input
          type="text"
          placeholder="0912345678 or email@example.com"
          className="w-full p-3 border rounded-lg mb-4"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          required
        />

        {/* OTP INPUT */}
        <label className="block mb-2 font-semibold">OTP Code</label>
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full p-3 border rounded-lg mb-4"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        {/* TYPE SELECT */}
        <label className="block mb-2 font-semibold">Type</label>
        <select
          className="w-full p-3 border rounded-lg mb-6"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="verification">verification</option>
          <option value="reset">reset</option>
        </select>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* MESSAGE */}
        {message && (
          <p
            className={`mt-4 text-center font-semibold ${
              message.includes("success") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default OTPVerification;
