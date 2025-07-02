'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CurrentWeather as CurrentWeatherType } from "@/lib/weather";
import { WeatherIcon } from "./weather-icon";
import { Droplets, Wind } from "lucide-react";

interface CurrentWeatherProps {
    current: CurrentWeatherType | undefined;
    isLoading: boolean;
}

export default function CurrentWeather({ current, isLoading }: CurrentWeatherProps) {

    if (isLoading || !current) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <Skeleton className="w-24 h-24 rounded-full" />
                        <div>
                            <Skeleton className="h-16 w-32 mb-2" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                            <Skeleton className="h-6 w-6" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Skeleton className="h-6 w-6" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full shadow-lg border-2 border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-2xl text-primary font-bold">Current Weather in {current.locationName}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-4 sm:gap-6">
                    <WeatherIcon condition={current.condition} className="w-20 h-20 sm:w-24 sm:h-24 text-accent" />
                    <div>
                        <p className="text-6xl sm:text-7xl font-bold text-foreground">{current.temperature}°C</p>
                        <p className="text-xl text-muted-foreground font-medium">{current.condition}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                        <Droplets className="w-6 h-6 text-primary" />
                        <span className="font-bold">{current.humidity}%</span>
                        <span className="text-sm text-muted-foreground">Humidity</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Wind className="w-6 h-6 text-primary" />
                        <span className="font-bold">{current.windSpeed} km/h</span>
                        <span className="text-sm text-muted-foreground">{current.windDirection}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
