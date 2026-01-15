import React, { useState } from "react";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiMapPin, FiFilter } from "react-icons/fi";
import { motion } from "framer-motion";

import Camp1 from "../../assets/Simien-mountain.png";
import Camp2 from "../../assets/Lake-tana.png";
import Camp3 from "../../assets/Bale-forest.png";
import Omo from "../../assets/Omo.png"
import Danakil from "../../assets/Danakil-desert.png"
import HighLand from "../../assets/Highland-Glamping.png"

// ---------- fallback local data (unchanged UI) ----------
const campsData = [
  {
    id: 1,
    name: "Simien Mountain Retreat",
    location: "Simien Mountains National Park",
    rating: 4.9,
    reviews: 127,
    description:
      "Luxury camping with breathtaking mountain views, wildlife watching, and modern amenities.",
    price: 85,
    amenities: ["WiFi", "Parking", "Restaurant", "Guided Tours"],
    badge: "Popular",
    statusColor: "bg-green-50",
    TextColor: "text-green-800",
    image: Camp1,
  },
  {
    id: 2,
    name: "Lake Tana Paradise",
    location: "Lake Tana, Bahir Dar",
    rating: 4.8,
    reviews: 89,
    description:
      "Peaceful lakeside camping with water activities, monastery visits, and sunset views.",
    price: 65,
    amenities: ["Kayaking", "Fishing", "WiFi", "Boat Tours"],
    badge: "Available",
    statusColor: "bg-green-100",
    TextColor: "#97C93D",
    image: Camp2,
  },
  {
    id: 3,
    name: "Bale Forest Haven",
    location: "Bale Mountains National Park",
    rating: 4.7,
    reviews: 156,
    description:
      "Nature immersion with wildlife watching, hiking trails, and authentic forest camping.",
    price: 75,
    amenities: ["Hiking", "Wildlife Tours", "Eco-Lodge"],
    badge: "Limited Spots",
    statusColor: "bg-orange-100",
    TextColor: "text-orange-500",
    image: Camp3,
  },
  {
    id: 4,
    name: "Omo Valley Cultural Camp",
    location: "Omo Valley, Southern Ethiopia",
    rating: 4.6,
    reviews: 94,
    description:
      "Immersive cultural experience with local tribes, ceremonies, and traditional hospitality.",
    price: 95,
    amenities: ["Cultural Tours", "Traditional Food", "Local Guide"],
    badge: "Cultural",
    statusColor: "bg-green-50",
    TextColor: "text-green-800",
    image: Omo,
  },
  {
    id: 5,
    name: "Danakil Desert Expedition",
    location: "Danakil Depression, Afar Region",
    rating: 4.9,
    reviews: 67,
    description:
      "Extreme camping in one of Earth's most unique volcanic landscapes.",
    price: 145,
    amenities: ["Volcano Tours", "Salt Mining", "Expert Guide"],
    badge: "Adventure",
    statusColor: "bg-yellow-50",
    TextColor: "text-red-500",
    image: Danakil,
  },
  {
    id: 6,
    name: "Highland Glamping Resort",
    location: "Ethiopian Highlands, Amhara Region",
    rating: 5.0,
    reviews: 43,
    description:
      "Luxury glamping with spa, dining, and panoramic mountain views.",
    price: 225,
    amenities: ["Spa Services", "Fine Dining", "Butler Service"],
    badge: "Luxury",
    statusColor: "bg-gray-50",
    TextColor: "text-purple-500",
    image: HighLand,
  },
];

const ITEMS_PER_PAGE = 6;
const API_URL = "https://ethio-camp-ground-backend-lega.onrender.com/api/campHomeRoutes";

