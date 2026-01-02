import React, { useState, useEffect } from "react";
import { FaCampground } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaAward } from "react-icons/fa";

import AboutImage from "../../assets/team-image.png";

// --------------------------
// COUNTER COMPONENT
// --------------------------
const Counter = ({ end, duration = 2, decimals = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [end, duration]);

  return decimals === 0 ? Math.floor(count) : count.toFixed(decimals);
};

export default function AboutSection() {
  return (
    <div className="w-full bg-white pb-24">

      {/* Top Section */}
      {/* Top Section */}
<div className="text-center pt-20 px-4 sm:px-6 md:px-12">

  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
    About EthioCampGround
  </h1>

  <p className="text-gray-600 text-base sm:text-lg md:text-xl mt-4 leading-relaxed">
    Connecting adventurers with Ethiopia's most stunning camping destinations.
    <br className="hidden sm:block" />
    Join us on this journey in 2025 and beyond.
  </p>

</div>


      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 mt-20 px-6 items-center">

        {/* Left Image */}
        <div>
          <img
            src={AboutImage}
            alt="Team"
            className="w-full rounded-3xl shadow-xl object-cover"
          />
        </div>

        {/* Right Text */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Our Story
          </h2>

          <p className="text-gray-600 text-lg mt-6 leading-relaxed">
            Founded in 2025, EthioCampGround was born from a passion for Ethiopia's
            breathtaking landscapes and a vision to make camping accessible to
            everyone. We recognized the untapped potential of Ethiopia's natural beauty
            and the growing demand for authentic outdoor experiences.
          </p>

          <p className="text-gray-600 text-lg mt-6 leading-relaxed">
            What started as a small platform connecting a handful of camps has grown
            into Ethiopia's premier camping reservation system, serving thousands of
            happy campers and supporting local communities across the country.
          </p>

          <p className="text-gray-600 text-lg mt-6 leading-relaxed">
            Today, we partner with over 500 camps nationwide, offering everything from
            luxury glamping to rugged wilderness adventures—all while maintaining our
            commitment to sustainable tourism and community empowerment.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 mt-24 px-6">

        {/* Card 1 */}
        <div className="bg-white shadow-md rounded-3xl p-10 text-center border border-gray-100">
          <FaCampground size={45} className="text-green-900 mx-auto" />
          <h2 className="text-4xl font-bold text-green-900 mt-4"><Counter end={500}/>+</h2>
          <p className="text-gray-600 text-lg mt-2">Partner Camps</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-md rounded-3xl p-10 text-center border border-gray-100">
          <FaUsers size={45} className="text-[#97C93D] mx-auto" />
          <h2 className="text-4xl font-bold text-[#97C93D] mt-4"><Counter end={50} />K+</h2>
          <p className="text-gray-600 text-lg mt-2">Happy Campers</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-md rounded-3xl p-10 text-center border border-gray-100">
          <FaStar size={45} className="text-yellow-500 mx-auto" />
          <h2 className="text-4xl font-bold text-yellow-500 mt-4"><Counter end={4.8} decimals={1} />/5</h2>
          <p className="text-gray-600 text-lg mt-2">Average Rating</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white shadow-md rounded-3xl p-10 text-center border border-gray-100">
          <FaAward size={45} className="text-green-700 mx-auto" />
          <h2 className="text-4xl font-bold text-green-700 mt-4"><Counter end={15} />+</h2>
          <p className="text-gray-600 text-lg mt-2">Awards Won</p>
        </div>

      </div>
    </div>
  );
}
