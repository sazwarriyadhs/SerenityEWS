'use server';

/**
 * @fileOverview A flow to generate a summary and safety recommendations based on landslide data.
 *
 * - landslideInfo - A function that returns a summary and safety tips.
 * - LandslideInfoInput - The input type for the landslideInfo function.
 * - LandslideInfoOutput - The return type for the landslideInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LandslideInfoInputSchema = z.object({
    location: z.string().describe('The location of the potential landslide.'),
    riskLevel: z.string().describe('The assessed risk level (e.g., High, Moderate, Low).'),
    trigger: z.string().describe('The primary trigger for the landslide risk (e.g., heavy rainfall, earthquake).'),
    time: z.string().describe('The time the risk was assessed.'),
    potentialImpact: z.string().describe('The potential impact of the landslide.'),
    language: z.enum(['Indonesian', 'English']).describe('The language for the AI-generated response.'),
});
export type LandslideInfoInput = z.infer<typeof LandslideInfoInputSchema>;

const LandslideInfoOutputSchema = z.object({
  summary: z.string().describe('A brief, easy-to-understand summary of the landslide risk.'),
  safety_recommendations: z.array(z.string()).describe('A list of actionable safety recommendations for residents in the affected area.'),
});
export type LandslideInfoOutput = z.infer<typeof LandslideInfoOutputSchema>;

export async function landslideInfo(input: LandslideInfoInput): Promise<LandslideInfoOutput> {
  return landslideInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'landslideInfoPrompt',
  input: {schema: LandslideInfoInputSchema},
  output: {schema: LandslideInfoOutputSchema},
  prompt: `You are a geologist and disaster preparedness expert specializing in landslides. A landslide risk has been identified with the following details:
- Location: {{{location}}}
- Risk Level: {{{riskLevel}}}
- Trigger: {{{trigger}}}
- Time of Assessment: {{{time}}}
- Potential Impact: {{{potentialImpact}}}

Based on this data, provide a concise summary of the situation.
Then, generate a list of essential safety recommendations for people in and around the high-risk area. The tips should be clear, practical, and prioritize immediate actions and evacuation procedures if necessary.
Generate the entire response in {{{language}}}.
`,
});

const landslideInfoFlow = ai.defineFlow(
  {
    name: 'landslideInfoFlow',
    inputSchema: LandslideInfoInputSchema,
    outputSchema: LandslideInfoOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
