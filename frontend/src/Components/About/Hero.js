import React from 'react';
import { handleImageError } from '../../utils/imageUtils';

const Hero = () => {
  return (
    <div>
      <section className="text-gray-600 bg-[#e5e5e5] body-font">
        <div className="container mx-auto flex px-4 sm:px-5 py-12 md:py-16 lg:py-24 md:flex-row flex-col items-center">
          {/* Text Section */}
          <div className="lg:flex-grow md:w-1/2 lg:pr-12 xl:pr-24 md:pr-8 flex flex-col md:items-start md:text-left mb-8 md:mb-0 items-center text-center">
            <p className="title-font rounded-lg inline-block px-3 py-1 mb-4 text-sm md:text-base font-medium text-white bg-green-700">
              <span>Our Story</span>
            </p>
            <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-black font-bold leading-tight">
              Embracing the goal of <span className='text-green-800 font-bold'> Change and Empowerment</span>
            </h1>
            <p className='text-black text-lg sm:text-xl md:text-2xl mb-8 leading-relaxed max-w-2xl'>
              We aim to bridge the gap between delicious food and a healthy lifestyle while empowering our cooks.
            </p>
            <div className="flex justify-center md:justify-start">
              <button className="inline-flex mt-4 md:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white bg-black border-0 py-3 px-6 md:py-4 md:px-8 rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl">
                Contact Us
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-full sm:w-5/6 mb-8 md:mb-0">
            <img
              className="object-cover object-center rounded-lg shadow-lg w-full h-auto"
              alt="hero"
              src="https://images.unsplash.com/photo-1498575207490-3e3c7c6b3bc0?auto=format&fit=crop&w=1200&q=80"
              loading="lazy"
              onError={(e) => handleImageError(e, "https://via.placeholder.com/600x400?text=Hero+Image")}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
