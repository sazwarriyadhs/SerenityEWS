'use server';

/**
 * @fileOverview A flow to generate a summary and safety recommendations based on flood risk data.
 *
 * - floodInfo - A function that returns a summary and safety tips.
 * - FloodInfoInput - The input type for the floodInfo function.
 * - FloodInfoOutput - The return type for the floodInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FloodInfoInputSchema = z.object({
    location: z.string().describe('The location of the water level monitoring, e.g., Katulampa Dam.'),
    waterLevel: z.number().describe('The current water level in centimeters.'),
    status: z.string().describe('The current alert status (e.g., Siaga 4, Siaga 3, Siaga 2, Siaga 1).'),
    time: z.string().describe('The time the data was last updated.'),
    language: z.enum(['Indonesian', 'English']).describe('The language for the AI-generated response.'),
});
export type FloodInfoInput = z.infer<typeof FloodInfoInputSchema>;

const FloodInfoOutputSchema = z.object({
  summary: z.string().describe('A brief, easy-to-understand summary of the current water level and flood risk.'),
  safety_recommendations: z.array(z.string()).describe('A list of actionable safety recommendations for residents, especially those in downstream areas.'),
});
export type FloodInfoOutput = z.infer<typeof FloodInfoOutputSchema>;

export async function floodInfo(input: FloodInfoInput): Promise<FloodInfoOutput> {
  return floodInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'floodInfoPrompt',
  input: {schema: FloodInfoInputSchema},
  output: {schema: FloodInfoOutputSchema},
  prompt: `You are a hydrologist and disaster management expert. The current water level at {{{location}}} is being monitored with the following details:
- Water Level: {{{waterLevel}}} cm
- Status: {{{status}}}
- Last Update: {{{time}}}

Based on this data, provide a concise summary of the current situation and the potential flood risk for downstream areas like Jakarta.
Then, generate a list of essential safety recommendations for residents, particularly those living near riverbanks. The tips should be clear, practical, and relevant to the current alert status.
Generate the entire response in {{{language}}}.
`,
});

const floodInfoFlow = ai.defineFlow(
  {
    name: 'floodInfoFlow',
    inputSchema: FloodInfoInputSchema,
    outputSchema: FloodInfoOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
