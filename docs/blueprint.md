# **App Name**: Bogor Weather Watch

## Core Features:

- Real-Time Weather Display: Display real-time weather data (temperature, humidity, wind speed, and direction) for the city and regency of Bogor, sourced from a weather API.
- 7-Day Forecast: Present a 7-day weather forecast for both locations, including daily high/low temperatures and weather conditions, pulled from the same weather API.
- Location Toggle: Allow users to switch between viewing weather data for Bogor city and Bogor regency via a location toggle.
- Location Preference Storage: The system should store location preference in a cookie, and remember it.
- AI-Powered Recommendations: Generate location-specific recommendations of activities and suitable clothing based on the weather forecast for the next 3 days, presented as suggestions. Use LLM to decide when and if each item is appropriate. LLM used as a reasoning tool here.
- Weather Icons: Visually represent weather conditions with corresponding icons (e.g., sun for sunny, cloud for cloudy).

## Style Guidelines:

- Primary color: A sky blue (#66B2FF) to reflect the sky and weather theme. Use a fairly vibrant color since weather and outdoor themes often want to be associated with cheer.
- Background color: Very light blue (#F0F8FF) for a clean, airy feel. The lightness provides sufficient contrast against the sky-blue primary color.
- Accent color: A slightly more saturated, turquoise-leaning blue (#40E0D0) to highlight interactive elements and calls to action. The accent will pop against the background due to added brightness.
- Body and headline font: 'PT Sans', a modern, friendly sans-serif suitable for all text.
- Use outlined icons to represent different weather conditions (sun, cloud, rain, snow) for clarity.
- Divide the layout into distinct sections for real-time data, the forecast, and AI recommendations, using a clean, card-based design.
- Employ subtle transitions when switching between Bogor city and regency views to provide a smooth user experience.