// Mock data for GreenGuard environmental monitoring platform

export interface CityAQI {
  id: string;
  city: string;
  country: string;
  aqi: number;
  status: 'good' | 'moderate' | 'unhealthy' | 'hazardous';
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  lastUpdated: string;
  lat: number;
  lng: number;
}

export interface TrendData {
  timestamp: string;
  aqi: number;
  pm25: number;
  pm10: number;
}

export interface ForecastData {
  timestamp: string;
  actual?: number;
  predicted: number;
  confidence: number;
}

export const getAQIStatus = (aqi: number): 'good' | 'moderate' | 'unhealthy' | 'hazardous' => {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy';
  return 'hazardous';
};

export const getAQIColor = (status: string): string => {
  switch (status) {
    case 'good': return 'text-emerald-400';
    case 'moderate': return 'text-yellow-400';
    case 'unhealthy': return 'text-orange-400';
    case 'hazardous': return 'text-red-400';
    default: return 'text-muted-foreground';
  }
};

export const getAQIBgColor = (status: string): string => {
  switch (status) {
    case 'good': return 'bg-emerald-500/20 border-emerald-500/30';
    case 'moderate': return 'bg-yellow-500/20 border-yellow-500/30';
    case 'unhealthy': return 'bg-orange-500/20 border-orange-500/30';
    case 'hazardous': return 'bg-red-500/20 border-red-500/30';
    default: return 'bg-muted';
  }
};

export const mockCities: CityAQI[] = [
  {
    id: '1',
    city: 'Tokyo',
    country: 'Japan',
    aqi: 42,
    status: 'good',
    pm25: 12,
    pm10: 28,
    o3: 35,
    no2: 22,
    so2: 5,
    co: 0.4,
    temperature: 18,
    humidity: 65,
    windSpeed: 8.2,
    lastUpdated: new Date().toISOString(),
    lat: 35.6762,
    lng: 139.6503,
  },
  {
    id: '2',
    city: 'New Delhi',
    country: 'India',
    aqi: 185,
    status: 'unhealthy',
    pm25: 95,
    pm10: 142,
    o3: 45,
    no2: 68,
    so2: 28,
    co: 1.8,
    temperature: 32,
    humidity: 45,
    windSpeed: 12.5,
    lastUpdated: new Date().toISOString(),
    lat: 28.6139,
    lng: 77.2090,
  },
  {
    id: '3',
    city: 'London',
    country: 'UK',
    aqi: 58,
    status: 'moderate',
    pm25: 18,
    pm10: 35,
    o3: 42,
    no2: 35,
    so2: 8,
    co: 0.5,
    temperature: 12,
    humidity: 78,
    windSpeed: 15.3,
    lastUpdated: new Date().toISOString(),
    lat: 51.5074,
    lng: -0.1278,
  },
  {
    id: '4',
    city: 'Beijing',
    country: 'China',
    aqi: 162,
    status: 'unhealthy',
    pm25: 78,
    pm10: 115,
    o3: 52,
    no2: 58,
    so2: 22,
    co: 1.5,
    temperature: 22,
    humidity: 55,
    windSpeed: 6.8,
    lastUpdated: new Date().toISOString(),
    lat: 39.9042,
    lng: 116.4074,
  },
  {
    id: '5',
    city: 'Sydney',
    country: 'Australia',
    aqi: 28,
    status: 'good',
    pm25: 8,
    pm10: 18,
    o3: 28,
    no2: 15,
    so2: 3,
    co: 0.2,
    temperature: 24,
    humidity: 62,
    windSpeed: 11.4,
    lastUpdated: new Date().toISOString(),
    lat: -33.8688,
    lng: 151.2093,
  },
  {
    id: '6',
    city: 'Los Angeles',
    country: 'USA',
    aqi: 78,
    status: 'moderate',
    pm25: 25,
    pm10: 42,
    o3: 55,
    no2: 42,
    so2: 12,
    co: 0.8,
    temperature: 26,
    humidity: 48,
    windSpeed: 9.6,
    lastUpdated: new Date().toISOString(),
    lat: 34.0522,
    lng: -118.2437,
  },
  {
    id: '7',
    city: 'Mumbai',
    country: 'India',
    aqi: 210,
    status: 'hazardous',
    pm25: 125,
    pm10: 168,
    o3: 58,
    no2: 72,
    so2: 32,
    co: 2.2,
    temperature: 34,
    humidity: 72,
    windSpeed: 10.2,
    lastUpdated: new Date().toISOString(),
    lat: 19.0760,
    lng: 72.8777,
  },
  {
    id: '8',
    city: 'Paris',
    country: 'France',
    aqi: 45,
    status: 'good',
    pm25: 14,
    pm10: 28,
    o3: 38,
    no2: 28,
    so2: 6,
    co: 0.4,
    temperature: 15,
    humidity: 68,
    windSpeed: 7.9,
    lastUpdated: new Date().toISOString(),
    lat: 48.8566,
    lng: 2.3522,
  },
];

export const generateTrendData = (hours: number = 24): TrendData[] => {
  const data: TrendData[] = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const baseAqi = 50 + Math.sin(i / 4) * 30;
    data.push({
      timestamp: timestamp.toISOString(),
      aqi: Math.round(baseAqi + Math.random() * 20),
      pm25: Math.round(15 + Math.random() * 25),
      pm10: Math.round(25 + Math.random() * 35),
    });
  }
  
  return data;
};

export const generateForecastData = (city: string): ForecastData[] => {
  const data: ForecastData[] = [];
  const now = new Date();
  
  // Historical data (past 12 hours)
  for (let i = 12; i >= 1; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const baseAqi = 55 + Math.sin(i / 3) * 25;
    const actual = Math.round(baseAqi + Math.random() * 15);
    data.push({
      timestamp: timestamp.toISOString(),
      actual,
      predicted: actual + Math.round((Math.random() - 0.5) * 10),
      confidence: 95 - Math.random() * 5,
    });
  }
  
  // Current hour
  const currentAqi = Math.round(60 + Math.random() * 20);
  data.push({
    timestamp: now.toISOString(),
    actual: currentAqi,
    predicted: currentAqi,
    confidence: 100,
  });
  
  // Forecast data (next 24 hours)
  for (let i = 1; i <= 24; i++) {
    const timestamp = new Date(now.getTime() + i * 60 * 60 * 1000);
    const baseAqi = currentAqi + Math.sin(i / 4) * 20;
    data.push({
      timestamp: timestamp.toISOString(),
      predicted: Math.round(baseAqi + Math.random() * 15),
      confidence: Math.max(70, 95 - i * 1.5 + Math.random() * 5),
    });
  }
  
  return data;
};

export const advisoryPrompts = {
  publicHealth: "Based on current AQI levels, sensitive groups including children, elderly, and those with respiratory conditions should limit outdoor exposure.",
  outdoorActivity: "Morning hours (6-9 AM) typically show lower pollution levels. Consider scheduling outdoor activities during this window.",
  pollutionAlert: "Industrial areas showing elevated PM2.5 levels. Residents within 5km radius advised to keep windows closed.",
  childrenElderly: "Schools in affected areas should consider indoor activities. Elderly care facilities advised to enhance air filtration.",
  governmentAction: "Recommend temporary traffic restrictions in high-density zones. Industrial emission monitoring should be intensified.",
};
