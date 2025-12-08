import React from "react";
import { HiStar } from "react-icons/hi";
import { motion } from "framer-motion";

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

        {/* CARDS */}
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
              {/* IMAGE */}
              <motion.img
                src={camp.image}
                alt={camp.title}
                className="w-full h-64 object-cover rounded-t-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />

              {/* CONTENT */}
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

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-xl shadow-md transition cursor-pointer"
                  >
                    Book Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* VIEW ALL */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 border border-green-700 text-green-700 rounded-xl text-lg hover:bg-green-50 transition cursor-pointer"
          >
            View All Camps
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturedCamps;
