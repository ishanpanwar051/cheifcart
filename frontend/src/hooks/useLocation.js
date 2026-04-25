import { useEffect, useState, useCallback } from 'react';

/**
 * useLocation Hook
 * Tracks user's real-time location using Geolocation API
 * Returns: { location, error, loading, getLocation, watchLocation, stopWatching, calculateDistance }
 * 
 * Usage:
 * const { location, error, loading, getLocation } = useLocation();
 * getLocation(); // Get one-time location
 */
const useLocation = (options = { autoWatch: false }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [watchId, setWatchId] = useState(null);

  /**
   * Get current location once
   */
  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy, altitude } = position.coords;
        
        console.log('[useLocation] Current location:', { latitude, longitude, accuracy });
        
        setLocation({
          latitude,
          longitude,
          accuracy,
          altitude,
          timestamp: new Date(position.timestamp),
        });
        
        setLoading(false);
      },
      (err) => {
        console.error('[useLocation] Error getting location:', err);
        
        let errorMsg = 'An error occurred while getting location';
        if (err.code === 1) {
          errorMsg = 'Location permission denied';
        } else if (err.code === 2) {
          errorMsg = 'Location information is unavailable';
        } else if (err.code === 3) {
          errorMsg = 'Location request timed out';
        }
        
        setError(errorMsg);
        setLoading(false);
      },
      {
        enableHighAccuracy: options.enableHighAccuracy ?? true,
        timeout: options.timeout ?? 10000,
        maximumAge: options.maximumAge ?? 0,
      }
    );
  }, [options]);

  /**
   * Start watching location
   */
  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, altitude } = position.coords;
        
        console.log('[useLocation] Position updated:', { latitude, longitude, accuracy });
        
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
        console.error('[useLocation] Watch error:', err);
        
        let errorMsg = 'An error occurred while watching location';
        if (err.code === 1) {
          errorMsg = 'Location permission denied';
        } else if (err.code === 2) {
          errorMsg = 'Location information is unavailable';
        } else if (err.code === 3) {
          errorMsg = 'Location request timed out';
        }
        
        setError(errorMsg);
        setLoading(false);
      },
      {
        enableHighAccuracy: options.enableHighAccuracy ?? true,
        timeout: options.timeout ?? 10000,
        maximumAge: options.maximumAge ?? 0,
      }
    );

    setWatchId(id);
    console.log('[useLocation] Started watching position');
  }, [options]);

  /**
   * Stop watching location
   */
  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      console.log('[useLocation] Stopped watching position');
    }
  }, [watchId]);

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  // Auto-watch if enabled
  useEffect(() => {
    if (options.autoWatch) {
      startWatching();
      return () => stopWatching();
    }
  }, [options.autoWatch, startWatching, stopWatching]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return { 
    location, 
    error, 
    loading,
    getLocation,
    startWatching,
    stopWatching,
    calculateDistance,
    isWatching: watchId !== null,
  };
};

export default useLocation;
