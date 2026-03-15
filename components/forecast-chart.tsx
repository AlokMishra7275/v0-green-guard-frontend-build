"use client";

import { Area, AreaChart, CartesianGrid, Line, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { ForecastData } from "@/lib/data";

interface ForecastChartProps {
  data: ForecastData[];
  height?: number;
}

export function ForecastChart({ data, height = 300 }: ForecastChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    index,
  }));

  // Find the current time index (where actual data ends)
  const currentIndex = chartData.findIndex(item => item.actual !== undefined && 
    chartData[chartData.indexOf(item) + 1]?.actual === undefined);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(155, 60%, 50%)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="hsl(155, 60%, 50%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(180, 50%, 50%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(180, 50%, 50%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 25%)" vertical={false} />
        <XAxis 
          dataKey="time" 
          stroke="hsl(240, 10%, 45%)" 
          fontSize={10}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis 
          stroke="hsl(240, 10%, 45%)" 
          fontSize={11}
          tickLine={false}
          axisLine={false}
          domain={[0, 'auto']}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(240, 10%, 15%)",
            border: "1px solid hsl(240, 10%, 25%)",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
          labelStyle={{ color: "hsl(240, 10%, 70%)" }}
          formatter={(value: number, name: string) => {
            const label = name === "actual" ? "Actual AQI" : "Predicted AQI";
            return [value.toFixed(0), label];
          }}
        />
        {currentIndex > 0 && (
          <ReferenceLine 
            x={chartData[currentIndex]?.time} 
            stroke="hsl(240, 10%, 50%)" 
            strokeDasharray="5 5"
            label={{ 
              value: "Now", 
              position: "top", 
              fill: "hsl(240, 10%, 60%)",
              fontSize: 11
            }}
          />
        )}
        <Area
          type="monotone"
          dataKey="actual"
          stroke="hsl(155, 60%, 50%)"
          strokeWidth={2}
          fill="url(#actualGradient)"
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="predicted"
          stroke="hsl(180, 50%, 50%)"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function ForecastChartSkeleton({ height = 300 }: { height?: number }) {
  // Predefined heights based on sine wave to avoid hydration mismatch
  const barHeights = [
    32, 38, 42, 45, 46, 44, 40, 35, 32, 35, 40, 45,
    50, 52, 50, 45, 40, 35, 32, 35, 40, 45, 48, 45
  ];

  return (
    <div className="animate-pulse" style={{ height }}>
      <div className="h-full w-full bg-muted/30 rounded-lg flex items-end justify-around p-4 gap-1">
        {barHeights.map((barHeight, i) => (
          <div
            key={i}
            className="bg-muted/50 rounded-t"
            style={{
              width: '3%',
              height: `${barHeight}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
