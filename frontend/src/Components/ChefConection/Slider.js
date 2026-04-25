import React from "react";
import Slider from "react-slick";
import { handleImageError } from "../../utils/imageUtils";

export default function SimpleSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const slides = [
    {
      image: "/slider1.png",
      title: "Professional Chefs",
      description: "Join our network of skilled culinary professionals"
    },
    {
      image: "/slider2.png", 
      title: "Happy Customers",
      description: "Serve thousands of satisfied families across India"
    },
    {
      image: "/slider3.png",
      title: "Growth Opportunity", 
      description: "Build your business with ChefKart's platform"
    },
    {
      image: "/slider4.png",
      title: "Support System",
      description: "Get training and support to enhance your skills"
    }
  ];

  return (
    <div className="p-5">
      <h1 className="text-5xl text-center mt-5 font-bold text-gray-800">एक प्रमुख पहल</h1>
      <p className="text-center text-xl text-gray-600 mt-3 mb-8">Join India's largest at-home cooking network</p>

      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="px-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src={slide.image} 
                alt={slide.title}
                className="w-full h-64 object-cover"
                onError={(e) => handleImageError(e, "https://via.placeholder.com/600x400?text=" + slide.title.replace(' ', '+'))}
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800">{slide.title}</h3>
                <p className="text-gray-600 mt-2">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
