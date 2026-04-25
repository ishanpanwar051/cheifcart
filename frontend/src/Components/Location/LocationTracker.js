import React from 'react';
import useLocation from '../../hooks/useLocation';

/**
 * LocationTracker Component
 * Displays user's current location with accuracy
 * Handles loading and error states
 */
const LocationTracker = ({ onLocationChange }) => {
  const { location, error, loading } = useLocation({
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  });

  // Call parent callback when location updates
  React.useEffect(() => {
    if (location && onLocationChange) {
      onLocationChange(location);
    }
  }, [location, onLocationChange]);

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 rounded border border-blue-200">
        <p className="text-sm text-blue-700 flex items-center">
          <span className="animate-spin mr-2">⏳</span>
          Getting your location...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded border border-red-200">
        <p className="text-sm text-red-700">
          <span className="mr-2">❌</span>
          {error}
        </p>
        <p className="text-xs text-red-600 mt-2">
          💡 Tip: Make sure to enable location access in your browser permissions
        </p>
      </div>
    );
  }

  if (!location) {
    return null;
  }

  return (
    <div className="p-4 bg-green-50 rounded border border-green-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">📍 Your Location</p>
          <p className="text-sm text-gray-600 mt-1">
            Latitude: {location.latitude.toFixed(6)}
          </p>
          <p className="text-sm text-gray-600">
            Longitude: {location.longitude.toFixed(6)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            ✓ Accuracy: ±{location.accuracy.toFixed(0)}m
          </p>
          {location.altitude && (
            <p className="text-xs text-gray-500">
              ⬆️ Altitude: {location.altitude.toFixed(0)}m
            </p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Last updated: {location.timestamp.toLocaleTimeString()}
          </p>
        </div>
        <div className="text-green-600 text-2xl">✓</div>
      </div>
    </div>
  );
};

export default LocationTracker;
