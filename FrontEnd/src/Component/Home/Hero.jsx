import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CampVeiw from "../../assets/Hero-image.png";
import toast from "react-hot-toast";
import { HiLocationMarker, HiCalendar, HiUser, HiSearch } from "react-icons/hi";

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

// --------------------------
// SEARCH BAR COMPONENT
// --------------------------
const SearchBar = () => {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [backendMessage, setBackendMessage] = useState("");
  const [loading, setLoading] = useState(false); // ⭐ ADDED

 const handleSearch = async () => {
  try {
    setSearched(true);
    setLoading(true);

    const query = new URLSearchParams({
      location,
      guests,
      checkIn,
      checkOut,
    });

    const res = await fetch(
      `https://ethio-camp-ground-backend-lega.onrender.com/api/campHomeRoutes/search?${query.toString()}`
    );

    const data = await res.json();

    setBackendMessage(data.message || "");
    setResults(data.data || []);

    // ⭐ DISPLAY BACKEND MESSAGE AS TOAST
    toast.dismiss();
    toast(data.message, {
      icon: "🌟",
    });

    setLoading(false);
  } catch (err) {
    console.error("Search error:", err);

    toast.error("Server error. Please try again.");
    setBackendMessage("Server error. Please try again.");

    setLoading(false);
  }
};



  return (
    <>
      {/* SEARCH BAR */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full bg-white shadow-lg rounded-3xl p-6 mt-10 border border-gray-100"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Where do you want to camp?
        </h2>

        <div className="grid md:grid-cols-5 gap-4 items-end">
          {/* LOCATION */}
          <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Location</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3">
              <HiLocationMarker className="text-gray-500 w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Where to?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full outline-none text-gray-700"
              />
            </div>
          </motion.div>

          {/* CHECK-IN */}
          <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Check-in</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3">
              <HiCalendar className="text-gray-500 w-5 h-5 mr-2" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full outline-none text-gray-700"
              />
            </div>
          </motion.div>

          {/* CHECK-OUT */}
          <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Check-out</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3">
              <HiCalendar className="text-gray-500 w-5 h-5 mr-2" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full outline-none text-gray-700"
              />
            </div>
          </motion.div>

          {/* GUESTS */}
          <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Guests</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3">
              <HiUser className="text-gray-500 w-5 h-5 mr-2" />
              <select
                className="w-full bg-transparent outline-none text-gray-700"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5 Guests +</option>
              </select>
            </div>
          </motion.div>

          {/* SEARCH BUTTON */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <button
              onClick={handleSearch}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-medium text-lg px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <HiSearch className="w-5 h-5" />
              Search
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* SEARCH RESULTS */}
      {searched && (
        <div className="mt-10 bg-white p-6 rounded-xl shadow border border-gray-200">
          {/* LOADING UI */}
          {loading && (
            <p className="text-center text-green-700 font-semibold animate-pulse text-lg">
              Searching camps...
            </p>
          )}

          {/* RESULTS */}
          {!loading && results.length > 0 && (
            <>
              <p className="text-green-700 font-semibold mb-4">{backendMessage}</p>

              <div className="grid md:grid-cols-3 gap-6">
                {results.map((camp) => (
                  <div
                    key={camp._id}
                    className="border rounded-xl p-4 shadow hover:shadow-lg transition"
                  >
                    <h4 className="text-lg font-semibold">{camp.name}</h4>
                    <p className="text-gray-600">{camp.location}</p>
                    <p className="text-green-700 font-bold mt-2">${camp.price}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* NO DATA MESSAGE FROM BACKEND */}
          {!loading && results.length === 0 && (
            <p className="text-center text-gray-500 font-medium">{backendMessage}</p>
          )}
        </div>
      )}
    </>
  );
};

// --------------------------
// HERO SECTION
// --------------------------
const Hero = () => {

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

    console.log("Camp Details:", data.data);
    toast.success("Loaded camp details!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch camp details");
  }
};


  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-20 md:py-28">
      <div className="container mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-10 items-center">
        {/* LEFT TEXT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Discover Your <br />
            Perfect Camp <br />
            Experience
          </h1>

          <p className="text-gray-600 text-lg md:text-xl">
            Book unique camping spots across Ethiopia. From mountain retreats to
            lakeside havens, find your next adventure with ease.
          </p>
{/* EXPLORE CAMPS BUTTON */}
<div className="flex gap-4 pt-4">
  <motion.button
    whileHover={{ scale: 1.07 }}
    whileTap={{ scale: 0.95 }}
    onClick={loadAllCamps}
    className="mt-6 bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-3 rounded-xl shadow-md"
  >
    Explore Camps
  </motion.button>
</div>

{/* Explore Results */}
{exploreResults.length > 0 && (
  <div className="mt-10 bg-white p-6 rounded-xl shadow border border-gray-200">
    <h3 className="text-2xl font-bold text-green-700 mb-4">All Camps</h3>

    <div className="grid md:grid-cols-3 gap-6">
      {exploreResults.map((camp) => (
        <div
          key={camp._id}
          className="border rounded-xl p-4 shadow hover:shadow-lg transition"
        >
          <h4 className="text-lg font-semibold">{camp.name}</h4>
          <p className="text-gray-600">{camp.location}</p>
          <p className="text-green-700 font-bold mt-2">${camp.price}</p>

          {/* LEARN MORE BUTTON (Works 100%) */}
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

          {/* STATS */}
          <div className="flex gap-10 pt-8">
            <div>
              <p className="text-3xl font-bold text-green-700">
                <Counter end={500} />+
              </p>
              <p className="text-gray-500 text-sm">Active Camps</p>
            </div>

            <div>
              <p className="text-3xl font-bold text-green-700">
                <Counter end={10} />k+
              </p>
              <p className="text-gray-500 text-sm">Happy Campers</p>
            </div>

            <div>
              <p className="text-3xl font-bold text-green-700">
                <Counter end={4.8} decimals={1} />★
              </p>
              <p className="text-gray-500 text-sm">Average Rating</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl overflow-hidden shadow-xl"
        >
          <motion.img
            src={CampVeiw}
            alt="Camp View"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      </div>

      {/* SEARCH BAR */}
      <div className="container mx-auto px-6 lg:px-12">
        <SearchBar />
      </div>
    </section>
  );
};

export default Hero;
