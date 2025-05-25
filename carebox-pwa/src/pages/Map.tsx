import { useEffect, useRef, useState } from "react";
import "./Map.css";

declare global {
  interface Window {
    L: any;
  }
}

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const marker = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    const loadLeaflet = async () => {
      try {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        return new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.async = true;
          script.onload = () => {
            setLeafletLoaded(true);
            resolve();
          };
          script.onerror = () =>
            reject(new Error("Failed to load Leaflet library"));
          document.body.appendChild(script);
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load map library.");
        setLoading(false);
      }
    };

    loadLeaflet();
  }, []);

  useEffect(() => {
    if (leafletLoaded && mapRef.current) initMap();
  }, [leafletLoaded]);

  const initMap = () => {
    if (!mapRef.current || !window.L) {
      setError("Map library not available.");
      setLoading(false);
      return;
    }

    try {
      mapRef.current.innerHTML = "";
      const defaultLocation = [37.7749, -122.4194]; // Fallback

      leafletMap.current = window.L.map(mapRef.current).setView(
        defaultLocation,
        13
      );

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(leafletMap.current);

      getUserLocation();
    } catch (e) {
      console.error("Map init error:", e);
      setError("Map failed to initialize.");
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setUserLocation(coords);

        if (leafletMap.current) {
          leafletMap.current.setView(coords, 15);

          const customIcon = window.L.divIcon({
            className: "user-location-marker",
            html: `<div class="marker-inner"></div>`,
            iconSize: [20, 20],
          });

          if (marker.current) {
            marker.current.setLatLng(coords);
          } else {
            marker.current = window.L.marker(coords, {
              icon: customIcon,
            }).addTo(leafletMap.current);
          }
        }

        setLoading(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Unable to get your location.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const searchNearby = async () => {
    if (!leafletMap.current || !userLocation) {
      alert("Location not available. Try again.");
      return;
    }

    const [lat, lng] = userLocation;

    const query = `
      [out:json];
      (
        node["amenity"="clinic"](around:24000,${lat},${lng});
        way["amenity"="clinic"](around:24000,${lat},${lng});
        relation["amenity"="clinic"](around:24000,${lat},${lng});
      );
      out center;
    `;

    try {
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });

      const data = await res.json();
      if (!data.elements || data.elements.length === 0) {
        alert("No nearby clinics found.");
        return;
      }

      // Clear existing markers
      Object.values(leafletMap.current._layers).forEach((layer: any) => {
        if (layer._popup && layer !== marker.current) {
          leafletMap.current.removeLayer(layer);
        }
      });

      // Counter for successfully added markers
      let markersAdded = 0;

      // Process each element from the API response
      data.elements.forEach((el: any) => {
        let validCoords;

        // Handle different element types
        if (el.type === "node") {
          // Direct node coordinates
          validCoords = [el.lat, el.lon];
        } else if (el.center && el.center.lat && el.center.lon) {
          // For ways and relations with center property
          validCoords = [el.center.lat, el.center.lon];
        } else if (el.lat && el.lon) {
          // Fallback if lat/lon are directly on the element
          validCoords = [el.lat, el.lon];
        }

        // Only create marker if we have valid coordinates
        if (validCoords && validCoords[0] && validCoords[1]) {
          const name = el.tags?.name || "Clinic";
          const address = el.tags?.["addr:street"]
            ? `${el.tags["addr:housenumber"] || ""} ${
                el.tags["addr:street"]
              }, ${el.tags["addr:city"] || ""}`
            : "Address not available";

          // Create popup content with more info
          const popupContent = `
          <div class="clinic-popup">
            <strong>${name}</strong>
            <p>${address}</p>
            ${el.tags?.phone ? `<p>📞 ${el.tags.phone}</p>` : ""}
          </div>
        `;

          window.L.marker(validCoords)
            .addTo(leafletMap.current)
            .bindPopup(popupContent);

          markersAdded++;
        }
      });

      if (markersAdded === 0) {
        alert(
          "No clinic locations could be displayed. Try searching in a different area."
        );
        return;
      }

      // Adjust the map view to fit all markers
      leafletMap.current.setView([lat, lng], 12);
    } catch (err) {
      console.error("Overpass error:", err);
      alert("Search failed. Please try again later.");
    }
  };

  return (
    <div className="map-container">
      <h1>Map</h1>

      <div className="map-controls">
        <button onClick={searchNearby}>Show Nearby Clinics</button>
      </div>

      <div className="leaflet-map" ref={mapRef}></div>

      {loading && <div className="map-status">Loading map...</div>}
      {error && (
        <div className="map-status error">
          <p>{error}</p>
          <button onClick={initMap}>Retry</button>
        </div>
      )}
      {!loading && !error && (
        <button
          className="location-button"
          onClick={getUserLocation}
          aria-label="Recenter map"
        >
          📍
        </button>
      )}
    </div>
  );
}
