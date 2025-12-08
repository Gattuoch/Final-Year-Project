import React from "react";
import { HiStar, HiOutlineLocationMarker } from "react-icons/hi";
import { motion } from "framer-motion";

import Camp1 from "../../assets/camp1.png";
import Camp2 from "../../assets/camp2.png";
import Camp3 from "../../assets/camp3.png";

const camps = [
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

const BrowseCamps = () => {
  return (
    <section className="w-full py-16">
      <div className="container mx-auto px-6 lg:px-16">

        {/* HEADER */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold text-gray-900"
        >
          Browse All Camps
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 mt-3 text-lg"
        >
          Discover unique camping experiences across Ethiopia
        </motion.p>

        {/* FILTER ROW */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div>
            <label className="text-sm font-medium text-gray-600">Location</label>
            <select className="w-full mt-2 p-4 rounded-xl border">
              <option>All Locations</option>
              <option>Simien Mountains</option>
              <option>Lake Tana</option>
              <option>Bale Mountains</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Price Range</label>
            <select className="w-full mt-2 p-4 rounded-xl border">
              <option>Any Price</option>
              <option>ETB 0 – ETB 100</option>
              <option>ETB 100 – ETB 500</option>
              <option>ETB 500 – ETB 1,000</option>
              <option>ETB 1,000 – ETB 5,000</option>
              <option>ETB 5,000+</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Amenities</label>
            <select className="w-full mt-2 p-4 rounded-xl border-green-800 border">
              <option>All Amenities</option>
              <option>Wifi</option>
              <option>Parking</option>
              <option>Restaurant</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-700 hover:bg-green-800 text-white p-4 rounded-xl text-lg font-medium cursor-pointer"
          >
            Apply Filters
          </motion.button>
        </div>

        {/* CAMPS GRID */}
        <div className="grid md:grid-cols-3 gap-10 mt-14">
          {camps.map((camp, i) => (
            <motion.div
              key={camp.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition overflow-hidden"
            >
              {/* IMAGE */}
              <div className="relative w-full h-64 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  src={camp.image}
                  alt={camp.name}
                  className="w-full h-full object-cover"
                />

                <span
                  className={`absolute top-4 right-4 text-white px-4 py-1 rounded-full text-sm font-semibold ${camp.statusColor}`}
                >
                  {camp.status}
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-6">
                {/* TITLE + RATING */}
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{camp.name}</h2>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <HiStar className="text-xl" />
                    <span className="font-semibold">{camp.rating}</span>
                  </div>
                </div>

                {/* LOCATION */}
                <div className="flex items-center text-green-700 mt-1">
                  <HiOutlineLocationMarker className="text-xl" />
                  <span className="ml-1 text-gray-800">{camp.location}</span>
                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-600 mt-3 text-[15px] leading-relaxed">
                  {camp.description}
                </p>

                {/* TAGS */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {camp.tags.map((tag, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                {/* PRICE + BUTTON */}
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-green-700 font-bold text-xl">
                    ${camp.price}
                    <span className="text-gray-500 text-sm">/night</span>
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-medium cursor-pointer"
                  >
                    View Details
                  </motion.button>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BrowseCamps;
