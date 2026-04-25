import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { handleImageError } from "../../utils/imageUtils";

const categories = [
  {
    id: 1,
    name: "North Indian",
    image: "/slider1.png",
  },
  {
    id: 2,
    name: "Biryani",
    image: "/slider2.png",
  },
  {
    id: 3,
    name: "Pizza",
    image: "/slider3.png",
  },
  {
    id: 4,
    name: "Chinese",
    image: "/slider4.png",
  },
  {
    id: 5,
    name: "Burger",
    image: "/image.png",
  },
  {
    id: 6,
    name: "South Indian",
    image: "/slider1.png",
  },
  {
    id: 7,
    name: "Healthy",
    image: "/slider2.png",
  },
];

const CategorySlider = () => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Inspiration for your first order</h2>
      <Slider {...settings}>
        {categories.map((category) => (
          <div key={category.id} className="px-4 text-center cursor-pointer group">
            <div className="relative w-32 h-32 mx-auto mb-3 rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                onError={(e) => handleImageError(e, "https://via.placeholder.com/150x150?text=" + category.name)}
              />
            </div>
            <h3 className="text-lg font-medium text-gray-700 group-hover:text-orange-500 transition-colors">
              {category.name}
            </h3>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CategorySlider;
