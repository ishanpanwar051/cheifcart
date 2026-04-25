import React, { useState, useEffect } from "react";

// ✅ FIXED: Slider with reliable Unsplash images + proper overlay + auto-slide
const slides = [
  {
    title: "Most Trusted Platform for At-Home Cooking Services",
    subtitle: "Find your perfect cook",
    bg: "https://images.unsplash.com/photo-1543351611-58f77ddbd4bf?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Professional Chefs Delivered to Your Doorstep",
    subtitle: "Book in just 60 seconds",
    bg: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Trusted By 10K+ Households Across India",
    subtitle: "Verified. Trained. Trusted.",
    bg: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80",
  },
];

const Carousel2 = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url("${slide.bg}")` }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex items-center">
        <div className="w-full md:w-1/2 p-10 md:p-16 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mt-3 leading-tight">{slide.title}</h1>
          <p className="text-2xl md:text-3xl text-orange-400 font-bold mt-8">{slide.subtitle}</p>
          <button className="bg-orange-500 text-white font-bold text-lg px-8 py-4 rounded-md mt-8 shadow-lg hover:bg-orange-600 transition-all duration-300">
            Download Our App
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all ${i === current ? "bg-orange-500 w-8" : "bg-white bg-opacity-60"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel2;
