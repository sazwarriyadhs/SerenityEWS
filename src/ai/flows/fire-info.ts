'use server';

/**
 * @fileOverview A flow to generate a summary and safety recommendations based on fire data.
 *
 * - fireInfo - A function that returns a summary and safety tips.
 * - FireInfoInput - The input type for the fireInfo function.
 * - FireInfoOutput - The return type for the fireInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FireInfoInputSchema = z.object({
    location: z.string().describe('The location of the fire incident.'),
    status: z.string().describe('The current status of the fire (e.g., Active, Contained).'),
    type: z.string().describe('The type of fire (e.g., Wildfire, Structural).'),
    time: z.string().describe('The time the incident was reported.'),
    cause: z.string().describe('The suspected cause of the fire.'),
});
export type FireInfoInput = z.infer<typeof FireInfoInputSchema>;

const FireInfoOutputSchema = z.object({
  summary: z.string().describe('A brief, easy-to-understand summary of the fire incident.'),
  safety_recommendations: z.array(z.string()).describe('A list of actionable safety recommendations for residents in the affected area.'),
});
export type FireInfoOutput = z.infer<typeof FireInfoOutputSchema>;

export async function fireInfo(input: FireInfoInput): Promise<FireInfoOutput> {
  return fireInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fireInfoPrompt',
  input: {schema: FireInfoInputSchema},
  output: {schema: FireInfoOutputSchema},
  prompt: `You are a fire safety expert and emergency response coordinator. A fire incident has been reported with the following details:
- Location: {{{location}}}
- Status: {{{status}}}
- Type: {{{type}}}
- Time of Report: {{{time}}}
- Cause: {{{cause}}}

Based on this data, provide a concise summary of the situation.
Then, generate a list of essential safety recommendations for people in and around the affected area. The tips should be clear, practical, and prioritize immediate actions, especially regarding air quality and potential evacuation orders.
`,
});

const fireInfoFlow = ai.defineFlow(
  {
    name: 'fireInfoFlow',
    inputSchema: FireInfoInputSchema,
    outputSchema: FireInfoOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
