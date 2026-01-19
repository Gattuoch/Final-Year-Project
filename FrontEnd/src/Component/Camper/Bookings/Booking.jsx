import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; 
import Sidebar from "../Sidebar/Sidebar"; 
import { 
  StarIcon, 
  MapPinIcon, 
  CheckCircleIcon,
  HomeModernIcon 
} from "@heroicons/react/24/solid";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Booking() {
  const navigate = useNavigate();
  const { id } = useParams(); // This is the CAMP ID

  // Data State
  const [campData, setCampData] = useState(null);
  const [tents, setTents] = useState([]); // ✅ Store tents list
  const [selectedTent, setSelectedTent] = useState(null); // ✅ Track selected tent
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [creating, setCreating] = useState(false);

  // Helper
  const getTodayString = () => new Date().toISOString().split("T")[0];

  // ✅ FETCH CAMP & ITS TENTS
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Camp Details
        const campRes = await axios.get(`http://localhost:5000/api/camps/${id}`);
        if (campRes.data.success) {
          setCampData(campRes.data.data);
        }

        // 2. Fetch Tents for this Camp
        const tentRes = await axios.get(`http://localhost:5000/api/tents/${id}`);
        if (tentRes.data.success) {
          setTents(tentRes.data.data);
        }

      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // Logic to calculate total
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = checkIn && checkOut && end > start 
    ? Math.ceil((end - start) / (1000 * 60 * 60 * 24)) 
    : 0;
    
  // ✅ Price comes from SELECTED TENT now, not the camp base price
  const pricePerNight = selectedTent ? selectedTent.pricePerNight : 0;
  const totalCost = pricePerNight * (nights || 0);

  const handleBookNow = async () => {
    const token = localStorage.getItem("token"); // Matches your new Login.jsx
    
    if (!token) {
      alert("You must be logged in to book a spot.");
      navigate("/login"); // Auto-redirect to login
      return;
    }

    if (!selectedTent) {
      alert("Please select a tent from the list to proceed.");
      return;
    }

    setCreating(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/bookings", 
        {
          tentId: selectedTent._id, // ✅ Sending the correct TENT ID
          checkIn,
          checkOut,
          guests: adults,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        navigate("/camper-dashboard/reservations/confirm-booking", { 
          state: { 
            bookingId: response.data.booking._id,
            totalPrice: response.data.booking.totalPrice 
          } 
        });
      }

    } catch (error) {
      console.error("Booking Error:", error);
      const msg = error.response?.data?.error || "Failed to create booking.";
      alert(msg);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="flex h-screen justify-center items-center">Loading details...</div>;
  if (error || !campData) return <div className="flex h-screen justify-center items-center text-red-500">{error || "Camp not found"}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden lg:block w-72"><Sidebar /></div>

      <div className="flex-1 p-4 lg:p-10 max-w-7xl mx-auto">
        
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-black mb-6">
          <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back
        </button>

        {/* Camp Header Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <img 
              src={campData.images?.[0] || "https://via.placeholder.com/400"} 
              className="w-full md:w-1/3 h-64 object-cover rounded-xl" 
              alt={campData.name}
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{campData.name}</h1>
              <div className="flex items-center text-gray-500 mt-2 mb-4">
                <MapPinIcon className="w-5 h-5 mr-1" /> {campData.location?.address}
              </div>
              <p className="text-gray-600 leading-relaxed">{campData.description}</p>
              
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {campData.amenities?.map((am, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-sm rounded-full text-gray-700">{am}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Tent Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Choose Your Tent</h2>
            
            {tents.length === 0 ? (
              <div className="p-10 bg-white rounded-xl text-center border-2 border-dashed border-gray-300 text-gray-500">
                <HomeModernIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No tents have been added to this campsite yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tents.map((tent) => (
                  <div 
                    key={tent._id}
                    onClick={() => setSelectedTent(tent)}
                    className={`flex flex-col md:flex-row bg-white rounded-xl border-2 transition-all cursor-pointer overflow-hidden
                      ${selectedTent?._id === tent._id 
                        ? "border-green-600 ring-4 ring-green-50 shadow-lg" 
                        : "border-gray-100 hover:border-green-300 hover:shadow-md"}
                    `}
                  >
                    <div className="w-full md:w-48 h-48 md:h-auto bg-gray-100 shrink-0">
                      <img 
                        src={tent.images?.[0] || campData.images?.[0]} 
                        className="w-full h-full object-cover" 
                        alt={tent.name} 
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold text-gray-900">{tent.name}</h3>
                          <span className="font-bold text-green-700 text-lg">{tent.pricePerNight} ETB</span>
                        </div>
                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">{tent.description}</p>
                        
                        <div className="flex gap-2 mt-3 flex-wrap">
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">
                            Capacity: {tent.capacity}
                          </span>
                          {tent.amenities?.slice(0, 3).map((a, i) => (
                            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{a}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-end">
                        {selectedTent?._id === tent._id ? (
                          <span className="flex items-center text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full">
                            <CheckCircleIcon className="w-4 h-4 mr-1"/> Selected
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400 font-medium">Click to select</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Sticky Booking Summary */}
          <div className="relative">
            <div className="sticky top-6 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold mb-4 pb-3 border-b border-gray-100">Booking Summary</h3>
              
              <div className="mb-6 bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Selected Unit</p>
                <div className="font-semibold text-gray-900 flex items-center">
                  <HomeModernIcon className="w-5 h-5 mr-2 text-green-600" />
                  {selectedTent ? selectedTent.name : "None selected"}
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">CHECK-IN</label>
                    <input 
                      type="date" 
                      value={checkIn} 
                      min={getTodayString()} 
                      onChange={(e) => {
                        setCheckIn(e.target.value);
                        if(checkOut && e.target.value >= checkOut) setCheckOut("");
                      }} 
                      className="w-full p-2 border rounded-lg text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">CHECK-OUT</label>
                    <input 
                      type="date" 
                      value={checkOut} 
                      min={checkIn || getTodayString()} 
                      disabled={!checkIn} 
                      onChange={(e) => setCheckOut(e.target.value)} 
                      className="w-full p-2 border rounded-lg text-sm" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">GUESTS</label>
                  <div className="flex items-center justify-between border rounded-lg p-2">
                    <span className="text-sm font-medium">{adults} People</span>
                    <div className="flex gap-2">
                      <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300">-</button>
                      <button onClick={() => setAdults(adults + 1)} className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300">+</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Totals */}
              {selectedTent && nights > 0 && (
                <div className="py-4 border-t border-dashed border-gray-300 space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>{pricePerNight} ETB x {nights} nights</span>
                    <span>{pricePerNight * nights} ETB</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t border-gray-100 mt-2">
                    <span>Total</span>
                    <span>{totalCost.toLocaleString()} ETB</span>
                  </div>
                </div>
              )}

              <button 
                onClick={handleBookNow}
                disabled={!selectedTent || !checkIn || !checkOut || creating}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all
                  ${(!selectedTent || !checkIn || !checkOut || creating) 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                    : "bg-green-600 hover:bg-green-700 shadow-md"}
                `}
              >
                {creating ? "Creating Booking..." : "Reserve Now"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}