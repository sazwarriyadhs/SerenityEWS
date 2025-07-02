import { config } from 'dotenv';
config();

import '@/ai/flows/weather-recommendations.ts';
import '@/ai/flows/earthquake-info.ts';
import '@/ai/flows/landslide-info.ts';
import '@/ai/flows/fire-info.ts';
import '@/ai/flows/whirlwind-info.ts';
import '@/ai/flows/volcano-info.ts';
import '@/ai/flows/flood-info.ts';
import '@/ai/flows/categorize-report.ts';
import '@/ai/flows/nearby-alert-flow.ts';
import '@/ai/flows/disaster-trend-analysis.ts';
