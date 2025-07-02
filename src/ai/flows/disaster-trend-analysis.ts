'use server';
/**
 * @fileOverview An AI flow to analyze annual disaster data and generate trend insights.
 *
 * - disasterTrendAnalysis - A function that handles the trend analysis.
 * - DisasterTrendAnalysisInput - The input type for the function.
 * - DisasterTrendAnalysisOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DisasterTrendAnalysisInputSchema = z.object({
  locationName: z.string().describe('The name of the location being analyzed (e.g., "Bogor City").'),
  year: z.number().describe('The year the data represents.'),
  data: z.array(
    z.object({
      category: z.string().describe('The disaster category.'),
      count: z.number().describe('The number of incidents for that category.'),
    })
  ).describe('The aggregated disaster data for the year.'),
  language: z.enum(['Indonesian', 'English']).describe('The language for the AI-generated response.'),
});
export type DisasterTrendAnalysisInput = z.infer<typeof DisasterTrendAnalysisInputSchema>;

const DisasterTrendAnalysisOutputSchema = z.object({
  trendSummary: z.string().describe('A brief, one-paragraph summary of the main disaster trend for the year.'),
  keyObservations: z.array(z.string()).describe('A list of 2-3 key, insightful observations from the data.'),
  futureOutlook: z.string().describe('A short outlook or recommendation for the future based on the trends.'),
});
export type DisasterTrendAnalysisOutput = z.infer<typeof DisasterTrendAnalysisOutputSchema>;

export async function disasterTrendAnalysis(input: DisasterTrendAnalysisInput): Promise<DisasterTrendAnalysisOutput> {
  return disasterTrendAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'disasterTrendAnalysisPrompt',
  input: {schema: DisasterTrendAnalysisInputSchema},
  output: {schema: DisasterTrendAnalysisOutputSchema},
  prompt: `You are a professional disaster data analyst. Your task is to analyze the provided annual disaster report for {{{locationName}}} for the year {{{year}}} and provide insightful analysis.

Annual Disaster Data:
{{#each data}}
- Category: {{{category}}}, Incidents: {{{count}}}
{{/each}}

Based on this data, please perform the following analysis in {{{language}}}:

1.  **Trend Summary**: Write a concise, one-paragraph summary identifying the most significant trend. What was the most frequent type of disaster? Was there a particular category that stands out?
2.  **Key Observations**: Provide a list of 2 or 3 bullet points highlighting the most important takeaways from the data. These should be specific and data-driven.
3.  **Future Outlook**: Briefly state a forward-looking perspective. Based on the data, what should authorities and citizens be most prepared for in the coming year?

Your analysis should be clear, professional, and easy to understand for a general audience.
`,
});

const disasterTrendAnalysisFlow = ai.defineFlow(
  {
    name: 'disasterTrendAnalysisFlow',
    inputSchema: DisasterTrendAnalysisInputSchema,
    outputSchema: DisasterTrendAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
