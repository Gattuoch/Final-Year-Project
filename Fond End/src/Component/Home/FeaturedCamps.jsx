import React, { useState } from "react";
import { HiStar } from "react-icons/hi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// IMAGES
import Camp1 from "../../assets/camp1.png";
import Camp2 from "../../assets/camp2.png";
import Camp3 from "../../assets/camp3.png";

const camps = [
  {
    id: 1,
    title: "Simien Mountain Retreat",
    rating: 4.9,
    price: 85,
    image: Camp1,
    description:
      "Experience breathtaking views and luxury amenities in the heart of Simien Mountains.",
  },
  {
    id: 2,
    title: "Lake Tana Paradise",
    rating: 4.8,
    price: 65,
    image: Camp2,
    description:
      "Peaceful lakeside camping with water activities and stunning sunset views.",
  },
  {
    id: 3,
    title: "Bale Forest Haven",
    rating: 4.7,
    price: 75,
    image: Camp3,
    description:
      "Immerse yourself in nature with wildlife watching and hiking trails.",
  },
];

const FeaturedCamps = () => {
  const [exploreResults, setExploreResults] = useState([]);

  const loadAllCamps = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/campHomeRoutes/all");
      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setExploreResults(data.data);
      toast.success("Loaded all camps!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load camps.");
    }
  };

  const handleLearnMore = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/campHomeRoutes/${id}`);
      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      console.log("Camp details:", data.data);
      toast.success("Loaded camp details!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch camp details.");
    }
  };

  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-16">
        
        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Featured Camps
          </h2>
          <p className="text-gray-600 text-lg mt-3">
            Explore our most popular camping destinations
          </p>
        </motion.div>

        {/* FEATURED CARDS */}
        <div className="grid md:grid-cols-3 gap-10">
          {camps.map((camp, index) => (
            <motion.div
              key={camp.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white shadow-xl rounded-3xl overflow-hidden cursor-pointer"
            >
              <motion.img
                src={camp.image}
                alt={camp.title}
                className="w-full h-64 object-cover rounded-t-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />

              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {camp.title}
                  </h3>

                  <div className="flex items-center text-yellow-500 font-semibold">
                    <HiStar className="mr-1" />
                    {camp.rating}
                  </div>
                </div>

                <p className="text-gray-600 mt-3">{camp.description}</p>

                <div className="flex justify-between items-center mt-6">
                  <p className="text-green-700 font-bold text-xl">
                    ${camp.price}
                    <span className="text-gray-500 text-sm">/night</span>
                  </p>

                  <a href="/login">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-xl shadow-md"
                    >
                      Book Now
                    </motion.button>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* VIEW ALL CAMPS BUTTON */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadAllCamps}
            className="px-8 py-3 border border-green-700 text-green-700 rounded-xl text-lg hover:bg-green-50"
          >
            View All Camps
          </motion.button>
        </motion.div>

        {/* EXPLORE RESULTS SECTION */}
        {exploreResults.length > 0 && (
          <div className="mt-10 bg-white p-6 rounded-xl shadow border border-gray-200">
            <h3 className="text-2xl font-bold text-green-700 mb-4">
              All Camps
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {exploreResults.map((camp) => (
                <div
                  key={camp._id}
                  className="border rounded-xl p-4 shadow hover:shadow-lg transition"
                >
                  <h4 className="text-lg font-semibold">{camp.name}</h4>
                  <p className="text-gray-600">{camp.location}</p>
                  <p className="text-green-700 font-bold mt-2">
                    ${camp.price}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLearnMore(camp._id)}
                    className="mt-4 w-full border border-green-700 text-green-700 font-medium px-6 py-3 rounded-xl hover:bg-green-50"
                  >
                    Learn More
                  </motion.button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCamps;
