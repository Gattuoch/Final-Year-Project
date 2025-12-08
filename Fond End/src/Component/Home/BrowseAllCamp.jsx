import React, { useEffect, useState } from "react";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiMapPin, FiFilter } from "react-icons/fi";
import { motion } from "framer-motion";

import Camp1 from "../../assets/camp1.png";
import Camp2 from "../../assets/camp2.png";
import Camp3 from "../../assets/camp3.png";

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
    image: Camp1,
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
    image: Camp2,
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
    image: Camp3,
  },
];

// ---------------------------------------------------------

const ITEMS_PER_PAGE = 6;

export default function BrowseALLCamps() {
  const [camps, setCamps] = useState([]);
  const [page, setPage] = useState(1);

  // ------------ FETCH CAMPS FROM BACKEND WITH FALLBACK ------------
  useEffect(() => {
    fetch("http://localhost:5000/api/camps")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCamps(data);
        } else {
          setCamps(campsData); // fallback if backend is empty
        }
      })
      .catch(() => setCamps(campsData)); // fallback if fetch fails
  }, []);

  const totalPages = Math.ceil(camps.length / ITEMS_PER_PAGE);
  const paginated = camps.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">

      <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse All Camps</h1>
      <p className="text-lg text-gray-600 mb-8">
        Discover unique camping experiences across Ethiopia’s most beautiful landscapes.
      </p>

      {/* Filters */}
      <div className="bg-gray-50 p-6 rounded-xl mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <select className="p-3 border rounded-lg">
            <option>All Locations</option>
            <option>Simien Mountains</option>
            <option>Lake Tana</option>
            <option>Bale Mountains</option>
            <option>Omo Valley</option>
            <option>Danakil Depression</option>
          </select>

          <select className="p-3 border rounded-lg">
            <option>Any Price</option>
            <option>$0 - $50</option>
            <option>$50 - $100</option>
            <option>$100 - $200</option>
            <option>$200+</option>
          </select>

          <select className="p-3 border rounded-lg">
            <option>All Amenities</option>
            <option>WiFi</option>
            <option>Hiking</option>
            <option>Guided Tours</option>
            <option>Restaurant</option>
          </select>

          <select className="p-3 border rounded-lg">
            <option>Any Rating</option>
            <option>4.0+</option>
            <option>4.5+</option>
            <option>5.0</option>
          </select>
        </div>

        <button className="mt-4 flex items-center bg-green-700 text-white px-6 py-3 rounded-lg">
          <FiFilter /> Apply Filters
        </button>
      </div>

      {/* Camp Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-8">
        {paginated.map((camp) => (
          <div key={camp.id} className="bg-white rounded-xl shadow-sm overflow-hidden">

            <div className="relative">
              <motion.img
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
                src={camp.image}
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
                <span className="text-sm text-gray-500">({camp.reviews})</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                <FiMapPin />
                {camp.location}
              </div>

              <p className="text-gray-600 text-sm mt-3">{camp.description}</p>

              {/* Amenities with dynamic colors */}
              <div className="flex flex-wrap gap-2 mt-3">
                {camp.amenities.map((a, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-sm ${camp.statusColor}`}
                    style={{
                      color: camp.TextColor.includes("#") ? camp.TextColor : undefined,
                    }}
                  >
                    <span className={!camp.TextColor.includes("#") ? camp.TextColor : ""}>
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

                <button className="bg-green-700 text-white px-5 py-2 rounded-lg">
                  Book Now
                </button>
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
            className={`px-4 py-2 rounded-lg border ${
              page === i + 1 ? "bg-green-700 text-white" : ""
            }`}
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
