'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Location, WeatherData } from '@/lib/weather';
import { fetchWeatherData, fetchAIRecommendations } from '@/app/actions';
import type { WeatherRecommendationsOutput } from '@/ai/flows/weather-recommendations';
import CurrentWeather from './current-weather';
import SevenDayForecast from './seven-day-forecast';
import AiRecommendations from './ai-recommendations';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';

const setCookie = (name: string, value: string, days: number) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  if (typeof document !== 'undefined') {
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }
}

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
    let c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

export default function BogorWeatherWatch() {
    const [location, setLocation] = useState<Location>('city');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [recommendations, setRecommendations] = useState<WeatherRecommendationsOutput | null>(null);
    const [isPending, startTransition] = useTransition();
    const [isRecommendationsLoading, setRecommendationsLoading] = useState(true);
    const { toast } = useToast();
    const { language, t } = useLanguage();

    useEffect(() => {
        const savedLocation = getCookie('bogor-weather-location') as Location;
        const initialLocation = savedLocation || 'city';
        setLocation(initialLocation);
    }, []);

    useEffect(() => {
        loadData(location, true);
    }, [location, language]);

    useEffect(() => {
        if (weatherData?.forecast) {
            setRecommendationsLoading(true);
            const threeDayForecast = weatherData.forecast.slice(0, 3).map(day => ({
                date: day.fullDate,
                high: day.high,
                low: day.low,
                condition: day.condition
            }));

            const input = {
                location: location,
                forecast: threeDayForecast
            };

            fetchAIRecommendations(input, language).then(res => {
                if(res) {
                    setRecommendations(res);
                } else {
                    toast({
                        variant: "destructive",
                        title: t('errors.ai_error_title'),
                        description: t('errors.ai_error_description', t('nav.weather').toLowerCase()),
                    })
                }
            }).finally(() => {
                setRecommendationsLoading(false);
            });
        }
    }, [weatherData, location, toast, language, t]);

    const loadData = (newLocation: Location, initialLoad = false) => {
        if (!initialLoad) {
          startTransition(async () => {
            const data = await fetchWeatherData(newLocation, language);
            setWeatherData(data);
          });
        } else {
          // Avoid transition on initial load to prevent UI flicker
          (async () => {
            setRecommendationsLoading(true);
            const data = await fetchWeatherData(newLocation, language);
            setWeatherData(data);
          })();
        }
    };

    const handleLocationChange = (newLocation: Location) => {
        if (newLocation === location) return;
        
        setLocation(newLocation);
        setCookie('bogor-weather-location', newLocation, 365);
        
        // Clear old data to show loading skeletons
        setWeatherData(null);
        setRecommendations(null);

        loadData(newLocation);
    };

    return (
        <div className="w-full bg-background text-foreground p-4 sm:p-6 md:p-8 font-body">
            <div className="container mx-auto">
                <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">{t('weather.title')}</h1>
                    </div>
                    <div className="bg-primary/20 p-1 rounded-full flex gap-1 transition-all duration-300">
                        <Button onClick={() => handleLocationChange('city')} variant={location === 'city' ? 'default' : 'ghost'} className="rounded-full px-4 sm:px-6 shadow-sm" size="sm">{t('weather.city')}</Button>
                        <Button onClick={() => handleLocationChange('regency')} variant={location === 'regency' ? 'default' : 'ghost'} className="rounded-full px-4 sm:px-6 shadow-sm" size="sm">{t('weather.regency')}</Button>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-3">
                        <CurrentWeather current={weatherData?.current} isLoading={isPending || !weatherData} />
                    </div>
                    <div className="lg:col-span-3">
                         <SevenDayForecast forecast={weatherData?.forecast} isLoading={isPending || !weatherData} />
                    </div>
                    <div className="lg:col-span-3">
                         <AiRecommendations recommendations={recommendations} isLoading={isRecommendationsLoading || isPending} />
                    </div>
                </main>

                <footer className="text-center mt-12 text-muted-foreground text-sm">
                    <p>{t('weather.footer')}</p>
                </footer>
            </div>
        </div>
    );
}
