import React, { useEffect, useState } from 'react';
import useLocation from '../../hooks/useLocation';
import './LocationTracker.css';

/**
 * LocationTracker Component
 * Displays user's current location with map integration
 * Handles loading and error states
 * Usage: <LocationTracker autoWatch={true} onLocationChange={handleLocation} />
 */
const LocationTracker = ({ 
  autoWatch = false, 
  onLocationChange, 
  showMap = false,
  height = '400px' 
}) => {
  const { 
    location, 
    error, 
    loading, 
    getLocation, 
    startWatching, 
    stopWatching,
    calculateDistance,
    isWatching 
  } = useLocation({ autoWatch });

  const [address, setAddress] = useState('');
  const [distance, setDistance] = useState(null);

  // Call parent callback when location updates
  useEffect(() => {
    if (location) {
      onLocationChange?.(location);
      console.log('[LocationTracker] Location updated:', location);
    }
  }, [location, onLocationChange]);

  /**
   * Get address from coordinates using reverse geocoding
   */
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      setAddress(data.address?.city || data.address?.town || 'Unknown Location');
    } catch (err) {
      console.error('[LocationTracker] Geocoding error:', err);
      setAddress('Unable to get address');
    }
  };

  // Get address when location changes
  useEffect(() => {
    if (location) {
      getAddressFromCoordinates(location.latitude, location.longitude);
    }
  }, [location]);

  /**
   * Calculate distance to a destination
   */
  const calculateDistanceTo = (destLat, destLng) => {
    if (!location) {
      alert('Current location not available');
      return;
    }
    const dist = calculateDistance(
      location.latitude,
      location.longitude,
      destLat,
      destLng
    );
    setDistance(dist);
    console.log(`[LocationTracker] Distance: ${dist.toFixed(2)} km`);
  };

  if (loading && !location) {
    return (
      <div className="location-tracker">
        <div className="tracker-loading">
          <div className="spinner"></div>
          <p>Getting your location...</p>
        </div>
      </div>
    );
  }

  if (error && !location) {
    return (
      <div className="location-tracker">
        <div className="tracker-error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <p className="error-hint">Enable location in browser settings</p>
        </div>
      </div>
    );
  }

  if (!location) {
    return null;
  }

  return (
    <div className="location-tracker">
      <div className="tracker-header">
        <h3>Your Location</h3>
        <div className="location-status">
          {isWatching && <span className="watching-badge">Tracking</span>}
          <span className="status-check">✓</span>
        </div>
      </div>

      <div className="location-info">
        <div className="coordinate-block">
          <div className="coordinate">
            <label>Latitude</label>
            <span className="value">{location.latitude.toFixed(6)}</span>
          </div>
          <div className="coordinate">
            <label>Longitude</label>
            <span className="value">{location.longitude.toFixed(6)}</span>
          </div>
        </div>

        <div className="location-details">
          <div className="detail-item">
            <span className="label">Address:</span>
            <span className="value">{address}</span>
          </div>
          <div className="detail-item">
            <span className="label">Accuracy:</span>
            <span className="value">±{location.accuracy.toFixed(2)}m</span>
          </div>
          {location.altitude && (
            <div className="detail-item">
              <span className="label">Altitude:</span>
              <span className="value">{location.altitude.toFixed(2)}m</span>
            </div>
          )}
          <div className="detail-item">
            <span className="label">Updated:</span>
            <span className="value">
              {new Date(location.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {distance !== null && (
          <div className="distance-display">
            <p>Distance: <strong>{distance.toFixed(2)} km</strong></p>
          </div>
        )}
      </div>

      <div className="tracker-controls">
        <button 
          onClick={getLocation}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Getting...' : 'Get Location'}
        </button>

        <button 
          onClick={startWatching}
          className="btn btn-success"
          disabled={isWatching || loading}
        >
          {isWatching ? 'Tracking...' : 'Start Track'}
        </button>

        <button 
          onClick={stopWatching}
          className="btn btn-danger"
          disabled={!isWatching}
        >
          Stop
        </button>
      </div>

      {showMap && location && (
        <div className="map-container" style={{ height }}>
          <div className="map-placeholder">
            <p>Map: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
            <a 
              href={`https://maps.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}&zoom=15`}
              target="_blank"
              rel="noopener noreferrer"
              className="map-link"
            >
              View on Map
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationTracker;
