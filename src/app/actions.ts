'use server';

import { weatherRecommendations, WeatherRecommendationsInput, WeatherRecommendationsOutput } from "@/ai/flows/weather-recommendations";
import { getWeatherData, Location, WeatherData } from "@/lib/weather";
import { z } from "zod";
import { getEarthquakeData, EarthquakeData } from "@/lib/earthquake";
import { earthquakeInfo, EarthquakeInfoInput, EarthquakeInfoOutput } from "@/ai/flows/earthquake-info";
import { getLandslideData, LandslideData } from "@/lib/landslide";
import { landslideInfo, LandslideInfoInput, LandslideInfoOutput } from "@/ai/flows/landslide-info";
import { getFireData, FireData } from "@/lib/fire";
import { fireInfo, FireInfoInput, FireInfoOutput } from "@/ai/flows/fire-info";
import { getWhirlwindData, WhirlwindData } from "@/lib/whirlwind";
import { whirlwindInfo, WhirlwindInfoInput, WhirlwindInfoOutput } from "@/ai/flows/whirlwind-info";
import { getVolcanoData, VolcanoData } from "@/lib/volcano";
import { volcanoInfo, VolcanoInfoInput, VolcanoInfoOutput } from "@/ai/flows/volcano-info";

type Language = 'en' | 'id';

export async function fetchWeatherData(location: Location, lang: Language): Promise<WeatherData> {
    return getWeatherData(location, lang);
}

const WeatherRecommendationsInputClientSchema = z.object({
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

export async function fetchAIRecommendations(input: z.infer<typeof WeatherRecommendationsInputClientSchema>, lang: Language): Promise<WeatherRecommendationsOutput | null> {
    try {
        const validatedInput = WeatherRecommendationsInputClientSchema.parse(input);
        const recommendations = await weatherRecommendations({ ...validatedInput, language: lang === 'en' ? 'English' : 'Indonesian' });
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

const EarthquakeInfoInputClientSchema = z.object({
    magnitude: z.number(),
    location: z.string(),
    depth: z.number(),
    time: z.string(),
});

export async function fetchEarthquakeInfo(input: z.infer<typeof EarthquakeInfoInputClientSchema>, lang: Language): Promise<EarthquakeInfoOutput | null> {
    try {
        const validatedInput = EarthquakeInfoInputClientSchema.parse(input);
        const info = await earthquakeInfo({ ...validatedInput, language: lang === 'en' ? 'English' : 'Indonesian' });
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

const LandslideInfoInputClientSchema = z.object({
    location: z.string(),
    riskLevel: z.string(),
    trigger: z.string(),
    time: z.string(),
    potentialImpact: z.string(),
});

export async function fetchLandslideInfo(input: z.infer<typeof LandslideInfoInputClientSchema>, lang: Language): Promise<LandslideInfoOutput | null> {
    try {
        const validatedInput = LandslideInfoInputClientSchema.parse(input);
        const info = await landslideInfo({ ...validatedInput, language: lang === 'en' ? 'English' : 'Indonesian' });
        return info;
    } catch (error) {
        console.error("Error fetching landslide info:", error);
        if (error instanceof z.ZodError) {
            console.error("Zod validation errors:", error.errors);
        }
        return null;
    }
}

export async function fetchFireData(): Promise<FireData> {
    return getFireData();
}

const FireInfoInputClientSchema = z.object({
    location: z.string(),
    status: z.string(),
    type: z.string(),
    time: z.string(),
    cause: z.string(),
});

export async function fetchFireInfo(input: z.infer<typeof FireInfoInputClientSchema>, lang: Language): Promise<FireInfoOutput | null> {
    try {
        const validatedInput = FireInfoInputClientSchema.parse(input);
        const info = await fireInfo({ ...validatedInput, language: lang === 'en' ? 'English' : 'Indonesian' });
        return info;
    } catch (error) {
        console.error("Error fetching fire info:", error);
        if (error instanceof z.ZodError) {
            console.error("Zod validation errors:", error.errors);
        }
        return null;
    }
}

export async function fetchWhirlwindData(): Promise<WhirlwindData> {
    return getWhirlwindData();
}

const WhirlwindInfoInputClientSchema = z.object({
    location: z.string(),
    category: z.string(),
    windSpeed: z.number(),
    time: z.string(),
    potentialThreat: z.string(),
});

export async function fetchWhirlwindInfo(input: z.infer<typeof WhirlwindInfoInputClientSchema>, lang: Language): Promise<WhirlwindInfoOutput | null> {
    try {
        const validatedInput = WhirlwindInfoInputClientSchema.parse(input);
        const info = await whirlwindInfo({ ...validatedInput, language: lang === 'en' ? 'English' : 'Indonesian' });
        return info;
    } catch (error) {
        console.error("Error fetching whirlwind info:", error);
        if (error instanceof z.ZodError) {
            console.error("Zod validation errors:", error.errors);
        }
        return null;
    }
}

export async function fetchVolcanoData(): Promise<VolcanoData> {
    return getVolcanoData();
}

const VolcanoInfoInputClientSchema = z.object({
    name: z.string(),
    status: z.string(),
    lastEruption: z.string(),
    recommendations: z.array(z.string()),
});

export async function fetchVolcanoInfo(input: z.infer<typeof VolcanoInfoInputClientSchema>, lang: Language): Promise<VolcanoInfoOutput | null> {
    try {
        const validatedInput = VolcanoInfoInputClientSchema.parse(input);
        const info = await volcanoInfo({ ...validatedInput, language: lang === 'en' ? 'English' : 'Indonesian' });
        return info;
    } catch (error) {
        console.error("Error fetching volcano info:", error);
        if (error instanceof z.ZodError) {
            console.error("Zod validation errors:", error.errors);
        }
        return null;
    }
}
