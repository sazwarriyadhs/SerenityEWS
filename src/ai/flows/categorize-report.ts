'use server';
/**
 * @fileOverview An AI flow to categorize and summarize user-submitted incident reports.
 *
 * - categorizeReport - A function that handles the report analysis.
 * - CategorizeReportInput - The input type for the categorizeReport function.
 * - CategorizeReportOutput - The return type for the categorizeReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeReportInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the incident, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The user\'s description of the incident.'),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).describe('The GPS coordinates of the incident.'),
  language: z.enum(['Indonesian', 'English']).describe('The language for the AI-generated response.'),
});
export type CategorizeReportInput = z.infer<typeof CategorizeReportInputSchema>;

const CategorizeReportOutputSchema = z.object({
  category: z.string().describe('A concise category for the incident (e.g., "Banjir", "Pohon Tumbang", "Kecelakaan Lalu Lintas", "Jalan Rusak", "Lainnya"). Respond in the requested language.'),
  summary: z.string().describe('A brief, one-sentence summary of the incident based on the photo and description. Respond in the requested language.'),
});
export type CategorizeReportOutput = z.infer<typeof CategorizeReportOutputSchema>;

export async function categorizeReport(input: CategorizeReportInput): Promise<CategorizeReportOutput> {
  return categorizeReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeReportPrompt',
  input: {schema: CategorizeReportInputSchema},
  output: {schema: CategorizeReportOutputSchema},
  prompt: `You are an emergency services dispatcher for the city of Bogor. Your task is to analyze user-submitted incident reports.

Based on the provided photo and description, determine a concise, relevant category for the incident. Then, write a one-sentence summary.

Incident Details:
- Description: {{{description}}}
- Location: Latitude {{{location.latitude}}}, Longitude {{{location.longitude}}}
- Photo: {{media url=photoDataUri}}

Generate the category and summary in {{{language}}}.
Possible categories include, but are not limited to: Banjir, Pohon Tumbang, Kecelakaan Lalu Lintas, Jalan Rusak, Kebakaran, Lainnya. If you generate a category in English, make sure it is a common term like: Flood, Fallen Tree, Traffic Accident, Road Damage, Fire, Other.
`,
});

const categorizeReportFlow = ai.defineFlow(
  {
    name: 'categorizeReportFlow',
    inputSchema: CategorizeReportInputSchema,
    outputSchema: CategorizeReportOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
