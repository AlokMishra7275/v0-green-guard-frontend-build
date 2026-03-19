"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ForecastCard } from "@/components/forecast-card";
import { ForecastChart, ForecastChartSkeleton } from "@/components/forecast-chart";
import { ForecastData, mockCities, getAQIStatus } from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  Activity, 
  Calendar,
  Clock,
  Target,
  BarChart3
} from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ForecastPage() {
  const [selectedCity, setSelectedCity] = useState<string>("Tokyo");

  const { data: forecastData, isLoading } = useSWR<{
    success: boolean;
    city: string;
    data: ForecastData[];
  }>(`/api/forecast?city=${selectedCity}`, fetcher);

  const forecasts = forecastData?.data || [];

  // Get forecast insights
  const currentData = forecasts.find((f) => f.actual !== undefined && f.confidence === 100);
  const tomorrowData = forecasts.find((_, i) => i === forecasts.length - 12); // ~12 hours ahead
  const peakPrediction = forecasts.reduce(
    (max, f) => (f.predicted > (max?.predicted || 0) ? f : max),
    forecasts[0]
  );
  const avgConfidence = forecasts.length
    ? Math.round(
        forecasts.filter((f) => !f.actual).reduce((sum, f) => sum + f.confidence, 0) /
          forecasts.filter((f) => !f.actual).length
      )
    : 0;

  const currentAqi = currentData?.actual || 55;
  const tomorrowAqi = tomorrowData?.predicted || 60;
  const tomorrowStatus = getAQIStatus(tomorrowAqi);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                AQI Forecast & Predictions
              </h1>
              <p className="text-muted-foreground">
                AI-powered pollution trend predictions for the next 24 hours
              </p>
            </div>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[200px] bg-card/50">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                {mockCities.map((city) => (
                  <SelectItem key={city.id} value={city.city}>
                    {city.city}, {city.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Forecast Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <ForecastCard
              title="Current AQI"
              value={currentAqi}
              subtext={`Status: ${getAQIStatus(currentAqi)}`}
              status={getAQIStatus(currentAqi)}
              icon="activity"
              index={0}
            />
            <ForecastCard
              title="Tomorrow Pollution Risk"
              value={tomorrowAqi}
              subtext={`Expected ${tomorrowStatus} conditions`}
              status={tomorrowStatus}
              trend={tomorrowAqi > currentAqi ? "up" : "down"}
              icon="alert"
              index={1}
            />
            <ForecastCard
              title="Peak Predicted AQI"
              value={peakPrediction?.predicted || 0}
              subtext={`At ${peakPrediction ? new Date(peakPrediction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}`}
              status={getAQIStatus(peakPrediction?.predicted || 0)}
              icon="alert"
              index={2}
            />
            <ForecastCard
              title="Prediction Confidence"
              value={`${avgConfidence}%`}
              subtext="Average model confidence"
              icon="shield"
              index={3}
            />
          </div>

          {/* Main Forecast Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  Actual vs Predicted AQI
                </h2>
                <p className="text-sm text-muted-foreground">
                  Historical data and 24-hour forecast for {selectedCity}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-cyan-500" style={{ borderStyle: 'dashed', borderWidth: '2px', borderColor: 'hsl(180, 50%, 50%)' }} />
                  <span className="text-muted-foreground">Predicted</span>
                </div>
              </div>
            </div>

            {isLoading ? (
              <ForecastChartSkeleton height={350} />
            ) : (
              <ForecastChart data={forecasts} height={350} />
            )}
          </motion.div>

          {/* Additional Insights Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Hourly Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">24-Hour Forecast Breakdown</h3>
              </div>
              
              <div className="overflow-x-auto">
                <div className="flex gap-3 pb-2 min-w-max">
                  {forecasts
                    .filter((f) => !f.actual)
                    .slice(0, 12)
                    .map((forecast, index) => {
                      const time = new Date(forecast.timestamp);
                      const status = getAQIStatus(forecast.predicted);
                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center gap-2 min-w-[60px]"
                        >
                          <span className="text-xs text-muted-foreground">
                            {time.toLocaleTimeString([], { hour: '2-digit' })}
                          </span>
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold ${
                              status === 'good'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : status === 'moderate'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : status === 'unhealthy'
                                ? 'bg-orange-500/20 text-orange-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {forecast.predicted}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(forecast.confidence)}%
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </motion.div>

            {/* Health Alert Level */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Health Alert Level</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400">Good (0-50)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Air quality is satisfactory. Minimal health risk.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="text-sm font-medium text-yellow-400">Moderate (51-100)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Acceptable quality. Sensitive groups may experience minor effects.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    <span className="text-sm font-medium text-orange-400">Unhealthy (101-150)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    General public may experience health effects.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-sm font-medium text-red-400">Hazardous (151+)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Health warning. Everyone may experience serious effects.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