export default function BrowseALLCamps() {
  const [camps, setCamps] = useState(campsData); // initial UI
  const [filteredCamps, setFilteredCamps] = useState(campsData);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    location: "", // empty means no filter
    priceRange: "", // format: "min-max" or "min+"
    rating: "", // numeric string or empty
    amenity: "", // substring
  });

  // Utility: normalize a camp object (safe defaults)
  const normalize = (raw) => {
    return {
      ...raw,
      location: (raw.location || raw.locationName || "").toString(),
      price: Number(raw.price ?? 0),
      rating: Number(raw.rating ?? 0),
      amenities: Array.isArray(raw.amenities) ? raw.amenities : [],
      // keep other fields as-is
    };
  };

  // parse priceRange value robustly
  const parsePriceRange = (val) => {
    if (!val) return null;
    const v = val.replace(/\s/g, ""); // remove spaces
    // handle formats: "0-50", "$0-50", "200+", "$200+"
    const noDollar = v.replace(/\$/g, "");
    if (noDollar.includes("-")) {
      const [a, b] = noDollar.split("-");
      const min = Number(a) || 0;
      const max = Number(b) || Infinity;
      return { min, max };
    }
    if (noDollar.endsWith("+")) {
      const a = noDollar.replace("+", "");
      const min = Number(a) || 0;
      return { min, max: Infinity };
    }
    // single number fallback
    const n = Number(noDollar);
    if (!Number.isNaN(n)) return { min: n, max: n };
    return null;
  };

  // MAIN: called when user clicks Apply Filters
  const applyFilters = async () => {
    try {
      // fetch backend data once when apply is clicked
      const res = await fetch(API_URL);
      const json = await res.json();
      // support either array or {success:true,data:[]}
      const rawArray = Array.isArray(json) ? json : json?.data ?? [];

      const data = rawArray.length ? rawArray.map(normalize) : campsData.map(normalize);
      setCamps(data); // update source data

      // Build result starting from backend data
      let result = data.slice();

      // Location filter (empty -> no filter)
      if (filters.location) {
        const locFilter = filters.location.trim().toLowerCase();
        result = result.filter((c) =>
          (c.location || "").toLowerCase().includes(locFilter)
        );
      }

      // Price filter
      if (filters.priceRange) {
        const pr = parsePriceRange(filters.priceRange);
        if (pr) {
          result = result.filter((c) => c.price >= pr.min && c.price <= pr.max);
        }
      }

      // Rating filter
      if (filters.rating) {
        const minR = Number(filters.rating);
        if (!Number.isNaN(minR)) {
          result = result.filter((c) => Number(c.rating || 0) >= minR);
        }
      }

      // Amenity filter (substring match)
      if (filters.amenity) {
        const aFilter = filters.amenity.trim().toLowerCase();
        result = result.filter((c) =>
          (c.amenities || []).some((a) => (a || "").toString().toLowerCase().includes(aFilter))
        );
      }

      setFilteredCamps(result);
      setPage(1);
    } catch (err) {
      console.error("Apply Filters fetch error:", err);
      // fallback to local data on error
      const local = campsData.map(normalize);
      setCamps(local);
      // apply same filters on local data so behavior consistent
      let result = local.slice();
      if (filters.location) {
        const locFilter = filters.location.trim().toLowerCase();
        result = result.filter((c) =>
          (c.location || "").toLowerCase().includes(locFilter)
        );
      }
      if (filters.priceRange) {
        const pr = parsePriceRange(filters.priceRange);
        if (pr) result = result.filter((c) => c.price >= pr.min && c.price <= pr.max);
      }
      if (filters.rating) {
        const minR = Number(filters.rating);
        if (!Number.isNaN(minR)) result = result.filter((c) => Number(c.rating || 0) >= minR);
      }
      if (filters.amenity) {
        const aFilter = filters.amenity.trim().toLowerCase();
        result = result.filter((c) =>
          (c.amenities || []).some((a) => (a || "").toString().toLowerCase().includes(aFilter))
        );
      }
      setFilteredCamps(result);
      setPage(1);
    }
  };

  const totalPages = Math.max(1, Math.ceil(filteredCamps.length / ITEMS_PER_PAGE));
  const paginated = filteredCamps.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">

      <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse All Camps</h1>
      <p className="text-lg text-gray-600 mb-8">
        Discover unique camping experiences across Ethiopia’s most beautiful landscapes.
      </p>

      {/* Filters (UI unchanged visually) */}
      <div className="bg-gray-50 p-6 rounded-xl mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <select
            className="p-3 border rounded-lg"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          >
            <option value="">All Locations</option>
            <option value="Simien Mountains">Simien Mountains</option>
            <option value="Lake Tana">Lake Tana</option>
            <option value="Bale Mountains">Bale Mountains</option>
            <option value="Omo Valley">Omo Valley</option>
            <option value="Danakil Depression">Danakil Depression</option>
          </select>

          <select
            className="p-3 border rounded-lg"
            value={filters.priceRange}
            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
          >
            <option value="">Any Price</option>
            <option value="0-50">0 - 50</option>
            <option value="50-100">50 - 100</option>
            <option value="100-200">100 - 200</option>
            <option value="200+">$200+</option>
          </select>

          <select
            className="p-3 border rounded-lg"
            value={filters.amenity}
            onChange={(e) => setFilters({ ...filters, amenity: e.target.value })}
          >
            <option value="">All Amenities</option>
            <option value="WiFi">WiFi</option>
            <option value="Hiking">Hiking</option>
            <option value="Guided Tours">Guided Tours</option>
            <option value="Restaurant">Restaurant</option>
          </select>

          <select
            className="p-3 border rounded-lg"
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
          className="mt-4 flex items-center bg-green-700 text-white px-6 py-3 rounded-lg"
        >
          <FiFilter /> Apply Filters
        </button>
      </div>

      {/* Camp Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-8">
        {paginated.map((camp) => (
          <div key={camp._id || camp.id} className="bg-white rounded-xl shadow-sm overflow-hidden">

            <div className="relative">
              <motion.img
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
                src={typeof camp.image === "string" && camp.image.startsWith("/") ? `${window.location.origin}${camp.image}` : camp.image}
                alt={camp.name}
                className="w-full h-full object-cover"
              />

              <span className="absolute top-4 left-4 bg-white px-4 py-1 rounded-full font-semibold text-sm">
                {camp.badge}
              </span>
            </div>

            <div className="p-5">
              <h2 className="text-xl font-semibold">{camp.name}</h2>

              <div className="flex items-center gap-1 text-yellow-500 mt-1">
                <FaStar />
                <span className="font-bold">{camp.rating}</span>
                <span className="text-sm text-gray-500">({camp.reviews ?? 0})</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                <FiMapPin />
                {camp.location}
              </div>

              <p className="text-gray-600 text-sm mt-3">{camp.description}</p>

              {/* Amenities with dynamic colors */}
              <div className="flex flex-wrap gap-2 mt-3">
                {(camp.amenities || []).map((a, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-sm ${camp.statusColor ?? ""}`}
                    style={{
                      color: (camp.TextColor ?? "").includes("#") ? camp.TextColor : undefined,
                    }}
                  >
                    <span className={!(camp.TextColor ?? "").includes("#") ? camp.TextColor : ""}>
                      {a}
                    </span>
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-5">
                <p className="text-lg font-bold text-green-900">
                  ETB{camp.price}
                  <span className="text-gray-500 text-sm">/night</span>
                </p>

               <a href="/login"> <button className="bg-green-700 text-white px-5 py-2 rounded-lg cursor-pointer hover:bg-green-800 transition">
                  Book Now
                </button></a>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-10 gap-3">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          className="p-3 border rounded-lg"
        >
          <FaChevronLeft />
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded-lg border ${page === i + 1 ? "bg-green-700 text-white" : ""}`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          className="p-3 border rounded-lg"
        >
          <FaChevronRight />
        </button>
      </div>

    </div>
  );
}
