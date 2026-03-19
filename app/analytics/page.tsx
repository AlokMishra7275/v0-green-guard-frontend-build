"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CityAQI, TrendData, mockCities } from "@/lib/data";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Line,
  LineChart,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart3, LineChartIcon, Filter } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const timeRanges = [
  { value: "24", label: "Last 24 Hours" },
  { value: "48", label: "Last 48 Hours" },
  { value: "72", label: "Last 72 Hours" },
];

export default function AnalyticsPage() {
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("24");
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const { data: trendData, isLoading } = useSWR<{
    success: boolean;
    data: TrendData[];
  }>(`/api/trends?hours=${timeRange}`, fetcher);

  const { data: aqiData } = useSWR<{
    success: boolean;
    data: CityAQI[];
    timestamp?: string;
    source?: string;
  }>("/api/aqi", fetcher, { refreshInterval: 15000 });

  const trends = trendData?.data || [];
  const cities = aqiData?.data?.length ? aqiData.data : mockCities;

  // Prepare chart data
  const chartData = trends.map((item) => ({
    ...item,
    time: new Date(item.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  // City comparison data
  const comparisonData = cities.map((city) => ({
    city: city.city,
    aqi: city.aqi,
    pm25: city.pm25,
    pm10: city.pm10,
  }));

  // Historical comparison (simulated)
  const historicalData = [
    { period: "Week 1", avgAqi: 52, pm25: 18, pm10: 32 },
    { period: "Week 2", avgAqi: 58, pm25: 22, pm10: 38 },
    { period: "Week 3", avgAqi: 45, pm25: 15, pm10: 28 },
    { period: "Week 4", avgAqi: 62, pm25: 25, pm10: 42 },
    { period: "This Week", avgAqi: 55, pm25: 20, pm10: 35 },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Environmental Analytics
              </h1>
              <p className="text-muted-foreground">
                Advanced visualization and analysis of air quality data
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Data source: {aqiData?.source || "mock"} | Last update: {aqiData?.timestamp ? new Date(aqiData.timestamp).toLocaleTimeString() : "--"}
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-[160px] bg-card/50">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[160px] bg-card/50">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  {timeRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex rounded-lg border border-border/50 overflow-hidden">
                <Button
                  variant={chartType === "line" ? "secondary" : "ghost"}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setChartType("line")}
                >
                  <LineChartIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={chartType === "bar" ? "secondary" : "ghost"}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setChartType("bar")}
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 mb-8"
          >
            <h2 className="text-lg font-semibold text-foreground mb-6">
              AQI Trend Analysis
            </h2>
            
            {isLoading ? (
              <div className="h-[350px] animate-pulse bg-muted/30 rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                {chartType === "line" ? (
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="aqiLine" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(155, 60%, 50%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(155, 60%, 50%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 25%)" />
                    <XAxis 
                      dataKey="time" 
                      stroke="hsl(240, 10%, 45%)" 
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="hsl(240, 10%, 45%)" 
                      fontSize={11}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(240, 10%, 15%)",
                        border: "1px solid hsl(240, 10%, 25%)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="aqi"
                      stroke="hsl(155, 60%, 50%)"
                      strokeWidth={2}
                      dot={false}
                      name="AQI"
                    />
                    <Line
                      type="monotone"
                      dataKey="pm25"
                      stroke="hsl(180, 50%, 50%)"
                      strokeWidth={2}
                      dot={false}
                      name="PM2.5"
                    />
                    <Line
                      type="monotone"
                      dataKey="pm10"
                      stroke="hsl(85, 50%, 55%)"
                      strokeWidth={2}
                      dot={false}
                      name="PM10"
                    />
                  </LineChart>
                ) : (
                  <BarChart data={chartData.filter((_, i) => i % 4 === 0)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 25%)" />
                    <XAxis 
                      dataKey="time" 
                      stroke="hsl(240, 10%, 45%)" 
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="hsl(240, 10%, 45%)" 
                      fontSize={11}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(240, 10%, 15%)",
                        border: "1px solid hsl(240, 10%, 25%)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="aqi" fill="hsl(155, 60%, 50%)" name="AQI" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pm25" fill="hsl(180, 50%, 50%)" name="PM2.5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Secondary Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* City Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-6">
                City Pollution Comparison
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData} layout="vertical" margin={{ left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 25%)" horizontal={false} />
                  <XAxis type="number" stroke="hsl(240, 10%, 45%)" fontSize={11} />
                  <YAxis 
                    type="category" 
                    dataKey="city" 
                    stroke="hsl(240, 10%, 45%)" 
                    fontSize={11}
                    width={55}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(240, 10%, 15%)",
                      border: "1px solid hsl(240, 10%, 25%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="aqi" fill="hsl(155, 60%, 50%)" name="AQI" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Historical Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Historical Weekly Comparison
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={historicalData}>
                  <defs>
                    <linearGradient id="histGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(155, 60%, 50%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(155, 60%, 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 25%)" />
                  <XAxis 
                    dataKey="period" 
                    stroke="hsl(240, 10%, 45%)" 
                    fontSize={11}
                  />
                  <YAxis 
                    stroke="hsl(240, 10%, 45%)" 
                    fontSize={11}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(240, 10%, 15%)",
                      border: "1px solid hsl(240, 10%, 25%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="avgAqi"
                    stroke="hsl(155, 60%, 50%)"
                    fill="url(#histGradient)"
                    name="Avg AQI"
                  />
                  <Area
                    type="monotone"
                    dataKey="pm25"
                    stroke="hsl(180, 50%, 50%)"
                    fill="hsl(180, 50%, 50%)"
                    fillOpacity={0.2}
                    name="PM2.5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
