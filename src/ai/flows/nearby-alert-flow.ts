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
  prompt: `You are a "Safety First" disaster alert system for Bogor, Indonesia. Your primary task is to assess if a user is in immediate danger based on their GPS coordinates and the latest disaster data.

User's Location:
- Latitude: {{{userLocation.latitude}}}
- Longitude: {{{userLocation.longitude}}}

Latest Disaster Data:
- Flood (Katulampa Dam): Status '{{{disasterData.flood.status}}}', Water Level {{{disasterData.flood.waterLevel}}}cm. This affects areas downstream along the Ciliwung river. High risk if status is Siaga 1, 2, or 3.
- Earthquake: Magnitude {{{disasterData.earthquake.magnitude}}} located at {{{disasterData.earthquake.location}}}. Any significant magnitude (> 4.5) is a risk for the entire Bogor area.
- Landslide: Risk '{{{disasterData.landslide.riskLevel}}}' at {{{disasterData.landslide.location}}}. Cisarua is in the Bogor Regency (south of Bogor City). High risk if the user is in the regency and risk level is 'High'.
- Fire: '{{{disasterData.fire.status}}}' fire at {{{disasterData.fire.location}}}. Sentul is in the Bogor Regency. High risk if the user is nearby and the fire is 'Active'.
- Volcano (Mount Salak): Status '{{{disasterData.volcano.status}}}'. High risk if status is anything other than 'Level I (Normal)'. Mount Salak is very close to Bogor City.
- Whirlwind/Typhoon: '{{{disasterData.whirlwind.category}}}' with winds {{{disasterData.whirlwind.windSpeed}}} km/h located at {{{disasterData.whirlwind.location}}}. Assess if the potential threat area could include Bogor.

Your Task:
1.  Analyze all disaster data in relation to the user's location.
2.  Prioritize the most immediate and severe threat.
3.  If you determine there is a significant and immediate risk, set 'isAtRisk' to true.
4.  If at risk, generate a concise 'alertTitle', a clear 'alertMessage' explaining the specific threat and why they are at risk, and a list of crucial 'safetyRecommendations' (at least 3).
5.  If there is no immediate, significant risk (e.g., earthquake magnitude is low, dam status is normal, volcano is normal), set 'isAtRisk' to false. In this case, all other fields should be empty strings or empty arrays.
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
    const {output} = await prompt(input);
    return output!;
  }
);
