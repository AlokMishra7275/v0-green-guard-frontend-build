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
    city: 'Chennai',
    country: 'India',
    aqi: 52,
    status: 'moderate',
    pm25: 32,
    pm10: 48,
    o3: 45,
    no2: 30,
    so2: 9,
    co: 0.7,
    temperature: 29,
    humidity: 70,
    windSpeed: 9.6,
    lastUpdated: new Date().toISOString(),
    lat: 13.0827,
    lng: 80.2707,
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
    city: 'Kolkata',
    country: 'India',
    aqi: 120,
    status: 'unhealthy',
    pm25: 65,
    pm10: 88,
    o3: 59,
    no2: 55,
    so2: 17,
    co: 1.4,
    temperature: 30,
    humidity: 75,
    windSpeed: 8.7,
    lastUpdated: new Date().toISOString(),
    lat: 22.5726,
    lng: 88.3639,
  },
  {
    id: '4',
    city: 'Bengaluru',
    country: 'India',
    aqi: 90,
    status: 'moderate',
    pm25: 40,
    pm10: 68,
    o3: 70,
    no2: 42,
    so2: 10,
    co: 0.9,
    temperature: 27,
    humidity: 60,
    windSpeed: 10.1,
    lastUpdated: new Date().toISOString(),
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: '5',
    city: 'Hyderabad',
    country: 'India',
    aqi: 102,
    status: 'unhealthy',
    pm25: 58,
    pm10: 80,
    o3: 62,
    no2: 50,
    so2: 14,
    co: 1.2,
    temperature: 31,
    humidity: 65,
    windSpeed: 9.0,
    lastUpdated: new Date().toISOString(),
    lat: 17.3850,
    lng: 78.4867,
  },
  {
    id: '6',
    city: 'Ahmedabad',
    country: 'India',
    aqi: 170,
    status: 'unhealthy',
    pm25: 90,
    pm10: 130,
    o3: 55,
    no2: 67,
    so2: 20,
    co: 1.6,
    temperature: 34,
    humidity: 48,
    windSpeed: 11.5,
    lastUpdated: new Date().toISOString(),
    lat: 23.0225,
    lng: 72.5714,
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
    city: 'Pune',
    country: 'India',
    aqi: 88,
    status: 'moderate',
    pm25: 34,
    pm10: 60,
    o3: 46,
    no2: 38,
    so2: 10,
    co: 0.7,
    temperature: 29,
    humidity: 60,
    windSpeed: 9.2,
    lastUpdated: new Date().toISOString(),
    lat: 18.5204,
    lng: 73.8567,
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
