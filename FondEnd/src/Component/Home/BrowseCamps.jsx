import React, { useState, useEffect } from "react";
import { HiStar, HiOutlineLocationMarker } from "react-icons/hi";
import { motion } from "framer-motion";

import Camp1 from "../../assets/camp1.png";
import Camp2 from "../../assets/camp2.png";
import Camp3 from "../../assets/camp3.png";

const localCamps = [
  {
    id: 1,
    name: "Simien Mountain Retreat",
    location: "Simien Mountains",
    rating: 4.9,
    price: 85,
    status: "Available",
    statusColor: "bg-green-700",
    image: Camp1,
    tags: ["WiFi", "Parking", "Restaurant"],
    description: "Luxury camping with breathtaking mountain views and modern amenities.",
  },
  {
    id: 2,
    name: "Lake Tana Paradise",
    location: "Lake Tana",
    rating: 4.8,
    price: 65,
    status: "Available",
    statusColor: "bg-green-700",
    image: Camp2,
    tags: ["Kayaking", "Fishing", "WiFi"],
    description: "Peaceful lakeside camping with water activities and stunning views.",
  },
  {
    id: 3,
    name: "Bale Forest Haven",
    location: "Bale Mountains",
    rating: 4.7,
    price: 75,
    status: "Limited",
    statusColor: "bg-orange-500",
    image: Camp3,
    tags: ["Hiking", "Wildlife", "WiFi"],
    description: "Nature immersion with wildlife watching and hiking trails.",
  },
];

const API_URL = "http://localhost:5000/api/campHomeRoutes";
const ITEMS_PER_PAGE = 6;

const BrowseCamp= () => {
  const [camps, setCamps] = useState(localCamps);
  const [filteredCamps, setFilteredCamps] = useState(localCamps);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    location: "",
    priceRange: "",
    amenity: "",
    rating: "",
  });

  // Normalizer
  const normalize = (raw) => ({
    ...raw,
    location: (raw.location || "").toString(),
    price: Number(raw.price ?? 0),
    rating: Number(raw.rating ?? 0),
    amenities: Array.isArray(raw.amenities)
      ? raw.amenities
      : raw.tags || [],
  });

  // Convert price range text → numbers
  const parsePriceRange = (val) => {
    if (!val) return null;
    const cleaned = val.replace(/[^\d\-+]/g, "").trim();

    if (cleaned.includes("-")) {
      const [min, max] = cleaned.split("-").map((n) => Number(n.trim()));
      return { min, max };
    }
    if (cleaned.endsWith("+")) {
      const min = Number(cleaned.replace("+", ""));
      return { min, max: Infinity };
    }
    return null;
  };

  // Apply all filters
  const applyFilters = async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();

      const backendData = Array.isArray(json) ? json : json?.data ?? [];
      const data = backendData.length
        ? backendData.map(normalize)
        : localCamps.map(normalize);

      setCamps(data);

      let result = data.slice();

      // Location
      if (filters.location) {
        const loc = filters.location.toLowerCase();
        result = result.filter((c) =>
          c.location.toLowerCase().includes(loc)
        );
      }

      // Price
      if (filters.priceRange) {
        const p = parsePriceRange(filters.priceRange);
        if (p) {
          result = result.filter((c) => c.price >= p.min && c.price <= p.max);
        }
      }

      // Rating
      if (filters.rating) {
        result = result.filter(
          (c) => Number(c.rating) >= Number(filters.rating)
        );
      }

      // Amenity
      if (filters.amenity) {
        const a = filters.amenity.toLowerCase();
        result = result.filter((c) =>
          (c.amenities || []).some((am) =>
            am.toLowerCase().includes(a)
          )
        );
      }

      setFilteredCamps(result);
      setPage(1);
    } catch (err) {
      console.log("Error fetching:", err);
      setFilteredCamps(localCamps);
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCamps.length / ITEMS_PER_PAGE)
  );
  const paginated = filteredCamps.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <section className="w-full py-16">
      <div className="container mx-auto px-6 lg:px-16">

        {/* HEADER */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold text-gray-900"
        >
          Browse All Camps
        </motion.h1>

        <p className="text-gray-600 mt-3 text-lg">
          Discover unique camping experiences across Ethiopia
        </p>

        {/* FILTERS */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Location */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Location
            </label>
            <select
              className="w-full mt-2 p-4 rounded-xl border"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            >
              <option value="">All Locations</option>
              <option value="Simien Mountains">Simien Mountains</option>
              <option value="Lake Tana">Lake Tana</option>
              <option value="Bale Mountains">Bale Mountains</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Price Range
            </label>
            <select
              className="w-full mt-2 p-4 rounded-xl border"
              value={filters.priceRange}
              onChange={(e) =>
                setFilters({ ...filters, priceRange: e.target.value })
              }
            >
              <option value="">Any Price</option>
              <option value="0-100">ETB 0 – ETB 100</option>
              <option value="100-500">ETB 100 – ETB 500</option>
              <option value="500-1000">ETB 500 – ETB 1,000</option>
              <option value="1000-5000">ETB 1,000 – ETB 5,000</option>
              <option value="5000+">ETB 5,000+</option>
            </select>
          </div>

          {/* Amenities */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Amenities
            </label>
            <select
              className="w-full mt-2 p-4 rounded-xl border"
              value={filters.amenity}
              onChange={(e) =>
                setFilters({ ...filters, amenity: e.target.value })
              }
            >
              <option value="">All Amenities</option>
              <option value="wifi">WiFi</option>
              <option value="parking">Parking</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="mt-4 flex items-center bg-green-700 text-white px-6 py-3 rounded-lg justify-center"
            onClick={applyFilters}
          >
            Apply Filters
          </motion.button>
        </div>

        {/* CAMPS GRID */}
        <div className="grid md:grid-cols-3 gap-10 mt-14">
          {paginated.map((camp, i) => (
            <motion.div
              key={camp._id || camp.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white rounded-3xl shadow-md hover:shadow-2xl overflow-hidden"
            >
              {/* IMAGE */}
              <div className="relative h-64 w-full overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  src={
                    typeof camp.image === "string" &&
                    camp.image.startsWith("/")
                      ? `${window.location.origin}${camp.image}`
                      : camp.image
                  }
                  alt={camp.name}
                  className="w-full h-full object-cover"
                />

                <span
                  className={`absolute top-4 right-4 px-4 py-1 text-white rounded-full ${camp.statusColor}`}
                >
                  {camp.status}
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-6">

                {/* Title + Rating */}
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold">{camp.name}</h2>
                  <div className="flex items-center text-yellow-500">
                    <HiStar className="mr-1" />
                    {camp.rating}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center text-green-700">
                  <HiOutlineLocationMarker className="mr-1" />
                  <span>{camp.location}</span>
                </div>

                {/* Desc */}
                <p className="text-gray-600 mt-3">{camp.description}</p>

                {/* TAGS */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {(camp.tags || camp.amenities || []).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* PRICE */}
                <div className="mt-6 flex justify-between items-center">
                  <p className="text-green-700 font-bold text-xl">
                    ETB {camp.price}
                  </p>
                  <a href="/login">
                  <button className="bg-green-700 text-white px-6 py-3 rounded-xl">
                    Book Now
                  </button>
                  </a>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BrowseCamp;
