import React, { useState, useEffect } from "react";
import apiClient from "../../config/api";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";
import { getImageUrl, handleImageError } from "../../utils/imageUtils";

const TabSwitchComponent = () => {
  const [activeTab, setActiveTab] = useState("For Singles");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get("/home/getAll");
        if (response.data && response.data.data) {
          setData(response.data.data);
        } else if (Array.isArray(response.data)) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching home content:", error);
        setError(error.message || "Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const filteredData = data.find((item) => item.category === activeTab);

  if (loading) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-5">
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-5">
          <ErrorMessage 
            message={error} 
            onRetry={() => window.location.reload()} 
          />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-5">
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-black font-bold text-center mb-8">
          Healthy food cooked in your kitchen, <br className="hidden md:block" /> whenever you want!
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 mt-5">
          {["For Singles", "For Families", "For Students", "For Couples"].map((tab) => (
            <button
              key={tab}
              className={`px-4 md:px-6 py-2 md:py-3 text-base md:text-lg font-semibold transition-colors ${
                activeTab === tab
                  ? "text-orange-600 border-b-4 border-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {filteredData ? (
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
            {/* Image */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <img
                src={getImageUrl(filteredData)}
                alt={filteredData.title || "Content image"}
                className="rounded-lg shadow-md w-full max-w-md object-cover"
                loading="lazy"
                onError={(e) => handleImageError(e)}
              />
            </div>
            {/* Text */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{filteredData.title}</h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">{filteredData.content}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No content available for this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TabSwitchComponent;
