"use client";

import { Leaf, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

const tips = [
  "Use public transport today to reduce emissions and improve air quality.",
  "Plant trees and support reforestation projects in your community.",
  "Switch to renewable energy sources like solar panels for your home.",
  "Reduce meat consumption and choose sustainable food options.",
  "Use eco-friendly products and avoid single-use plastics.",
  "Walk or bike for short trips instead of driving.",
  "Support local environmental organizations and initiatives.",
  "Reduce energy consumption by turning off lights when not in use.",
  "Use water-efficient fixtures to conserve this precious resource.",
  "Dispose of electronic waste properly at recycling centers.",
];

export function SustainabilityTips() {
  const tip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm p-4"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-2 rounded-lg bg-primary/20">
          <Leaf className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            <h4 className="font-semibold text-foreground text-sm">
              Daily Green Tip
            </h4>
          </div>
          <p className="text-sm text-muted-foreground">
            {tip}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
