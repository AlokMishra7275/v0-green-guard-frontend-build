import { mockCities } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return NextResponse.json({
    success: true,
    data: mockCities,
    timestamp: new Date().toISOString(),
  });
}
