import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import Sidebar from "../Sidebar/Sidebar"; 
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon, 
  MapPinIcon, 
  XMarkIcon,
  ListBulletIcon,
  MapIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

export default function CampsiteDirectory() {
  const navigate = useNavigate();
  
  // Data States
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI States
  const [showMapMobile, setShowMapMobile] = useState(false); // Toggle for mobile view

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState("");
  const [starFilter, setStarFilter] = useState("");

  // ✅ FETCH REAL CAMPS FROM BACKEND
  useEffect(() => {
    const fetchCamps = async () => {
      setLoading(true);
      try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (priceFilter === "low") params.maxPrice = 4000;
        if (priceFilter === "mid") { params.minPrice = 4000; params.maxPrice = 8000; }
        if (priceFilter === "high") params.minPrice = 8000;

        const response = await axios.get("http://localhost:5000/api/camps", { params });
        
        if (response.data.success) {
          setCamps(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching camps:", err);
        setError("Failed to load campsites. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchCamps();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, priceFilter, starFilter]);

  const handleBookNow = (id) => {
    navigate(`/camper-dashboard/book/${id}`);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Sidebar - Fixed */}
      <div className="hidden lg:block w-72 h-full border-r border-gray-200 bg-white">
        <Sidebar />
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Header & Search (Sticky) */}
        <div className="bg-white border-b border-gray-200 p-4 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
            
            <div className="flex-1 w-full relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                placeholder="Search by location, name..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              {/* Filter Button */}
              <div className="relative">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-3 border rounded-xl transition-all flex items-center gap-2 ${showFilters ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                >
                  <AdjustmentsHorizontalIcon className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">Filters</span>
                </button>

                {showFilters && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-5 animate-fade-in z-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-800">Filter By</h3>
                      <button onClick={() => setShowFilters(false)}><XMarkIcon className="w-5 h-5 text-gray-400" /></button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <select className="w-full p-2 border rounded-lg" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
                          <option value="">All Prices</option>
                          <option value="low">&lt; 4,000 ETB</option>
                          <option value="mid">4k - 8k ETB</option>
                          <option value="high">&gt; 8,000 ETB</option>
                        </select>
                      </div>
                      <button onClick={() => { setPriceFilter(""); setSearchTerm(""); }} className="w-full py-2 text-sm text-red-500 font-medium hover:bg-red-50 rounded-lg">Reset</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Map Toggle */}
              <button 
                className="md:hidden p-3 border border-gray-200 rounded-xl bg-white text-gray-600"
                onClick={() => setShowMapMobile(!showMapMobile)}
              >
                {showMapMobile ? <ListBulletIcon className="w-5 h-5" /> : <MapIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Content Split: List & Map */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT: Scrollable Camp List */}
          <div className={`flex-1 overflow-y-auto p-4 lg:p-6 transition-all duration-300 ${showMapMobile ? 'hidden' : 'block'}`}>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
                <p>Finding the best spots...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-500">{error}</div>
            ) : (
              <>
                <div className="mb-4 flex justify-between items-end">
                  <h2 className="text-xl font-bold text-gray-800">
                    {camps.length} {camps.length === 1 ? 'Campsite' : 'Campsites'} Found
                  </h2>
                </div>

                {/* ✅ RESPONSIVE GRID: Auto-adjusts columns based on width */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                  {camps.map((camp) => (
                    <div 
                      key={camp._id || camp.id} 
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col"
                    >
                      {/* Image Area */}
                      <div className="h-48 relative overflow-hidden">
                        <img 
                          src={camp.images?.[0] || "https://via.placeholder.com/400"} 
                          alt={camp.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center shadow-sm">
                          <StarIconSolid className="w-3 h-3 text-yellow-400 mr-1" />
                          {camp.rating || "New"}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-1">{camp.name}</h3>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <MapPinIcon className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{camp.location?.address}</span>
                        </div>

                        <div className="flex gap-2 mb-4 flex-wrap">
                          {camp.amenities?.slice(0, 3).map((item, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200">
                              {item}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                          <div>
                            <span className="text-lg font-bold text-green-700">{camp.basePrice} ETB</span>
                            <span className="text-xs text-gray-400 font-medium"> / night</span>
                          </div>
                          <button 
                            onClick={() => handleBookNow(camp._id || camp.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {camps.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No campsites found matching your search.</p>
                    <button 
                      onClick={() => {setSearchTerm(""); setPriceFilter("");}}
                      className="mt-2 text-green-600 font-medium hover:underline"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT: Google Map (Sticky / Full Height) */}
          <div className={`w-full md:w-1/2 lg:w-[45%] xl:w-[40%] bg-gray-200 h-full relative ${showMapMobile ? 'block' : 'hidden md:block'}`}>
            <iframe 
              title="Campsite Map"
              width="100%" 
              height="100%" 
              frameBorder="0" 
              style={{ border: 0 }} 
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d252233.19760777732!2d38.763611!3d9.005401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2set!4v1700000000000!5m2!1sen!2set" 
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale-[20%] hover:grayscale-0 transition-all duration-500"
            ></iframe>
            
            {/* Map Overlay Button (Mobile only) */}
            <button 
              onClick={() => setShowMapMobile(false)}
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 md:hidden"
            >
              <ListBulletIcon className="w-5 h-5" />
              Show List
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}