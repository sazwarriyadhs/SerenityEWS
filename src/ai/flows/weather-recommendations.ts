// This is an autogenerated file from Firebase Studio.
'use server';

/**
 * @fileOverview A flow to generate weather-based recommendations for activities and clothing.
 *
 * - weatherRecommendations - A function that returns recommendations based on the weather forecast.
 * - WeatherRecommendationsInput - The input type for the weatherRecommendations function.
 * - WeatherRecommendationsOutput - The return type for the weatherRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherRecommendationsInputSchema = z.object({
  location: z.enum(['city', 'regency']).describe('The location for which to generate recommendations: city or regency.'),
  forecast: z.array(
    z.object({
      date: z.string().describe('The date of the forecast.'),
      high: z.number().describe('The high temperature for the day in Celsius.'),
      low: z.number().describe('The low temperature for the day in Celsius.'),
      condition: z.string().describe('The weather condition for the day (e.g., sunny, cloudy, rainy).'),
    })
  ).length(3).describe('A 3-day weather forecast for the specified location.'),
  language: z.enum(['Indonesian', 'English']).describe('The language for the AI-generated response.'),
});
export type WeatherRecommendationsInput = z.infer<typeof WeatherRecommendationsInputSchema>;

const WeatherRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      activity: z.string().describe('A recommended activity for the day.'),
      clothing: z.string().describe('Recommended clothing for the day.'),
      justification: z.string().describe('The reasoning behind the activity and clothing recommendations.'),
    })
  ).length(3).describe('A list of weather-tailored activity and clothing recommendation for each day.'),
});
export type WeatherRecommendationsOutput = z.infer<typeof WeatherRecommendationsOutputSchema>;

export async function weatherRecommendations(input: WeatherRecommendationsInput): Promise<WeatherRecommendationsOutput> {
  return weatherRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weatherRecommendationsPrompt',
  input: {schema: WeatherRecommendationsInputSchema},
  output: {schema: WeatherRecommendationsOutputSchema},
  prompt: `You are a helpful assistant that provides recommendations for activities and clothing based on the weather forecast for Bogor.

  Here is the 3-day weather forecast for {{{location}}}:
  {{#each forecast}}
  - Date: {{date}}, High: {{high}}°C, Low: {{low}}°C, Condition: {{condition}}
  {{/each}}

  Generate recommendations for activities and clothing for each day, explaining your reasoning.
  Each object in the recommendations array must contain an "activity", a "clothing" and a "justification" field.
  The length of array must be 3, corresponding to the 3-day forecast above.
  Each "justification" should reference specific weather conditions in the forecast that support the recommendation.
  Generate the entire response in {{{language}}}.
`,
});

const weatherRecommendationsFlow = ai.defineFlow(
  {
    name: 'weatherRecommendationsFlow',
    inputSchema: WeatherRecommendationsInputSchema,
    outputSchema: WeatherRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
