"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AQICard, AQICardSkeleton } from "@/components/aqi-card";
import { RankingTable, RankingTableSkeleton } from "@/components/ranking-table";
import { TrendChart, TrendChartSkeleton } from "@/components/trend-chart";
import { AnimatedCounter } from "@/components/animated-counter";
import { CityAQI, TrendData } from "@/lib/data";
import { Activity, Wind, Droplets, ThermometerSun, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const { data: aqiData, isLoading: aqiLoading, mutate: mutateAqi } = useSWR<{
    success: boolean;
    data: CityAQI[];
    timestamp: string;
  }>("/api/aqi", fetcher, { refreshInterval: 60000 });

  const { data: trendData, isLoading: trendLoading } = useSWR<{
    success: boolean;
    data: TrendData[];
  }>("/api/trends?hours=24", fetcher, { refreshInterval: 60000 });

  const cities = aqiData?.data || [];
  const trends = trendData?.data || [];

  // Calculate aggregate stats
  const avgAqi = cities.length
    ? Math.round(cities.reduce((sum, city) => sum + city.aqi, 0) / cities.length)
    : 0;
  const avgPm25 = cities.length
    ? Math.round(cities.reduce((sum, city) => sum + city.pm25, 0) / cities.length)
    : 0;
  const avgTemp = cities.length
    ? Math.round(cities.reduce((sum, city) => sum + city.temperature, 0) / cities.length)
    : 0;
  const avgHumidity = cities.length
    ? Math.round(cities.reduce((sum, city) => sum + city.humidity, 0) / cities.length)
    : 0;

  const stats = [
    { icon: Activity, label: "Average AQI", value: avgAqi, suffix: "" },
    { icon: Wind, label: "Avg PM2.5", value: avgPm25, suffix: " µg/m³" },
    { icon: ThermometerSun, label: "Avg Temperature", value: avgTemp, suffix: "°C" },
    { icon: Droplets, label: "Avg Humidity", value: avgHumidity, suffix: "%" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Environmental Dashboard
              </h1>
              <p className="text-muted-foreground">
                Real-time air quality monitoring across global cities
              </p>
            </div>
            <Button
              variant="outline"
              className="w-fit"
              onClick={() => mutateAqi()}
              disabled={aqiLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${aqiLoading ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
          </div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {aqiLoading ? (
                      <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                    ) : (
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* AQI Cards - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  City Air Quality Index
                </h2>
                <span className="text-sm text-muted-foreground">
                  Last updated: {aqiData?.timestamp ? new Date(aqiData.timestamp).toLocaleTimeString() : "--"}
                </span>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {aqiLoading
                  ? Array.from({ length: 6 }).map((_, i) => <AQICardSkeleton key={i} />)
                  : cities.slice(0, 6).map((city, index) => (
                      <AQICard key={city.id} city={city} index={index} />
                    ))}
              </div>

              {/* Trend Chart */}
              <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">AQI Trend (24h)</h3>
                  <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-primary/10 text-primary">
                    Live
                  </span>
                </div>
                {trendLoading ? (
                  <TrendChartSkeleton height={200} />
                ) : (
                  <TrendChart data={trends} height={200} />
                )}
              </div>
            </div>

            {/* Ranking Sidebar */}
            <div className="space-y-6">
              {aqiLoading ? (
                <RankingTableSkeleton />
              ) : (
                <RankingTable cities={cities} />
              )}

              {/* Latest Data Table */}
              <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="p-4 border-b border-border/50">
                  <h3 className="font-semibold text-foreground">Latest Readings</h3>
                </div>
                <div className="divide-y divide-border/30">
                  {aqiLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="px-4 py-3 flex justify-between animate-pulse">
                          <div className="h-4 w-20 bg-muted rounded" />
                          <div className="h-4 w-16 bg-muted rounded" />
                        </div>
                      ))
                    : cities.slice(0, 4).map((city) => (
                        <div key={city.id} className="px-4 py-3 flex justify-between text-sm">
                          <span className="text-muted-foreground">{city.city}</span>
                          <span className="font-medium text-foreground">
                            NO₂: {city.no2} | SO₂: {city.so2} | CO: {city.co}
                          </span>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
