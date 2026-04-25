import { useEffect, useState } from 'react';

/**
 * useLocation Hook
 * Tracks user's real-time location using Geolocation API
 * Returns: { location, error, loading }
 * 
 * Usage:
 * const { location, error, loading } = useLocation();
 * if (location) console.log(location.latitude, location.longitude);
 */
const useLocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    console.log('[useLocation] Starting to watch location');

    const watchOptions = {
      enableHighAccuracy: options.enableHighAccuracy ?? true,
      timeout: options.timeout ?? 5000,
      maximumAge: options.maximumAge ?? 0, // Don't use cached position
    };

    // Watch position (continuous updates)
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, altitude } = position.coords;
        
        console.log('[useLocation] Location updated:', { latitude, longitude, accuracy });
        
        setLocation({
          latitude,
          longitude,
          accuracy,
          altitude,
          timestamp: new Date(position.timestamp),
        });
        
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error('[useLocation] Error getting location:', err);
        
        // User denied permission
        if (err.code === 1) {
          setError('Location permission denied. Please enable location in browser settings.');
        }
        // Position unavailable
        else if (err.code === 2) {
          setError('Location information is unavailable.');
        }
        // Timeout
        else if (err.code === 3) {
          setError('Location request timed out.');
        } else {
          setError(err.message || 'An error occurred while getting location');
        }
        
        setLoading(false);
      },
      watchOptions
    );

    // Cleanup on unmount
    return () => {
      console.log('[useLocation] Cleaning up location watch');
      navigator.geolocation.clearWatch(watchId);
    };
  }, [options]);

  return { location, error, loading };
};

export default useLocation;
