"use client";

import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CityAQI } from "@/lib/data";

interface PollutionAlertProps {
  cities: CityAQI[];
}

export function PollutionAlert({ cities }: PollutionAlertProps) {
  const [dismissed, setDismissed] = useState(false);

  // Find cities with unhealthy or hazardous AQI
  const hazardousCities = cities.filter(
    (city) => city.status === "unhealthy" || city.status === "hazardous"
  );

  if (hazardousCities.length === 0 || dismissed) {
    return null;
  }

  const mostSevere = hazardousCities.reduce((prev, current) =>
    current.aqi > prev.aqi ? current : prev
  );

  const statusColor =
    mostSevere.status === "hazardous"
      ? "from-red-500/20 to-red-500/5"
      : "from-orange-500/20 to-orange-500/5";

  const textColor =
    mostSevere.status === "hazardous" ? "text-red-400" : "text-orange-400";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`bg-gradient-to-r ${statusColor} border border-${mostSevere.status === "hazardous" ? "red" : "orange"}-500/30 rounded-lg p-4 flex items-start gap-4 relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 animate-pulse" />
        
        <div className="flex-shrink-0">
          <AlertTriangle className={`h-5 w-5 ${textColor}`} />
        </div>

        <div className="flex-1">
          <h3 className={`font-semibold ${textColor} mb-1`}>
            Pollution Alert
          </h3>
          <p className="text-sm text-foreground">
            <span className="font-medium">{mostSevere.city}</span> AQI has reached{" "}
            <span className="font-bold">{mostSevere.aqi}</span> (
            <span className="uppercase">{mostSevere.status}</span>).
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Outdoor activity not recommended. Use an air purifier and consider wearing an N95 mask.
          </p>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
