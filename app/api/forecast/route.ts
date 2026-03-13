import { generateForecastData } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "Tokyo";
  
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  return NextResponse.json({
    success: true,
    city,
    data: generateForecastData(city),
    timestamp: new Date().toISOString(),
  });
}
