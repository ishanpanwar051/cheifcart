import React from "react";

// ✅ FIXED: Banner with proper overlay and Unsplash image
const FoodBanner1 = () => {
  return (
    <div
      className="relative h-[400px] bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')" }}
    >
      {/* ✅ FIX: Proper dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-4">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white">
          What's better than your favourite food?
        </h2>
        <p className="text-4xl md:text-6xl font-bold text-orange-400 mt-6 leading-tight">
          Getting it cooked in<br /> your kitchen.
        </p>
        <button className="mt-8 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 shadow-xl">
          Book a Chef Now
        </button>
      </div>
    </div>
  );
};

export default FoodBanner1;
