'use server';

/**
 * @fileOverview A flow to generate a summary and safety recommendations based on volcano activity data.
 *
 * - volcanoInfo - A function that returns a summary and safety recommendations.
 * - VolcanoInfoInput - The input type for the volcanoInfo function.
 * - VolcanoInfoOutput - The return type for the volcanoInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VolcanoInfoInputSchema = z.object({
    name: z.string().describe('The name of the volcano.'),
    status: z.string().describe('The current alert level of the volcano (e.g., Level I - Normal, Level II - Waspada, Level III - Siaga, Level IV - Awas).'),
    lastEruption: z.string().describe('The time of the last recorded eruption or significant activity.'),
    recommendations: z.array(z.string()).describe('Official recommendations from the monitoring agency.'),
});
export type VolcanoInfoInput = z.infer<typeof VolcanoInfoInputSchema>;

const VolcanoInfoOutputSchema = z.object({
  summary: z.string().describe('A brief, easy-to-understand summary of the volcano\'s current status.'),
  safety_precautions: z.array(z.string()).describe('A list of actionable safety precautions for residents and visitors in the area.'),
});
export type VolcanoInfoOutput = z.infer<typeof VolcanoInfoOutputSchema>;

export async function volcanoInfo(input: VolcanoInfoInput): Promise<VolcanoInfoOutput> {
  return volcanoInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'volcanoInfoPrompt',
  input: {schema: VolcanoInfoInputSchema},
  output: {schema: VolcanoInfoOutputSchema},
  prompt: `You are a volcanologist and disaster preparedness expert. The current status for {{{name}}} is as follows:
- Status: {{{status}}}
- Last Eruption/Activity: {{{lastEruption}}}
- Official Recommendations:
{{#each recommendations}}
  - {{{this}}}
{{/each}}

Based on this data, provide a concise summary of the current situation.
Then, generate a list of essential safety precautions for people in the vicinity. The precautions should be clear, practical, and tailored to the current alert level.
`,
});

const volcanoInfoFlow = ai.defineFlow(
  {
    name: 'volcanoInfoFlow',
    inputSchema: VolcanoInfoInputSchema,
    outputSchema: VolcanoInfoOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
