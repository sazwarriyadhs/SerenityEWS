'use server';

/**
 * @fileOverview A flow to generate a summary and safety recommendations based on earthquake data.
 *
 * - earthquakeInfo - A function that returns a summary and safety tips.
 * - EarthquakeInfoInput - The input type for the earthquakeInfo function.
 * - EarthquakeInfoOutput - The return type for the earthquakeInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EarthquakeInfoInputSchema = z.object({
    magnitude: z.number().describe('The magnitude of the earthquake on the Richter scale.'),
    location: z.string().describe('The location of the earthquake epicenter.'),
    depth: z.number().describe('The depth of the earthquake in kilometers.'),
    time: z.string().describe('The time the earthquake occurred.'),
});
export type EarthquakeInfoInput = z.infer<typeof EarthquakeInfoInputSchema>;

const EarthquakeInfoOutputSchema = z.object({
  summary: z.string().describe('A brief, easy-to-understand summary of the earthquake event.'),
  safety_tips: z.array(z.string()).describe('A list of actionable safety tips for residents in the affected area.'),
});
export type EarthquakeInfoOutput = z.infer<typeof EarthquakeInfoOutputSchema>;

export async function earthquakeInfo(input: EarthquakeInfoInput): Promise<EarthquakeInfoOutput> {
  return earthquakeInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'earthquakeInfoPrompt',
  input: {schema: EarthquakeInfoInputSchema},
  output: {schema: EarthquakeInfoOutputSchema},
  prompt: `You are a seismologist and disaster preparedness expert. An earthquake has just occurred with the following details:
- Magnitude: {{{magnitude}}} on the Richter scale
- Location: {{{location}}}
- Depth: {{{depth}}} km
- Time: {{{time}}}

Based on this data, provide a concise summary of the event.
Then, generate a list of essential safety tips for people in and around the affected area. The tips should be clear, concise, and practical.
Focus on immediate actions and post-earthquake precautions.
`,
});

const earthquakeInfoFlow = ai.defineFlow(
  {
    name: 'earthquakeInfoFlow',
    inputSchema: EarthquakeInfoInputSchema,
    outputSchema: EarthquakeInfoOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
