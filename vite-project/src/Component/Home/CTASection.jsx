const CTASection = () => {
  return (
    <section className="w-full bg-gradient-to-r from-[#2F6236] via-[#5DA043] to-[#97C93D] py-28">
      <div className="max-w-5xl mx-auto text-center px-4">

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Ready to Start Your Adventure?
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/90 mb-12">
          Join thousands of happy campers and discover Ethiopia's best camping spots
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
          ">
            Get Started
          </button>

          {/* Contact Us Button (White Border) */}
          <button className="
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
            Contact Us
          </button>

        </div>
      </div>
    </section>
  );
};

export default CTASection;
