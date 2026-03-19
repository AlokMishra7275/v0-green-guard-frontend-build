"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function LiveDataIndicator() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  const getTimeAgo = () => {
    if (!lastUpdated) return "Just now";
    
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
    
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-primary/20">
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-primary"
        />
        <div className="flex flex-col text-xs">
          <span className="font-medium text-foreground">Live Data</span>
          <span className="text-muted-foreground text-xs">Updated: {getTimeAgo()}</span>
        </div>
      </div>
    </div>
  );
}
