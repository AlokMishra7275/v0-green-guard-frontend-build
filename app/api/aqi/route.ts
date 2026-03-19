import { mockCities } from "@/lib/data";
import { NextResponse } from "next/server";

type OAQMeasurement = {
  parameter: string;
  value: number;
};

type OAQResult = {
  city: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  measurements: OAQMeasurement[];
};

type CityAQI = {
  id: string;
  city: string;
  country: string;
  aqi: number;
  status: "good" | "moderate" | "unhealthy" | "hazardous";
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  lat: number;
  lng: number;
};

const normalizeAqi = (aqi: number): CityAQI["status"] => {
  if (aqi <= 50) return "good";
  if (aqi <= 100) return "moderate";
  if (aqi <= 150) return "unhealthy";
  return "hazardous";
};

const getMeasurement = (measurements: OAQMeasurement[], param: string): number => {
  const m = measurements.find((item) => item.parameter === param);
  return m?.value ?? 0;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const country = url.searchParams.get("country") || "IN";
  const limit = Number(url.searchParams.get("limit") || "40");

  const openAQUrl = `https://api.openaq.org/v2/latest?country=${country}&limit=${limit}`;

  try {
    const resp = await fetch(openAQUrl);
    if (!resp.ok) throw new Error("OpenAQ fetch failed");

    const json = await resp.json();
    const results: OAQResult[] = json.results || [];

    const data: CityAQI[] = results.map((item, idx) => {
      const pm25 = getMeasurement(item.measurements, "pm25");
      const pm10 = getMeasurement(item.measurements, "pm10");
      const no2 = getMeasurement(item.measurements, "no2");
      const o3 = getMeasurement(item.measurements, "o3");
      const so2 = getMeasurement(item.measurements, "so2");
      const co = getMeasurement(item.measurements, "co");

      const aqi = Math.round(pm25 * 1.5 + pm10 * 0.5);

      return {
        id: `${item.city}-${idx}`,
        city: item.city || "Unknown",
        country: item.country || country,
        aqi,
        status: normalizeAqi(aqi),
        pm25,
        pm10,
        o3,
        no2,
        so2,
        co,
        lat: item.coordinates?.latitude ?? 0,
        lng: item.coordinates?.longitude ?? 0,
      };
    });

    return NextResponse.json({
      success: true,
      data: data.length > 0 ? data : mockCities,
      timestamp: new Date().toISOString(),
      source: "openaq",
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      data: mockCities,
      timestamp: new Date().toISOString(),
      source: "fallback",
      error: (error as Error).message,
    });
  }
}

