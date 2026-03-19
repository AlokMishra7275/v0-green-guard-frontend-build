import { generateTrendData } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hours = parseInt(searchParams.get("hours") || "24");
  
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return NextResponse.json({
    success: true,
    data: generateTrendData(hours),
    timestamp: new Date().toISOString(),
  });
}
