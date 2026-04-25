import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import apiClient from "../../config/api";
import LoadingSpinner from "../common/LoadingSpinner";
import { getImageUrl, handleImageError } from "../../utils/imageUtils";

// ✅ FIXED: Fallback food data when API/DB is empty
const FALLBACK_FOODS = [
  { _id: "1", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80", name: "Chicken Biryani" },
  { _id: "2", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80", name: "Margherita Pizza" },
  { _id: "3", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", name: "BBQ Burger" },
  { _id: "4", image: "https://images.unsplash.com/photo-1617196034238-26de2b6e0e56?w=400&q=80", name: "Dragon Sushi" },
  { _id: "5", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80", name: "Fresh Salad" },
  { _id: "6", image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&q=80", name: "Mutton Biryani" },
];

const GalleryAutoSlideZoom = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const cuisines = ["Indian", "Chinese", "Mexican", "Italian"];
  const [currentCuisine, setCurrentCuisine] = useState(cuisines[0]);
  const [centerIndex, setCenterIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/food/getAll");
        const data = response.data?.data || response.data;
        // ✅ FIX: Use fallback if DB is empty
        if (Array.isArray(data) && data.length > 0) {
          setImages(data);
        } else {
          setImages(FALLBACK_FOODS);
        }
      } catch (error) {
        console.error("Error fetching food images, using fallback:", error);
        setImages(FALLBACK_FOODS); // ✅ Always show something
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCuisine((prev) => {
        const idx = cuisines.indexOf(prev);
        return cuisines[(idx + 1) % cuisines.length];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const settings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    focusOnSelect: true,
    afterChange: (current) => setCenterIndex(current),
    responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }],
  };

  if (loading) {
    return (
      <div className="bg-white py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto max-w-7xl px-5">
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-gray-700 font-bold mb-8 text-center">
          Craving{" "}
          <span className="text-orange-500 font-bold">{currentCuisine}</span>{" "}
          food? Our Multi-Cuisine Experts <br className="hidden md:block" /> Have Got You!
        </h1>
        <Slider {...settings}>
          {images.map((item, index) => (
            <div key={item._id || index} className="px-4 md:px-10 lg:px-20 mt-10 md:mt-20">
              <div className={`group transition-transform duration-500 ease-in-out ${index === centerIndex ? "scale-125 md:scale-150" : "scale-90"}`}>
                <img
                  src={getImageUrl(item)}
                  alt={item.name || `Food ${index + 1}`}
                  className="object-cover w-full h-64 md:h-80 lg:h-96 rounded-2xl"
                  loading="lazy"
                  onError={(e) => handleImageError(e, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80")}
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default GalleryAutoSlideZoom;
