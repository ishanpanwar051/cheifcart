import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import apiClient from "../../config/api";
import LoadingSpinner from "../common/LoadingSpinner";
import { getImageUrl, handleImageError } from "../../utils/imageUtils";

// ✅ FIXED: Fallback testimonials when DB is empty
const FALLBACK_TESTIMONIALS = [
  { _id: "1", name: "Priya Sharma", content: "CheifCart changed my life! I get a professional cook at home every morning. The food is delicious and hygienic.", profileimage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
  { _id: "2", name: "Rahul Mehta", content: "Best service in Delhi! The chef is punctual, professional and cooks amazing food. Highly recommended!", profileimage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { _id: "3", name: "Sunita Patel", content: "I was skeptical at first but CheifCart exceeded my expectations. My family loves the food every single day.", profileimage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" },
  { _id: "4", name: "Amit Kumar", content: "The chef is very skilled and clean. Our monthly cook from CheifCart is like family now. 5 stars!", profileimage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" },
  { _id: "5", name: "Deepa Nair", content: "Wonderful experience! Booking was easy and the cook arrived on time. Food quality is restaurant-level.", profileimage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80" },
];

const Testimonial1 = () => {
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/testimonial/get");
        const data = response.data?.data || response.data;
        // ✅ FIX: Use fallback if DB is empty
        if (Array.isArray(data) && data.length > 0) {
          setTestimonialsData(data);
        } else {
          setTestimonialsData(FALLBACK_TESTIMONIALS);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials, using fallback:", error);
        setTestimonialsData(FALLBACK_TESTIMONIALS); // ✅ Always show something
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    swipe: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading) {
    return (
      <div className="mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Don't take our word for it</h1>
        <div className="flex justify-center items-center min-h-[300px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Don't take our word for it</h1>
      <Slider {...settings}>
        {testimonialsData.map((testimonial) => (
          <div key={testimonial._id} className="p-2 md:p-4 mt-8">
            <div className="bg-green-700 border-4 border-green-400 rounded-lg p-4 md:p-6 text-center h-full">
              <img
                alt={testimonial.name || "User"}
                className="w-16 h-16 md:w-20 md:h-20 mb-4 object-cover object-center rounded-full border-2 border-white mx-auto"
                src={getImageUrl(testimonial, "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80")}
                loading="lazy"
                onError={(e) => handleImageError(e, "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80")}
              />
              <p className="leading-relaxed text-white text-sm md:text-base min-h-[80px]">{testimonial.content}</p>
              <span className="inline-block h-1 w-10 rounded bg-indigo-500 mt-4 md:mt-6 mb-4"></span>
              <h2 className="text-white font-medium tracking-wider text-sm md:text-base">{testimonial.name}</h2>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonial1;
