'use client';

import { useState, useEffect } from 'react';
import { fetchFloodData, fetchFloodInfo } from '@/app/actions';
import type { FloodData } from '@/lib/flood';
import type { FloodInfoOutput } from '@/ai/flows/flood-info';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Waves, MapPin, Clock, Lightbulb, AlertTriangle, ShieldAlert, Thermometer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';

function InfoCard({ icon: Icon, label, value, status }: { icon: React.ElementType, label: string, value: string | number, status?: string }) {
    const statusColor = 
        status?.includes('Awas') || status?.includes('Siaga 1') ? 'text-destructive' :
        status?.includes('Siaga') || status?.includes('Siaga 2') ? 'text-orange-500' :
        status?.includes('Waspada') || status?.includes('Siaga 3') ? 'text-yellow-500' :
        'text-primary';

    return (
        <div className="flex items-center gap-4 rounded-lg bg-secondary/50 p-4">
            <Icon className={cn("h-8 w-8", label === 'Status' ? statusColor : 'text-primary')} />
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className={cn("text-lg font-bold", label === 'Status' ? statusColor : '')}>{value}</p>
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

export default function FloodPage() {
    const [floodData, setFloodData] = useState<FloodData | null>(null);
    const [aiInfo, setAiInfo] = useState<FloodInfoOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const { language, t } = useLanguage();

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const data = await fetchFloodData();
                setFloodData(data);

                const info = await fetchFloodInfo({
                    location: data.location,
                    waterLevel: data.waterLevel,
                    status: data.status,
                    time: data.time
                }, language);

                if(info) {
                    setAiInfo(info);
                } else {
                    toast({
                        variant: "destructive",
                        title: t('errors.ai_error_title'),
                        description: t('errors.ai_error_description', t('nav.flood').toLowerCase()),
                    });
                }
            } catch (error) {
                console.error("Failed to load flood data", error);
                toast({
                    variant: "destructive",
                    title: t('errors.data_error_title'),
                    description: t('errors.data_error_description', t('nav.flood').toLowerCase()),
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
                    <Waves className="h-10 w-10" />
                    <span>{t('flood.title')}</span>
                </h1>
                <p className="text-muted-foreground mt-2">{t('flood.subtitle')}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                           <AlertTriangle className="text-primary"/> {t('flood.dam_status')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {isLoading ? (
                            <>
                                <SkeletonInfoCard />
                                <SkeletonInfoCard />
                                <SkeletonInfoCard />
                            </>
                        ) : floodData && (
                            <>
                                <InfoCard icon={Thermometer} label={t('flood.water_level')} value={`${floodData.waterLevel} cm`} />
                                <InfoCard icon={ShieldAlert} label={t('flood.status')} value={floodData.status} status={floodData.status} />
                                <InfoCard icon={Clock} label={t('flood.last_update')} value={floodData.time} />
                                <InfoCard icon={MapPin} label={t('flood.location')} value={floodData.location} />
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                           <Lightbulb className="text-primary"/> {t('flood.ai_summary_recommendations')}
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
                                    <h3 className="font-semibold mb-2">{t('flood.summary')}</h3>
                                    <p className="text-muted-foreground italic border-l-2 border-primary pl-3">{aiInfo.summary}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">{t('flood.safety_recommendations')}</h3>
                                    <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                                        {aiInfo.safety_recommendations.map((tip, index) => <li key={index}>{tip}</li>)}
                                    </ul>
                                </div>
                            </>
                        ) : (
                             <p className="text-muted-foreground">{t('flood.no_ai_info')}</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <footer className="text-center mt-12 text-muted-foreground text-sm">
                <p>{t('flood.footer')}</p>
            </footer>
        </div>
    );
}
