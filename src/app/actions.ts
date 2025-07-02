'use server';

import { weatherRecommendations, WeatherRecommendationsInput, WeatherRecommendationsOutput } from "@/ai/flows/weather-recommendations";
import { getWeatherData, Location, WeatherData } from "@/lib/weather";
import { z } from "zod";
import { getEarthquakeData, EarthquakeData } from "@/lib/earthquake";
import { earthquakeInfo, EarthquakeInfoInput, EarthquakeInfoOutput } from "@/ai/flows/earthquake-info";
import { getLandslideData, LandslideData } from "@/lib/landslide";
import { landslideInfo, LandslideInfoInput, LandslideInfoOutput } from "@/ai/flows/landslide-info";

export async function fetchWeatherData(location: Location): Promise<WeatherData> {
    return getWeatherData(location);
}

const WeatherRecommendationsInputSchema = z.object({
  location: z.enum(['city', 'regency']),
  forecast: z.array(
    z.object({
      date: z.string(),
      high: z.number(),
      low: z.number(),
      condition: z.string(),
    })
  ).length(3),
});

export async function fetchAIRecommendations(input: WeatherRecommendationsInput): Promise<WeatherRecommendationsOutput | null> {
    try {
        const validatedInput = WeatherRecommendationsInputSchema.parse(input);
        const recommendations = await weatherRecommendations(validatedInput);
        return recommendations;
    } catch (error) {
        console.error("Error fetching AI recommendations:", error);
        if (error instanceof z.ZodError) {
            console.error("Zod validation errors:", error.errors);
        }
        return null;
    }
}

export async function fetchEarthquakeData(): Promise<EarthquakeData> {
    return getEarthquakeData();
}

const EarthquakeInfoInputSchema = z.object({
    magnitude: z.number(),
    location: z.string(),
    depth: z.number(),
    time: z.string(),
});

export async function fetchEarthquakeInfo(input: EarthquakeInfoInput): Promise<EarthquakeInfoOutput | null> {
    try {
        const validatedInput = EarthquakeInfoInputSchema.parse(input);
        const info = await earthquakeInfo(validatedInput);
        return info;
    } catch (error) {
        console.error("Error fetching earthquake info:", error);
        if (error instanceof z.ZodError) {
            console.error("Zod validation errors:", error.errors);
        }
        return null;
    }
}

export async function fetchLandslideData(): Promise<LandslideData> {
    return getLandslideData();
}

const LandslideInfoInputSchema = z.object({
    location: z.string(),
    riskLevel: z.string(),
    trigger: z.string(),
    time: z.string(),
    potentialImpact: z.string(),
});

export async function fetchLandslideInfo(input: LandslideInfoInput): Promise<LandslideInfoOutput | null> {
    try {
        const validatedInput = LandslideInfoInputSchema.parse(input);
        const info = await landslideInfo(validatedInput);
        return info;
    } catch (error) {
        console.error("Error fetching landslide info:", error);
        if (error instanceof z.ZodError) {
            console.error("Zod validation errors:", error.errors);
        }
        return null;
    }
}
