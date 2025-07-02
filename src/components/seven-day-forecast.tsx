'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ForecastDay } from "@/lib/weather";
import { WeatherIcon } from "./weather-icon";

interface SevenDayForecastProps {
    forecast: ForecastDay[] | undefined;
    isLoading: boolean;
}

const ForecastDayCard = ({ day }: { day: ForecastDay }) => (
    <div className="flex flex-col items-center justify-center gap-2 p-4 bg-secondary/50 rounded-lg transition-transform hover:scale-105 hover:shadow-md">
        <p className="font-bold text-lg">{day.date}</p>
        <WeatherIcon condition={day.condition} className="w-12 h-12 text-accent" />
        <div className="text-center">
            <p className="font-semibold text-foreground">{day.high}°</p>
            <p className="text-muted-foreground">{day.low}°</p>
        </div>
    </div>
);

const ForecastSkeleton = () => (
    <div className="flex flex-col items-center justify-center gap-2 p-4 bg-secondary/50 rounded-lg">
        <Skeleton className="h-7 w-16 mb-2"/>
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="text-center mt-2">
            <Skeleton className="h-5 w-8 mb-1"/>
            <Skeleton className="h-4 w-8"/>
        </div>
    </div>
);

export default function SevenDayForecast({ forecast, isLoading }: SevenDayForecastProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl text-primary font-bold">7-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
                    {isLoading || !forecast
                        ? Array.from({ length: 7 }).map((_, index) => <ForecastSkeleton key={index} />)
                        : forecast.map(day => <ForecastDayCard key={day.fullDate} day={day} />)}
                </div>
            </CardContent>
        </Card>
    );
}
