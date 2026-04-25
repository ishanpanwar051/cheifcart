import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import apiClient from "../../config/api";
import LoadingSpinner from "../common/LoadingSpinner";
import { getImageUrl, handleImageError } from "../../utils/imageUtils";

// ✅ FIXED: Fallback gallery data
const FALLBACK_GALLERY = [
  { _id: "1", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80" },
  { _id: "2", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80" },
  { _id: "3", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80" },
  { _id: "4", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80" },
  { _id: "5", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80" },
  { _id: "6", image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&q=80" },
];

const GalleryWithState = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedIndex, setZoomedIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/foodgall/getAll");
        const data = response.data?.data || response.data;
        // ✅ FIX: Use fallback if DB is empty
        if (Array.isArray(data) && data.length > 0) {
          setImages(data);
        } else {
          setImages(FALLBACK_GALLERY);
        }
      } catch (error) {
        console.error("Failed to fetch gallery, using fallback:", error);
        setImages(FALLBACK_GALLERY); // ✅ Always show something
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const settings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    draggable: true,
    centerMode: true,
    focusOnSelect: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading) {
    return (
      <div className="bg-[#f1f1f1] py-12">
        <div className="flex justify-center items-center min-h-[300px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f1f1f1] py-12">
      <div className="container mx-auto max-w-7xl px-5">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Chef Gallery</h1>
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={img._id || index} className="px-4 md:px-8">
              <img
                src={getImageUrl(img)}
                alt={img.name || `Gallery ${index + 1}`}
                className="w-full h-48 md:h-64 rounded-md object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => { setZoomedIndex(index); setIsZoomed(true); }}
                loading="lazy"
                onError={(e) => handleImageError(e, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80")}
              />
            </div>
          ))}
        </Slider>

        {isZoomed && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <button className="absolute top-5 right-5 bg-white text-black px-4 py-2 rounded-lg" onClick={() => setIsZoomed(false)}>Close</button>
            <button className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-white text-black px-4 py-2 rounded-lg" onClick={() => setZoomedIndex((prev) => (prev - 1 + images.length) % images.length)}>Prev</button>
            <div className="relative w-full sm:w-2/3 lg:w-1/2 flex justify-center items-center">
              <img
                src={getImageUrl(images[zoomedIndex])}
                alt={`Zoomed ${zoomedIndex}`}
                className="w-full h-auto rounded-lg max-h-[90vh] object-contain"
                onError={(e) => handleImageError(e, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80")}
              />
            </div>
            <button className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-white text-black px-4 py-2 rounded-lg" onClick={() => setZoomedIndex((prev) => (prev + 1) % images.length)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryWithState;
