import React, { useState, useEffect } from "react";
import apiClient from "../config/api";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./common/LoadingSpinner";
import ErrorMessage from "./common/ErrorMessage";
import { getImageUrl, handleImageError } from "../utils/imageUtils";

const ChefDirectory = () => {
  //handle the api calls and data fetching for the chef directory
  //useState to manage the state of chefs and search filters
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //search  filter of chef
  const [search, setSearch] = useState("");
  //useNavigate is used to navigate to different routes
   const navigate = useNavigate();

  const [filters, setFilters] = useState({
    city: "",
    area: "",
    locality: "",
  });

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get("/chef/get");
        if (response.data && response.data.data) {
          setChefs(response.data.data);
        } else if (Array.isArray(response.data)) {
          setChefs(response.data);
        }
      } catch (error) {
        console.error("Error fetching chefs:", error);
        setError(error.message || "Failed to load chefs");
      } finally {
        setLoading(false);
      }
    };

    fetchChefs();
  }, []);
// filter the chefs based on the search input and selected filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  
  const filteredChefs = chefs.filter((chef) => {
    const matchesGlobalSearch =
      chef.name.toLowerCase().includes(search.toLowerCase()) ||
      chef.phone.includes(search);
    const matchesCity =
      filters.city === "" ||
      chef.city?.toLowerCase().includes(filters.city.toLowerCase());
    const matchesArea =
      filters.area === "" ||
      chef.area?.toLowerCase().includes(filters.area.toLowerCase());
    const matchesLocality =
      filters.locality === "" ||
      chef.Address?.toLowerCase().includes(filters.locality.toLowerCase());

    return matchesGlobalSearch && matchesCity && matchesArea && matchesLocality;
  });

  if (loading) {
    return (
      <div className="p-4 bg-gray-100 min-h-screen mt-16">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-100 min-h-screen mt-16">
        <ErrorMessage 
          message={error} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen mt-16">
      {/* Search Filters */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Global Search..."
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="text"
            name="city"
            placeholder="Search by City"
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={filters.city}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="area"
            placeholder="Search by Area"
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={filters.area}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="locality"
            placeholder="Search by Locality"
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={filters.locality}
            onChange={handleFilterChange}
          />
        </div>

        {/* Chefs List */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Trending cooks</h1>
        {filteredChefs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No chefs found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredChefs.map((chef) => (
              <div
                key={chef._id || chef.id}
                onClick={() => navigate(`/chef/${chef._id || chef.id}`)}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 transform hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(chef, "https://via.placeholder.com/400x300?text=Chef")}
                    alt={chef.name || "Chef"}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => handleImageError(e, "https://via.placeholder.com/400x300?text=Chef")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Rating Badge */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center shadow-sm">
                    <span className="text-green-600 font-bold text-sm flex items-center">
                      <span className="mr-1">★</span>
                      {chef.starRating?.toFixed(1) || "4.2"}
                    </span>
                    <span className="mx-1 text-gray-300">|</span>
                    <span className="text-xs text-gray-600 font-medium">
                      {chef.totalRatings || "25+"} ratings
                    </span>
                  </div>

                  {/* Promo Tag (Mock) */}
                  <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
                    Promoted
                  </div>

                  {/* Like Button */}
                  <button className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800 truncate pr-2 group-hover:text-orange-600 transition-colors">
                      {chef.name || "Master Chef"}
                    </h3>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 truncate mb-1">
                      {chef.cuisineRatings && chef.cuisineRatings.length > 0 
                        ? chef.cuisineRatings.map(c => c.cuisine).join(", ") 
                        : "North Indian, Chinese, Continental"}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center">
                      <span className="mr-1">📍</span>
                      {chef.area || "Downtown"}, {chef.city || "Metropolis"}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-dashed border-gray-200">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Experience</span>
                      <span className="text-sm font-semibold text-gray-700">{chef.experience || "5+ Years"}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Starting at</span>
                      <span className="text-sm font-bold text-gray-800">₹{Math.floor(Math.random() * 500) + 200}/meal</span>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <button className="w-full mt-4 py-2 bg-orange-50 text-orange-600 font-bold rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 text-sm uppercase tracking-wide border border-orange-200 hover:border-transparent">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChefDirectory;
