const Experience = () => {
 const handleStart = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/campHomeRoutes/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("❌ Error:", data.message);
      return;
    }

    console.log("✅ Camps:", data.data);
  } catch (error) {
    console.log("🔥 Fetch Error:", error);
  }
};

  return (
    <section className="w-full bg-gradient-to-r from-[#2F6236] via-[#5DA043] to-[#97C93D] py-28">
      <div className="max-w-5xl mx-auto text-center px-4">

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Experience the Future of Camping
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/90 mb-12">
          Join thousands of satisfied campers using our platform
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-8 flex-wrap">

          {/* Get Started Button (White) */}
          <button className="
            bg-white 
            text-green-800 
            font-semibold 
            px-12 
            py-4 
            rounded-xl 
            shadow-md 
            hover:bg-gray-100 
            transition cursor-pointer
          "
          onClick={handleStart}>
            Start Exploring
          </button>

          {/* Contact Us Button (White Border) */}
          {/* <button className="
            border-2 
            border-white 
            text-white 
            font-semibold 
            px-12 
            py-4 
            rounded-xl 
            hover:bg-white 
            hover:text-green-800 
            transition cursor-pointer
          ">
            Start Exploring
          </button> */}

        </div>
      </div>
    </section>
  );
};

export default Experience;
