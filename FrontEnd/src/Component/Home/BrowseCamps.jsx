import React, { useState, useEffect } from "react";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiMapPin, FiFilter } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const ITEMS_PER_PAGE = 6;
const API_URL = "http://localhost:5000/api/camps";

export default function BrowseALLCamps() {
  const navigate = useNavigate();
  const [camps, setCamps] = useState([]); 
  const [filteredCamps, setFilteredCamps] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    location: "", 
    priceRange: "", 
    rating: "", 
    amenity: "", 
  });

  // ✅ Normalizer: Database -> UI
  const normalize = (raw) => {
    return {
      ...raw,
      id: raw._id, // Map Mongo _id to id for routing
      location: raw.location?.address || raw.location || "Ethiopia",
      price: Number(raw.basePrice ?? raw.price ?? 0),
      rating: Number(raw.rating ?? 0),
      reviews: raw.reviews ?? 0,
      amenities: Array.isArray(raw.amenities) ? raw.amenities : [],
      // Use first image or fallback
      image: Array.isArray(raw.images) && raw.images.length > 0 ? raw.images[0] : "https://via.placeholder.com/400",
      badge: raw.badge || (raw.status === "approved" ? "Verified" : raw.status),
      statusColor: "bg-green-700", 
    };
  };

  // ✅ Fetch Real Data
  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const res = await axios.get(API_URL);
        if (res.data.success) {
          const normalizedData = res.data.data.map(normalize);
          setCamps(normalizedData);
          setFilteredCamps(normalizedData);
        }
      } catch (err) {
        console.error("Failed to fetch camps:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCamps();
  }, []);

  // ✅ Client-Side Filtering Logic
  const applyFilters = () => {
    let result = camps.slice();

    // Location
    if (filters.location) {
      const locFilter = filters.location.trim().toLowerCase();
      result = result.filter((c) =>
        (c.location || "").toLowerCase().includes(locFilter) || 
        (c.name || "").toLowerCase().includes(locFilter)
      );
    }

    // Price
    if (filters.priceRange) {
      // Simple parser for ranges like "1000-4000"
      const [minStr, maxStr] = filters.priceRange.split("-");
      const min = Number(minStr) || 0;
      const max = maxStr && maxStr.includes("+") ? Infinity : Number(maxStr) || Infinity;
      
      result = result.filter((c) => c.price >= min && c.price <= max);
    }

    // Rating
    if (filters.rating) {
      const minR = Number(filters.rating);
      if (!Number.isNaN(minR)) {
        result = result.filter((c) => Number(c.rating || 0) >= minR);
      }
    }

    // Amenity
    if (filters.amenity) {
      const aFilter = filters.amenity.trim().toLowerCase();
      result = result.filter((c) =>
        (c.amenities || []).some((a) => (a || "").toString().toLowerCase().includes(aFilter))
      );
    }

    setFilteredCamps(result);
    setPage(1);
  };

  // ✅ Direct Navigation to Booking Page
  const handleBookNow = (id) => {
    navigate(`/camper-dashboard/book/${id}`);
  };

  const totalPages = Math.max(1, Math.ceil(filteredCamps.length / ITEMS_PER_PAGE));
  const paginated = filteredCamps.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto bg-white">

      <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse All Camps</h1>
      <p className="text-lg text-gray-600 mb-8">
        Discover unique camping experiences across Ethiopia’s most beautiful landscapes.
      </p>

      {/* Filters Bar */}
      <div className="bg-gray-50 p-6 rounded-xl mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">

          <input 
            type="text" 
            placeholder="Search Location..." 
            className="p-3 border rounded-lg focus:outline-green-600"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />

          <select
            className="p-3 border rounded-lg focus:outline-green-600"
            value={filters.priceRange}
            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
          >
            <option value="">Any Price</option>
            <option value="0-1000">Under 1,000 ETB</option>
            <option value="1000-4000">1,000 - 4,000 ETB</option>
            <option value="4000-8000">4,000 - 8,000 ETB</option>
            <option value="8000+">Above 8,000 ETB</option>
          </select>

          <select
            className="p-3 border rounded-lg focus:outline-green-600"
            value={filters.amenity}
            onChange={(e) => setFilters({ ...filters, amenity: e.target.value })}
          >
            <option value="">All Amenities</option>
            <option value="WiFi">WiFi</option>
            <option value="Hiking">Hiking</option>
            <option value="Boat">Boat Trip</option>
            <option value="Parking">Parking</option>
          </select>

          <select
            className="p-3 border rounded-lg focus:outline-green-600"
            value={filters.rating}
            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
          >
            <option value="">Any Rating</option>
            <option value="4">4.0+</option>
            <option value="4.5">4.5+</option>
            <option value="5">5.0</option>
          </select>
        </div>

        <button
          onClick={applyFilters}
          className="mt-4 md:mt-0 flex items-center bg-green-700 text-white px-6 py-3 rounded-lg whitespace-nowrap hover:bg-green-800 transition"
        >
          <FiFilter className="mr-2"/> Apply Filters
        </button>
      </div>

      {/* Loading & Empty States */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading camps...</div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No camps found matching your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {paginated.map((camp, i) => (
            <motion.div 
              key={camp.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full border border-gray-100"
            >
              <div className="relative h-64 overflow-hidden group">
                <img 
                  src={camp.image} 
                  alt={camp.name} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                />
                <span className={`absolute top-4 right-4 px-3 py-1 text-white text-xs font-bold rounded-full ${camp.statusColor}`}>
                  {camp.badge}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{camp.name}</h2>
                  <div className="flex items-center text-yellow-500 text-sm font-bold bg-yellow-50 px-2 py-1 rounded">
                    <FaStar className="mr-1" />
                    {camp.rating || "New"}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                  <FiMapPin />
                  <span className="truncate">{camp.location}</span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{camp.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {camp.amenities.slice(0, 3).map((a, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200">
                      {a}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-green-700">{camp.price} ETB</span>
                    <span className="text-xs text-gray-400"> / night</span>
                  </div>
                  
                  <button 
                    onClick={() => handleBookNow(camp.id)}
                    className="bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-800 transition-colors shadow-sm"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-12 gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            className="p-3 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            disabled={page === 1}
          >
            <FaChevronLeft className="text-gray-600" />
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-colors ${
                page === i + 1 ? "bg-green-700 text-white shadow-md" : "bg-white border text-gray-600 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            className="p-3 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            disabled={page === totalPages}
          >
            <FaChevronRight className="text-gray-600" />
          </button>
        </div>
      )}

    </div>
  );
}