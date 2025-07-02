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
import { getFloodData, FloodData } from "@/lib/flood";
import { floodInfo, FloodInfoInput, FloodInfoOutput } from "@/ai/flows/flood-info";
import { categorizeReport, CategorizeReportInput, CategorizeReportOutput } from "@/ai/flows/categorize-report";
import type { UserReport } from "@/lib/reports";
import { nearbyAlert, NearbyAlertOutput } from "@/ai/flows/nearby-alert-flow";
import pool from "@/lib/db";


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

export async function fetchFloodData(): Promise<FloodData> {
    return getFloodData();
}

const FloodInfoInputClientSchema = z.object({
    location: z.string(),
    waterLevel: z.number(),
    status: z.string(),
    time: z.string(),
});

export async function fetchFloodInfo(input: z.infer<typeof FloodInfoInputClientSchema>, lang: Language): Promise<FloodInfoOutput | null> {
    try {
        const validatedInput = FloodInfoInputClientSchema.parse(input);
        const info = await floodInfo({ ...validatedInput, language: lang === 'en' ? 'English' : 'Indonesian' });
        return info;
    } catch (error) {
        console.error("Error fetching flood info:", error);
        if (error instanceof z.ZodError) {
            console.error("Zod validation errors:", error.errors);
        }
        return null;
    }
}

export async function fetchReports(): Promise<UserReport[]> {
    try {
        const result = await pool.query('SELECT id, photo_data_uri, description, location, category, summary, timestamp, "user", photo_hint FROM reports ORDER BY timestamp DESC');
        
        return result.rows.map(row => ({
            id: row.id.toString(),
            photoDataUri: row.photo_data_uri,
            description: row.description,
            location: row.location,
            category: row.category,
            summary: row.summary,
            timestamp: new Date(row.timestamp).toISOString(),
            user: row.user,
            photoHint: row.photo_hint,
        }));
    } catch (error) {
        console.error('Database Error: Failed to fetch reports.', error);
        return [];
    }
}

const SubmitReportInputClientSchema = z.object({
    photoDataUri: z.string(),
    description: z.string().min(10, "Description must be at least 10 characters long."),
    location: z.object({
        latitude: z.number(),
        longitude: z.number(),
    }),
});

export async function submitReport(input: z.infer<typeof SubmitReportInputClientSchema>, lang: Language): Promise<UserReport | { error: string }> {
    try {
        const validatedInput = SubmitReportInputClientSchema.parse(input);
        
        const aiResult = await categorizeReport({
            ...validatedInput,
            language: lang === 'en' ? 'English' : 'Indonesian',
        });

        if (!aiResult) {
            throw new Error("AI analysis failed.");
        }

        const reportToInsert = {
            photoDataUri: validatedInput.photoDataUri,
            description: validatedInput.description,
            location: validatedInput.location,
            category: aiResult.category,
            summary: aiResult.summary,
            photoHint: aiResult.photoHint,
            user: lang === 'en' ? 'Anonymous Citizen' : 'Warga Anonim',
        };
        
        const result = await pool.query(
            `INSERT INTO reports(photo_data_uri, description, location, category, summary, photo_hint, "user", timestamp) 
            VALUES($1, $2, $3, $4, $5, $6, $7, NOW()) 
            RETURNING id, timestamp`,
            [
                reportToInsert.photoDataUri,
                reportToInsert.description,
                JSON.stringify(reportToInsert.location),
                reportToInsert.category,
                reportToInsert.summary,
                reportToInsert.photoHint,
                reportToInsert.user,
            ]
        );

        const newReport: UserReport = {
            id: result.rows[0].id.toString(),
            ...validatedInput,
            category: aiResult.category,
            summary: aiResult.summary,
            photoHint: aiResult.photoHint,
            timestamp: new Date(result.rows[0].timestamp).toISOString(),
            user: reportToInsert.user,
        };

        return newReport;

    } catch (error) {
        console.error("Error submitting report:", error);
        if (error instanceof z.ZodError) {
            console.error("Zod validation errors:", error.errors);
            return { error: "Invalid input." };
        }
        return { error: "Failed to submit report." };
    }
}

const NearbyAlertInputClientSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
});

export async function fetchNearbyAlert(input: z.infer<typeof NearbyAlertInputClientSchema>, lang: Language): Promise<NearbyAlertOutput | null> {
    try {
        const validatedInput = NearbyAlertInputClientSchema.parse(input);

        // Fetch all disaster data in parallel
        const [earthquake, landslide, fire, whirlwind, volcano, flood] = await Promise.all([
            getEarthquakeData(),
            getLandslideData(),
            getFireData(),
            getWhirlwindData(),
            getVolcanoData(),
            getFloodData()
        ]);

        const alert = await nearbyAlert({
            userLocation: validatedInput,
            language: lang === 'en' ? 'English' : 'Indonesian',
            unsafeRadiusKm: 20, // Define the high-risk radius in KM
            disasterData: { earthquake, landslide, fire, whirlwind, volcano, flood }
        });

        return alert;

    } catch (error) {
        console.error("Error fetching nearby alert:", error);
        if (error instanceof z.ZodError) {
            console.error("Zod validation errors:", error.errors);
        }
        return null;
    }
}
