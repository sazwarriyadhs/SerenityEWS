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
  alertMessage: z.string().describe('A summary of the situation and why the user is considered at risk. Empty if not at risk. Respond in the requested language.'),
  riskDistanceKm: z.number().optional().describe('The approximate distance in kilometers from the user to the hazard. Only present if at risk.'),
  safetyRecommendations: z.array(z.string()).describe('A list of actionable safety recommendations tailored to the specific risk. Empty if not at risk. Respond in the requested language.'),
});
export type NearbyAlertOutput = z.infer<typeof NearbyAlertOutputSchema>;

export async function nearbyAlert(input: NearbyAlertInput): Promise<NearbyAlertOutput> {
  return nearbyAlertFlow(input);
}

const prompt = ai.definePrompt({
  name: 'nearbyAlertPrompt',
  input: {schema: NearbyAlertInputSchema},
  output: {schema: NearbyAlertOutputSchema},
  prompt: `You are a "Safety First" disaster alert system for Bogor, Indonesia. Your primary task is to assess if a user is in immediate danger based on their GPS coordinates and the latest disaster data. A user is considered at high risk if they are within {{{unsafeRadiusKm}}} km of a hazard's coordinates.

User's Location:
- Latitude: {{{userLocation.latitude}}}
- Longitude: {{{userLocation.longitude}}}

Latest Disaster Data & Coordinates:
- Flood (Katulampa Dam): Status '{{{disasterData.flood.status}}}' at {{{disasterData.flood.location}}}. This is a high risk if status is Siaga 1, 2, or 3. The risk is for downstream areas, so proximity to the dam at {{{disasterData.flood.damCoords.latitude}}}, {{{disasterData.flood.damCoords.longitude}}} is not the primary factor, but the status is.
- Earthquake: Magnitude {{{disasterData.earthquake.magnitude}}} at {{{disasterData.earthquake.location}}}. Coords: {{{disasterData.earthquake.epicenterCoords.latitude}}}, {{{disasterData.earthquake.epicenterCoords.longitude}}}. Any magnitude > 4.5 is a potential risk.
- Landslide: Risk '{{{disasterData.landslide.riskLevel}}}' at {{{disasterData.landslide.location}}}. Coords: {{{disasterData.landslide.coords.latitude}}}, {{{disasterData.landslide.coords.longitude}}}. High risk if level is 'High'.
- Fire: '{{{disasterData.fire.status}}}' fire at {{{disasterData.fire.location}}}. Coords: {{{disasterData.fire.coords.latitude}}}, {{{disasterData.fire.coords.longitude}}}. High risk if 'Active'.
- Volcano (Mount Salak): Status '{{{disasterData.volcano.status}}}' at {{{disasterData.volcano.name}}}. Coords: {{{disasterData.volcano.coords.latitude}}}, {{{disasterData.volcano.coords.longitude}}}. High risk if status is not 'Level I (Normal)'.
- Whirlwind/Typhoon: '{{{disasterData.whirlwind.category}}}' with epicenter at {{{disasterData.whirlwind.location}}}. Coords: {{{disasterData.whirlwind.epicenterCoords.latitude}}}, {{{disasterData.whirlwind.epicenterCoords.longitude}}}.

Your Task:
1.  Analyze all disaster data. For each disaster, determine if the user's location is within the {{{unsafeRadiusKm}}} km high-risk radius of the disaster's coordinates.
2.  Prioritize the most immediate and severe threat. A direct proximity threat (e.g., Fire, Landslide) is generally higher priority than a regional one (e.g., distant earthquake), unless the regional event is exceptionally severe. Flood risk is determined by status, not proximity.
3.  If you determine there is a significant risk due to proximity or a high alert status, set 'isAtRisk' to true.
4.  If at risk:
    a. Fill in 'riskType', 'alertTitle', and 'alertMessage'. The message must explain the specific threat, explicitly mention the location of the hazard, and state that they are within the high-risk zone.
    b. Estimate the 'riskDistanceKm' from the user to the specific hazard.
    c. Generate a list of crucial 'safetyRecommendations' (at least 3).
5.  If there is no immediate, significant risk, set 'isAtRisk' to false. All other fields should be empty or null.
6.  Provide the entire response in {{{language}}}.
`,
});

const categorizeReportFlow = ai.defineFlow(
  {
    name: 'nearbyAlertFlow',
    inputSchema: NearbyAlertInputSchema,
    outputSchema: NearbyAlertOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
