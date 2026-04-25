import React from "react";
import { FaUtensils, FaUserCheck, FaHome } from "react-icons/fa";

const StatsSection = () => {
  const stats = [
    {
      number: "3M+",
      label: "Meals cooked with love",
      icon: <FaUtensils className="text-4xl text-orange-500" />
    },
    {
      number: "4500+", 
      label: "Verified & Trained Cooks",
      icon: <FaUserCheck className="text-4xl text-orange-500" />
    },
    {
      number: "10K+",
      label: "Households served", 
      icon: <FaHome className="text-4xl text-orange-500" />
    }
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Our Impact in Numbers
        </h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 min-w-[200px]"
            >
              <div className="mb-4">{stat.icon}</div>
              <div className="text-5xl font-bold text-black mb-2">{stat.number}</div>
              <p className="text-gray-600 text-lg font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
