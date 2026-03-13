"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendData } from "@/lib/data";

interface TrendChartProps {
  data: TrendData[];
  height?: number;
}

export function TrendChart({ data, height = 200 }: TrendChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(155, 60%, 50%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(155, 60%, 50%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 25%)" vertical={false} />
        <XAxis 
          dataKey="time" 
          stroke="hsl(240, 10%, 45%)" 
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="hsl(240, 10%, 45%)" 
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(240, 10%, 15%)",
            border: "1px solid hsl(240, 10%, 25%)",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
          labelStyle={{ color: "hsl(240, 10%, 70%)" }}
          itemStyle={{ color: "hsl(155, 60%, 50%)" }}
        />
        <Area
          type="monotone"
          dataKey="aqi"
          stroke="hsl(155, 60%, 50%)"
          strokeWidth={2}
          fill="url(#aqiGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TrendChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div className="animate-pulse" style={{ height }}>
      <div className="h-full w-full bg-muted/30 rounded-lg flex items-end justify-around p-4 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bg-muted/50 rounded-t"
            style={{
              width: '6%',
              height: `${30 + Math.random() * 50}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
