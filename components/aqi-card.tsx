"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CityAQI, getAQIColor, getAQIBgColor } from "@/lib/data";
import { MapPin, Droplets, Thermometer, Wind } from "lucide-react";

interface AQICardProps {
  city: CityAQI;
  index?: number;
}

export function AQICard({ city, index = 0 }: AQICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={cn(
        "relative overflow-hidden rounded-xl border p-5 backdrop-blur-sm transition-all hover:scale-[1.02]",
        getAQIBgColor(city.status)
      )}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">{city.city}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{city.country}</p>
          </div>
          <div className="text-right">
            <div className={cn("text-3xl font-bold", getAQIColor(city.status))}>
              {city.aqi}
            </div>
            <div className={cn("text-xs font-medium uppercase tracking-wider", getAQIColor(city.status))}>
              {city.status}
            </div>
          </div>
        </div>

        {/* Pollutant Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-background/30 rounded-lg p-2">
            <div className="text-xs text-muted-foreground mb-1">PM2.5</div>
            <div className="text-sm font-semibold text-foreground">{city.pm25} µg/m³</div>
          </div>
          <div className="bg-background/30 rounded-lg p-2">
            <div className="text-xs text-muted-foreground mb-1">PM10</div>
            <div className="text-sm font-semibold text-foreground">{city.pm10} µg/m³</div>
          </div>
        </div>

        {/* Environmental Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Thermometer className="h-3.5 w-3.5" />
            <span>{city.temperature}°C</span>
          </div>
          <div className="flex items-center gap-1">
            <Droplets className="h-3.5 w-3.5" />
            <span>{city.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="h-3.5 w-3.5" />
            <span>O₃: {city.o3}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function AQICardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 p-5 bg-card animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="h-5 w-24 bg-muted rounded mb-2" />
          <div className="h-4 w-16 bg-muted rounded" />
        </div>
        <div className="text-right">
          <div className="h-8 w-12 bg-muted rounded mb-1" />
          <div className="h-3 w-16 bg-muted rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="h-12 bg-muted rounded-lg" />
        <div className="h-12 bg-muted rounded-lg" />
      </div>
      <div className="flex gap-4">
        <div className="h-4 w-12 bg-muted rounded" />
        <div className="h-4 w-12 bg-muted rounded" />
        <div className="h-4 w-16 bg-muted rounded" />
      </div>
    </div>
  );
}
