'use server';

/**
 * @fileOverview A flow to generate a summary and safety recommendations based on whirlwind/typhoon data.
 *
 * - whirlwindInfo - A function that returns a summary and safety tips.
 * - WhirlwindInfoInput - The input type for the whirlwindInfo function.
 * - WhirlwindInfoOutput - The return type for the whirlwindInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WhirlwindInfoInputSchema = z.object({
    location: z.string().describe('The location of the whirlwind/typhoon.'),
    category: z.string().describe('The category or name of the storm (e.g., Tropical Storm, Category 1 Typhoon).'),
    windSpeed: z.number().describe('The maximum sustained wind speed in kilometers per hour.'),
    time: z.string().describe('The time the data was last updated.'),
    potentialThreat: z.string().describe('The potential threats associated with the storm.'),
});
export type WhirlwindInfoInput = z.infer<typeof WhirlwindInfoInputSchema>;

const WhirlwindInfoOutputSchema = z.object({
  summary: z.string().describe('A brief, easy-to-understand summary of the whirlwind/typhoon situation.'),
  safety_recommendations: z.array(z.string()).describe('A list of actionable safety recommendations for residents in the affected area.'),
});
export type WhirlwindInfoOutput = z.infer<typeof WhirlwindInfoOutputSchema>;

export async function whirlwindInfo(input: WhirlwindInfoInput): Promise<WhirlwindInfoOutput> {
  return whirlwindInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'whirlwindInfoPrompt',
  input: {schema: WhirlwindInfoInputSchema},
  output: {schema: WhirlwindInfoOutputSchema},
  prompt: `You are a meteorologist and disaster preparedness expert specializing in tropical cyclones. A whirlwind/typhoon is being monitored with the following details:
- Location: {{{location}}}
- Category/Name: {{{category}}}
- Max Wind Speed: {{{windSpeed}}} km/h
- Last Update: {{{time}}}
- Potential Threat: {{{potentialThreat}}}

Based on this data, provide a concise summary of the situation.
Then, generate a list of essential safety recommendations for people in the potential path of the storm. The tips should be clear, practical, and prioritize immediate actions like securing property and preparing for potential evacuation.
`,
});

const whirlwindInfoFlow = ai.defineFlow(
  {
    name: 'whirlwindInfoFlow',
    inputSchema: WhirlwindInfoInputSchema,
    outputSchema: WhirlwindInfoOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
