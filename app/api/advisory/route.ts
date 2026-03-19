import { NextResponse } from "next/server";

const generateAdvisory = () => {
  return {
    publicHealth: {
      title: "Public Health Advisory",
      severity: "moderate",
      content: "Current air quality levels suggest sensitive groups including children, elderly, and those with respiratory conditions should limit prolonged outdoor exposure. Indoor air purification is recommended in affected areas.",
      recommendations: [
        "Limit outdoor exercise during peak pollution hours (10 AM - 4 PM)",
        "Use N95 masks when outdoors in high-AQI zones",
        "Keep windows closed during high pollution periods",
        "Monitor symptoms and seek medical attention if respiratory issues worsen"
      ]
    },
    outdoorActivity: {
      title: "Outdoor Activity Guidance",
      severity: "low",
      content: "Morning hours (6-9 AM) typically show lower pollution levels. Consider scheduling outdoor activities during this window for optimal air quality exposure.",
      recommendations: [
        "Plan outdoor exercise for early morning or late evening",
        "Check real-time AQI before outdoor activities",
        "Avoid areas near heavy traffic or industrial zones",
        "Consider indoor alternatives when AQI exceeds 100"
      ]
    },
    pollutionAlert: {
      title: "Pollution Alerts",
      severity: "high",
      content: "Elevated PM2.5 and PM10 levels detected in industrial districts. Residents within 5km radius of major industrial zones advised to take precautionary measures.",
      recommendations: [
        "Keep windows and doors closed",
        "Run air purifiers with HEPA filters",
        "Reduce outdoor travel if possible",
        "Report unusual industrial emissions to local authorities"
      ]
    },
    childrenElderly: {
      title: "Vulnerable Groups Advisory",
      severity: "moderate",
      content: "Special precautions recommended for schools and elderly care facilities in areas with AQI above 100. Indoor activities should be prioritized.",
      recommendations: [
        "Schools should move outdoor activities indoors",
        "Elderly care facilities should enhance ventilation systems",
        "Parents should monitor children for respiratory symptoms",
        "Consider rescheduling outdoor events and field trips"
      ]
    },
    governmentAction: {
      title: "Government Action Recommendations",
      severity: "moderate",
      content: "Based on current pollution trends, policy interventions may be required to manage air quality effectively.",
      recommendations: [
        "Implement temporary traffic restrictions in high-density zones",
        "Increase industrial emission monitoring frequency",
        "Consider emergency response protocols for AQI above 200",
        "Enhance public awareness campaigns on air quality"
      ]
    },
    generatedAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // Valid for 6 hours
  };
};

export async function GET() {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  return NextResponse.json({
    success: true,
    advisory: generateAdvisory(),
    timestamp: new Date().toISOString(),
  });
}

export async function POST() {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  return NextResponse.json({
    success: true,
    advisory: generateAdvisory(),
    timestamp: new Date().toISOString(),
  });
}
