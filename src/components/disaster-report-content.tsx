'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import type { Location } from '@/lib/weather';
import { getAnnualDisasterData, fetchDisasterTrendAnalysis, getAvailableYears } from '@/app/actions';
import type { AnnualDisasterData } from '@/app/actions';
import type { DisasterTrendAnalysisOutput } from '@/ai/flows/disaster-trend-analysis';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DisasterChart } from '@/components/disaster-chart';
import { TrendAnalysisCard } from '@/components/trend-analysis-card';
import { BarChart3 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export default function DisasterReportContent() {
    const { t, language } = useLanguage();
    const [location, setLocation] = useState<Location>('city');
    const [availableYears, setAvailableYears] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [chartData, setChartData] = useState<AnnualDisasterData[]>([]);
    const [aiAnalysis, setAiAnalysis] = useState<DisasterTrendAnalysisOutput | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        async function fetchYears() {
            const years = await getAvailableYears();
            setAvailableYears(years);
            if (years.length > 0) {
                setSelectedYear(years[0]);
            }
        }
        fetchYears();
    }, []);

    useEffect(() => {
        if (!selectedYear) return;

        startTransition(async () => {
            setChartData([]);
            setAiAnalysis(null);
            
            const data = await getAnnualDisasterData(location, selectedYear);
            setChartData(data);

            if (data.length > 0) {
                const analysis = await fetchDisasterTrendAnalysis({
                    locationName: location === 'city' ? t('weather.city') : t('weather.regency'),
                    year: selectedYear,
                    data,
                }, language);
                setAiAnalysis(analysis);
            }
        });

    }, [location, selectedYear, language, t]);

    const handleLocationChange = (newLocation: Location) => {
        if (newLocation !== location) {
            setLocation(newLocation);
        }
    };
    
    const handleYearChange = (yearString: string) => {
        const year = parseInt(yearString, 10);
        if (year !== selectedYear) {
            setSelectedYear(year);
        }
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center gap-3">
                    <BarChart3 className="h-10 w-10" />
                    <span>{t('disaster_report.title')}</span>
                </h1>
                <p className="text-muted-foreground mt-2">{t('disaster_report.subtitle')}</p>
            </header>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="bg-primary/20 p-1 rounded-full flex gap-1 transition-all duration-300">
                    <Button onClick={() => handleLocationChange('city')} variant={location === 'city' ? 'default' : 'ghost'} className="rounded-full px-4 sm:px-6 shadow-sm" size="sm">{t('weather.city')}</Button>
                    <Button onClick={() => handleLocationChange('regency')} variant={location === 'regency' ? 'default' : 'ghost'} className="rounded-full px-4 sm:px-6 shadow-sm" size="sm">{t('weather.regency')}</Button>
                </div>
                {availableYears.length > 0 && (
                     <Select value={selectedYear.toString()} onValueChange={handleYearChange} disabled={isPending}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder={t('disaster_report.select_year')} />
                        </SelectTrigger>
                        <SelectContent>
                            {availableYears.map(year => (
                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                   {isPending ? <Skeleton className="w-full h-[400px]" /> : <DisasterChart data={chartData} />}
                </div>
                <div className="lg:col-span-2">
                    <TrendAnalysisCard analysis={aiAnalysis} isLoading={isPending} />
                </div>
            </div>
             <footer className="text-center mt-12 text-muted-foreground text-sm">
                <p>{t('disaster_report.footer')}</p>
            </footer>
        </div>
    );
}
