"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getAQIColor, getAQIBgColor, getAQIStatus } from "@/lib/data";
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Activity } from "lucide-react";

interface ForecastCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: "up" | "down" | "stable";
  status?: "good" | "moderate" | "unhealthy" | "hazardous";
  icon?: "alert" | "shield" | "activity";
  index?: number;
}

export function ForecastCard({
  title,
  value,
  subtext,
  trend,
  status,
  icon,
  index = 0,
}: ForecastCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "alert":
        return <AlertTriangle className="h-5 w-5" />;
      case "shield":
        return <Shield className="h-5 w-5" />;
      case "activity":
        return <Activity className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-red-400" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-emerald-400" />;
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={cn(
        "relative overflow-hidden rounded-xl border p-5 backdrop-blur-sm",
        status ? getAQIBgColor(status) : "bg-card border-border/50"
      )}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">{title}</span>
          {icon && (
            <div className={cn("p-2 rounded-lg bg-background/30", status && getAQIColor(status))}>
              {getIcon()}
            </div>
          )}
        </div>
        
        <div className="flex items-end gap-2">
          <span className={cn(
            "text-2xl font-bold",
            status ? getAQIColor(status) : "text-foreground"
          )}>
            {value}
          </span>
          {getTrendIcon()}
        </div>
        
        {subtext && (
          <p className="mt-2 text-sm text-muted-foreground">{subtext}</p>
        )}
      </div>
    </motion.div>
  );
}

export function ForecastCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 p-5 bg-card animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-8 w-8 bg-muted rounded-lg" />
      </div>
      <div className="h-8 w-16 bg-muted rounded mb-2" />
      <div className="h-4 w-32 bg-muted rounded" />
    </div>
  );
}
