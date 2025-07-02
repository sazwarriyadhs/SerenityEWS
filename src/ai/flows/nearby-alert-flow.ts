'use server';

/**
 * @fileOverview An AI flow to assess disaster risk based on user location and generate tailored alerts.
 *
 * - nearbyAlert - A function that handles the risk assessment.
 * - NearbyAlertInput - The input type for the nearbyAlert function.
 * - NearbyAlertOutput - The return type for the nearbyAlert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { EarthquakeData } from '@/lib/earthquake';
import type { LandslideData } from '@/lib/landslide';
import type { FireData } from '@/lib/fire';
import type { WhirlwindData } from '@/lib/whirlwind';
import type { VolcanoData } from '@/lib/volcano';
import type { FloodData } from '@/lib/flood';
import { getDistance } from '@/lib/utils';


const NearbyAlertInputSchema = z.object({
  userLocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).describe('The GPS coordinates of the user.'),
  language: z.enum(['Indonesian', 'English']).describe('The language for the AI-generated response.'),
  unsafeRadiusKm: z.number().describe('The radius in kilometers from a disaster epicenter considered to be high-risk.'),
  disasterData: z.object({
      earthquake: z.custom<EarthquakeData>(),
      landslide: z.custom<LandslideData>(),
      fire: z.custom<FireData>(),
      whirlwind: z.custom<WhirlwindData>(),
      volcano: z.custom<VolcanoData>(),
      flood: z.custom<FloodData>(),
  }).describe('The latest data for all monitored disasters.'),
});
export type NearbyAlertInput = z.infer<typeof NearbyAlertInputSchema>;

const NearbyAlertOutputSchema = z.object({
  isAtRisk: z.boolean().describe('Whether or not the user is determined to be in a high-risk area.'),
  riskType: z.string().describe('The primary type of risk identified (e.g., "Flood", "Earthquake"). Empty if not at risk. Respond in the requested language.'),
  alertTitle: z.string().describe('A concise, urgent title for the alert. Empty if not at risk. Respond in the requested language.'),
  alertMessage: z.string().describe('A summary of the situation and why the user is considered at risk, including the location of the hazard. Empty if not at risk. Respond in the requested language.'),
  riskDistanceKm: z.number().optional().describe('The approximate distance in kilometers from the user to the hazard. Only present if at risk.'),
  safetyRecommendations: z.array(z.string()).describe('A list of actionable safety recommendations tailored to the specific risk. Empty if not at risk. Respond in the requested language.'),
});
export type NearbyAlertOutput = z.infer<typeof NearbyAlertOutputSchema>;

export async function nearbyAlert(input: NearbyAlertInput): Promise<NearbyAlertOutput> {
  return nearbyAlertFlow(input);
}


// Internal schema for the prompt, includes pre-calculated data
const EnrichedDisasterDataSchema = z.object({
    type: z.string(),
    details: z.string(),
    distanceKm: z.number().optional(), // Distance from user
    isHighRisk: z.boolean(), // Pre-calculated risk flag
});

const PromptInputSchema = z.object({
    userLocation: z.object({
        latitude: z.number(),
        longitude: z.number(),
    }),
    language: z.enum(['Indonesian', 'English']),
    enrichedDisasters: z.array(EnrichedDisasterDataSchema),
});


const prompt = ai.definePrompt({
  name: 'nearbyAlertPrompt',
  input: {schema: PromptInputSchema},
  output: {schema: NearbyAlertOutputSchema},
  prompt: `You are a "Safety First" disaster alert system for Bogor, Indonesia. Your primary task is to assess if a user is in immediate danger based on pre-analyzed disaster data.

User's Location:
- Latitude: {{{userLocation.latitude}}}
- Longitude: {{{userLocation.longitude}}}

Analyzed Disaster Data (including distance from user and if it's considered high-risk):
{{#each enrichedDisasters}}
- Disaster Type: {{{type}}}
  - Details: {{{details}}}
  - Is High Risk: {{{isHighRisk}}}
  {{#if distanceKm}}
  - Distance from User: ~{{{distanceKm}}} km
  {{/if}}
{{/each}}

Your Task:
1.  Review the list of disasters. The 'isHighRisk' flag is your primary signal.
2.  Prioritize the most immediate and severe threat. A 'true' value for 'isHighRisk' indicates a significant threat you must report on. A direct proximity threat (e.g., Fire, Landslide) is generally higher priority than a regional one (e.g., distant earthquake), unless the regional event is exceptionally severe.
3.  If you find one or more high-risk disasters, set 'isAtRisk' to true and focus on the SINGLE MOST URGENT one.
4.  If at risk:
    a. Fill in 'riskType' (e.g., "Flood", "Earthquake"), 'alertTitle', and 'alertMessage'. The message must explain the specific threat, its location (from the 'details' field), and state that the user is in a high-risk zone.
    b. Set 'riskDistanceKm' to the provided distance for the hazard.
    c. Generate a list of crucial 'safetyRecommendations' (at least 3) for that specific risk.
5.  If there are NO disasters with 'isHighRisk' set to true, set 'isAtRisk' to false. All other fields should be empty.
6.  Provide the entire response in {{{language}}}.
`,
});

const nearbyAlertFlow = ai.defineFlow(
  {
    name: 'nearbyAlertFlow',
    inputSchema: NearbyAlertInputSchema,
    outputSchema: NearbyAlertOutputSchema,
  },
  async (input) => {
    const { userLocation, unsafeRadiusKm, disasterData, language } = input;
    const enrichedDisasters: z.infer<typeof EnrichedDisasterDataSchema>[] = [];

    // 1. Pre-process and enrich disaster data
    // Flood
    const isFloodRisk = ['Siaga 1', 'Siaga 2', 'Siaga 3'].some(s => disasterData.flood.status.includes(s));
    enrichedDisasters.push({
        type: 'Flood',
        details: `Status '${disasterData.flood.status}' at ${disasterData.flood.location}. This poses a risk to downstream areas.`,
        isHighRisk: isFloodRisk,
    });

    // Earthquake
    const eqDistance = getDistance(userLocation.latitude, userLocation.longitude, disasterData.earthquake.epicenterCoords.latitude, disasterData.earthquake.epicenterCoords.longitude);
    const isEqRisk = eqDistance <= unsafeRadiusKm && disasterData.earthquake.magnitude > 4.5;
    enrichedDisasters.push({
        type: 'Earthquake',
        details: `Magnitude ${disasterData.earthquake.magnitude} at ${disasterData.earthquake.location}.`,
        distanceKm: Math.round(eqDistance),
        isHighRisk: isEqRisk,
    });

    // Landslide
    const landslideDistance = getDistance(userLocation.latitude, userLocation.longitude, disasterData.landslide.coords.latitude, disasterData.landslide.coords.longitude);
    const isLandslideRisk = landslideDistance <= unsafeRadiusKm && (disasterData.landslide.riskLevel === 'High' || disasterData.landslide.riskLevel === 'Tinggi');
    enrichedDisasters.push({
        type: 'Landslide',
        details: `Risk '${disasterData.landslide.riskLevel}' at ${disasterData.landslide.location}.`,
        distanceKm: Math.round(landslideDistance),
        isHighRisk: isLandslideRisk,
    });

    // Fire
    const fireDistance = getDistance(userLocation.latitude, userLocation.longitude, disasterData.fire.coords.latitude, disasterData.fire.coords.longitude);
    const isFireRisk = fireDistance <= unsafeRadiusKm && disasterData.fire.status === 'Active';
    enrichedDisasters.push({
        type: 'Fire',
        details: `'${disasterData.fire.status}' fire at ${disasterData.fire.location}.`,
        distanceKm: Math.round(fireDistance),
        isHighRisk: isFireRisk,
    });

    // Volcano
    const volcanoDistance = getDistance(userLocation.latitude, userLocation.longitude, disasterData.volcano.coords.latitude, disasterData.volcano.coords.longitude);
    const isVolcanoRisk = volcanoDistance <= unsafeRadiusKm && disasterData.volcano.status !== 'Level I (Normal)';
    enrichedDisasters.push({
        type: 'Volcano',
        details: `Status '${disasterData.volcano.status}' at ${disasterData.volcano.name}.`,
        distanceKm: Math.round(volcanoDistance),
        isHighRisk: isVolcanoRisk,
    });

    // Whirlwind
    const whirlwindDistance = getDistance(userLocation.latitude, userLocation.longitude, disasterData.whirlwind.epicenterCoords.latitude, disasterData.whirlwind.epicenterCoords.longitude);
    const isWhirlwindRisk = whirlwindDistance <= unsafeRadiusKm;
    enrichedDisasters.push({
        type: 'Whirlwind',
        details: `'${disasterData.whirlwind.category}' with epicenter at ${disasterData.whirlwind.location}.`,
        distanceKm: Math.round(whirlwindDistance),
        isHighRisk: isWhirlwindRisk,
    });
    
    // 2. Call the prompt with the enriched data
    const {output} = await prompt({
        userLocation,
        language,
        enrichedDisasters,
    });
    return output!;
  }
);
