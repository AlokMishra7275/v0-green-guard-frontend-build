"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CityAQI } from "@/lib/data";

interface PollutionMapProps {
  cities: CityAQI[];
}

// Component to fit bounds to all markers
function FitBounds({ cities }: { cities: CityAQI[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (cities.length > 0) {
      const bounds = cities.map(city => [city.lat, city.lng] as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [cities, map]);
  
  return null;
}

const getMarkerColor = (status: string): string => {
  switch (status) {
    case "good":
      return "#10b981"; // emerald-500
    case "moderate":
      return "#eab308"; // yellow-500
    case "unhealthy":
      return "#f97316"; // orange-500
    case "hazardous":
      return "#ef4444"; // red-500
    default:
      return "#6b7280"; // gray-500
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "good":
      return "Good";
    case "moderate":
      return "Moderate";
    case "unhealthy":
      return "Unhealthy";
    case "hazardous":
      return "Hazardous";
    default:
      return "Unknown";
  }
};

export function PollutionMap({ cities }: PollutionMapProps) {
  const center = useMemo(() => {
    if (cities.length === 0) return [20, 0] as [number, number];
    const avgLat = cities.reduce((sum, city) => sum + city.lat, 0) / cities.length;
    const avgLng = cities.reduce((sum, city) => sum + city.lng, 0) / cities.length;
    return [avgLat, avgLng] as [number, number];
  }, [cities]);

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Interactive Pollution Map</h3>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Good</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span className="text-muted-foreground">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-muted-foreground">Unhealthy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-muted-foreground">Hazardous</span>
          </div>
        </div>
      </div>
      <div className="h-[400px] relative">
        <MapContainer
          center={center}
          zoom={2}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
          style={{ background: "#0f1419" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <FitBounds cities={cities} />
          {cities.map((city) => (
            <CircleMarker
              key={city.id}
              center={[city.lat, city.lng]}
              radius={Math.max(8, Math.min(20, city.aqi / 10))}
              pathOptions={{
                color: getMarkerColor(city.status),
                fillColor: getMarkerColor(city.status),
                fillOpacity: 0.7,
                weight: 2,
              }}
            >
              <Popup className="pollution-popup">
                <div className="p-1">
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    {city.city}, {city.country}
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">AQI</span>
                      <span 
                        className="font-bold"
                        style={{ color: getMarkerColor(city.status) }}
                      >
                        {city.aqi}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Status</span>
                      <span 
                        className="font-medium"
                        style={{ color: getMarkerColor(city.status) }}
                      >
                        {getStatusLabel(city.status)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">PM2.5</span>
                      <span className="font-medium text-foreground">{city.pm25} µg/m³</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Temp</span>
                      <span className="font-medium text-foreground">{city.temperature}°C</span>
                    </div>
                    <div className="pt-1 border-t border-border/50 mt-1">
                      <span className="text-muted-foreground text-[10px]">
                        Updated: {new Date(city.lastUpdated).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export function PollutionMapSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="h-5 w-48 bg-muted rounded animate-pulse" />
        <div className="flex items-center gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-16 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
      <div className="h-[400px] bg-muted/20 animate-pulse flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading map...</div>
      </div>
    </div>
  );
}
