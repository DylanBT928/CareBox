import { useEffect, useRef, useState } from "react";
import "./Map.css";

// Add TypeScript interface for window.L
declare global {
  interface Window {
    L: any;
  }
}

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const leafletMap = useRef<any>(null);
  const marker = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    // Check if Leaflet is already loaded
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    const loadLeaflet = async () => {
      try {
        // Load Leaflet CSS
        const linkElement = document.createElement("link");
        linkElement.rel = "stylesheet";
        linkElement.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(linkElement);

        // Load Leaflet JS - using a Promise to ensure it's loaded
        return new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.async = true;

          script.onload = () => {
            setLeafletLoaded(true);
            resolve();
          };

          script.onerror = () => {
            reject(new Error("Failed to load Leaflet library"));
          };

          document.body.appendChild(script);
        });
      } catch (error) {
        console.error("Error loading Leaflet:", error);
        setError("Failed to load map library. Please try again later.");
        setLoading(false);
      }
    };

    loadLeaflet();
  }, []);

  // Initialize map after Leaflet is loaded
  useEffect(() => {
    if (leafletLoaded && mapRef.current) {
      initMap();
    }
  }, [leafletLoaded]);

  const initMap = () => {
    if (!mapRef.current || !window.L) {
      setError("Map library not available. Please refresh and try again.");
      setLoading(false);
      return;
    }

    try {
      // Clear the map div in case of re-initialization
      mapRef.current.innerHTML = "";

      const defaultLocation = [37.7749, -122.4194]; // San Francisco

      // Create the map
      leafletMap.current = window.L.map(mapRef.current).setView(
        defaultLocation,
        13
      );

      // Add the OpenStreetMap tile layer
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(leafletMap.current);

      // Get user's current location
      getUserLocation();
    } catch (e) {
      console.error("Error initializing map:", e);
      setError(
        `Error initializing map: ${
          e instanceof Error ? e.message : "Unknown error"
        }`
      );
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        try {
          const userLocation = [
            position.coords.latitude,
            position.coords.longitude,
          ];

          if (leafletMap.current) {
            leafletMap.current.setView(userLocation, 15);

            // Handle the marker
            if (marker.current) {
              marker.current.setLatLng(userLocation);
            } else {
              // Create a custom marker icon
              const customIcon = window.L.divIcon({
                className: "user-location-marker",
                html: `<div class="marker-inner"></div>`,
                iconSize: [20, 20],
              });

              marker.current = window.L.marker(userLocation, {
                icon: customIcon,
              }).addTo(leafletMap.current);
            }
          }
        } catch (e) {
          console.error("Error setting user location:", e);
          setError("Error displaying your location. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        console.error("Geolocation error:", geoError);
        let errorMsg = "Unable to access your location.";

        switch (geoError.code) {
          case 1:
            errorMsg +=
              " Please enable location permissions in your browser settings.";
            break;
          case 2:
            errorMsg += " Position unavailable. Try again later.";
            break;
          case 3:
            errorMsg += " Request timed out.";
            break;
        }

        setError(errorMsg);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="map-container">
      <h1>Map</h1>

      <div className="leaflet-map" ref={mapRef}></div>

      {loading && <div className="map-status">Loading map...</div>}

      {error && (
        <div className="map-status error">
          <p>{error}</p>
          <button onClick={initMap} className="retry-button">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <button
          className="location-button"
          onClick={getUserLocation}
          aria-label="Center map on current location"
        >
          📍
        </button>
      )}
    </div>
  );
}
