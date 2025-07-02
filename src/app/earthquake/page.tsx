'use client';

import { useState, useEffect } from 'react';
import { fetchEarthquakeData, fetchEarthquakeInfo } from '@/app/actions';
import type { EarthquakeData } from '@/lib/earthquake';
import type { EarthquakeInfoOutput } from '@/ai/flows/earthquake-info';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Zap, MapPin, ArrowDown, Clock, Lightbulb, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';

function InfoCard({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) {
    return (
        <div className="flex items-center gap-4 rounded-lg bg-secondary/50 p-4">
            <Icon className="h-8 w-8 text-primary" />
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-lg font-bold">{value}</p>
            </div>
        </div>
    );
}

function SkeletonInfoCard() {
    return (
        <div className="flex items-center gap-4 rounded-lg bg-secondary/50 p-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-24" />
            </div>
        </div>
    );
}

export default function EarthquakePage() {
    const [earthquakeData, setEarthquakeData] = useState<EarthquakeData | null>(null);
    const [aiInfo, setAiInfo] = useState<EarthquakeInfoOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const { language, t } = useLanguage();

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const data = await fetchEarthquakeData();
                setEarthquakeData(data);

                const info = await fetchEarthquakeInfo({
                    magnitude: data.magnitude,
                    location: data.location,
                    depth: data.depth,
                    time: data.time
                }, language);

                if(info) {
                    setAiInfo(info);
                } else {
                    toast({
                        variant: "destructive",
                        title: t('errors.ai_error_title'),
                        description: t('errors.ai_error_description', t('nav.earthquake').toLowerCase()),
                    });
                }
            } catch (error) {
                console.error("Failed to load earthquake data", error);
                toast({
                    variant: "destructive",
                    title: t('errors.data_error_title'),
                    description: t('errors.data_error_description', t('nav.earthquake').toLowerCase()),
                });
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [toast, language, t]);

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center gap-3">
                    <Zap className="h-10 w-10" />
                    <span>{t('earthquake.title')}</span>
                </h1>
                <p className="text-muted-foreground mt-2">{t('earthquake.subtitle')}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                           <AlertTriangle className="text-destructive"/> {t('earthquake.latest_event')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {isLoading ? (
                            <>
                                <SkeletonInfoCard />
                                <SkeletonInfoCard />
                                <SkeletonInfoCard />
                                <SkeletonInfoCard />
                            </>
                        ) : earthquakeData && (
                            <>
                                <InfoCard icon={Zap} label={t('earthquake.magnitude')} value={`${earthquakeData.magnitude} SR`} />
                                <InfoCard icon={MapPin} label={t('earthquake.location')} value={earthquakeData.location} />
                                <InfoCard icon={ArrowDown} label={t('earthquake.depth')} value={`${earthquakeData.depth} km`} />
                                <InfoCard icon={Clock} label={t('earthquake.time')} value={earthquakeData.time} />
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                           <Lightbulb className="text-primary"/> {t('earthquake.ai_summary_tips')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-6 w-1/3 mb-2" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                            </div>
                        ) : aiInfo ? (
                            <>
                                <div>
                                    <h3 className="font-semibold mb-2">{t('earthquake.summary')}</h3>
                                    <p className="text-muted-foreground italic border-l-2 border-primary pl-3">{aiInfo.summary}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">{t('earthquake.safety_tips')}</h3>
                                    <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                                        {aiInfo.safety_tips.map((tip, index) => <li key={index}>{tip}</li>)}
                                    </ul>
                                </div>
                            </>
                        ) : (
                             <p className="text-muted-foreground">{t('earthquake.no_ai_info')}</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <footer className="text-center mt-12 text-muted-foreground text-sm">
                <p>{t('earthquake.footer')}</p>
            </footer>
        </div>
    );
}
