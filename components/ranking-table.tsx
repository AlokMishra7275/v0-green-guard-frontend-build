"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CityAQI, getAQIColor, getAQIBgColor } from "@/lib/data";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface RankingTableProps {
  cities: CityAQI[];
}

export function RankingTable({ cities }: RankingTableProps) {
  // Sort by AQI (highest first - most polluted)
  const sortedCities = [...cities].sort((a, b) => b.aqi - a.aqi);

  const getTrendIcon = (index: number) => {
    // Simulate trend based on position
    if (index % 3 === 0) return <TrendingUp className="h-4 w-4 text-red-400" />;
    if (index % 3 === 1) return <TrendingDown className="h-4 w-4 text-emerald-400" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-foreground">Pollution Risk Ranking</h3>
        <p className="text-sm text-muted-foreground">Cities ranked by current AQI levels</p>
      </div>
      
      <div className="divide-y divide-border/30">
        {sortedCities.map((city, index) => (
          <motion.div
            key={city.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold",
                index === 0 ? "bg-red-500/20 text-red-400" :
                index === 1 ? "bg-orange-500/20 text-orange-400" :
                index === 2 ? "bg-yellow-500/20 text-yellow-400" :
                "bg-muted text-muted-foreground"
              )}>
                {index + 1}
              </div>
              <div>
                <div className="font-medium text-foreground">{city.city}</div>
                <div className="text-xs text-muted-foreground">{city.country}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {getTrendIcon(index)}
              <div className={cn(
                "px-3 py-1 rounded-full text-sm font-semibold",
                getAQIBgColor(city.status),
                getAQIColor(city.status)
              )}>
                {city.aqi}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function RankingTableSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden animate-pulse">
      <div className="p-4 border-b border-border/50">
        <div className="h-5 w-40 bg-muted rounded mb-2" />
        <div className="h-4 w-56 bg-muted rounded" />
      </div>
      <div className="divide-y divide-border/30">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-muted rounded-lg" />
              <div>
                <div className="h-4 w-24 bg-muted rounded mb-1" />
                <div className="h-3 w-16 bg-muted rounded" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-muted rounded" />
              <div className="h-6 w-12 bg-muted rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
