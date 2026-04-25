import React, { useState } from 'react';
import apiClient from '../../config/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const ChefSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [minRating, setMinRating] = useState('');
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const searchChefs = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (city) params.append('city', city);
      if (minRating) params.append('minRating', minRating);
      params.append('page', page);
      params.append('limit', 10);

      const response = await apiClient.get(`/chef/search?${params}`);
      
      setChefs(response.data.data);
      setPagination(response.data.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search chefs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchChefs(1);
  };

  const handleRetry = () => {
    searchChefs(currentPage);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Find Your Perfect Chef</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by name, city, or description
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search chefs..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter city..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>
        </div>
        
        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Search Chefs
        </button>
      </form>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {loading && <LoadingSpinner text="Searching chefs..." />}
        
        {error && <ErrorMessage message={error} onRetry={handleRetry} />}
        
        {!loading && !error && (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                {pagination ? `Found ${pagination.total} chefs` : 'Search for chefs'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chefs.map((chef) => (
                <div key={chef._id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  {chef.profilepic && (
                    <img
                      src={chef.profilepic}
                      alt={chef.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h3 className="font-semibold text-lg mb-2">{chef.name}</h3>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">City:</span> {chef.city}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Experience:</span> {chef.experience} years
                  </p>
                  <div className="flex items-center mb-2">
                    <span className="font-medium mr-2">Rating:</span>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1">{chef.starRating?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    View Profile
                  </button>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  onClick={() => searchChefs(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {currentPage} of {pagination.pages}
                </span>
                <button
                  onClick={() => searchChefs(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChefSearch;
