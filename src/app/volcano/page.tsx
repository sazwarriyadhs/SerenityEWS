'use client';

import { useState, useEffect } from 'react';
import { fetchVolcanoData, fetchVolcanoInfo } from '@/app/actions';
import type { VolcanoData } from '@/lib/volcano';
import type { VolcanoInfoOutput } from '@/ai/flows/volcano-info';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Mountain, Clock, Lightbulb, AlertTriangle, ShieldAlert, ListChecks } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';

function InfoCard({ icon: Icon, label, value, status }: { icon: React.ElementType, label: string, value: string | number, status?: string }) {
    const statusColor = 
        status?.includes('Awas') ? 'text-destructive' :
        status?.includes('Siaga') ? 'text-orange-500' :
        status?.includes('Waspada') ? 'text-yellow-500' :
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

export default function VolcanoPage() {
    const [volcanoData, setVolcanoData] = useState<VolcanoData | null>(null);
    const [aiInfo, setAiInfo] = useState<VolcanoInfoOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const { language, t } = useLanguage();

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const data = await fetchVolcanoData();
                setVolcanoData(data);

                const info = await fetchVolcanoInfo({
                    name: data.name,
                    status: data.status,
                    lastEruption: data.lastEruption,
                    recommendations: data.recommendations
                }, language);

                if(info) {
                    setAiInfo(info);
                } else {
                    toast({
                        variant: "destructive",
                        title: t('errors.ai_error_title'),
                        description: t('errors.ai_error_description', t('nav.volcano').toLowerCase()),
                    });
                }
            } catch (error) {
                console.error("Failed to load volcano data", error);
                toast({
                    variant: "destructive",
                    title: t('errors.data_error_title'),
                    description: t('errors.data_error_description', t('nav.volcano').toLowerCase()),
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
                    <Mountain className="h-10 w-10" />
                    <span>{t('volcano.title')}</span>
                </h1>
                <p className="text-muted-foreground mt-2">{t('volcano.subtitle')}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                           <AlertTriangle className="text-destructive"/> {t('volcano.current_status', isLoading ? '' : volcanoData?.name || '')} {isLoading && <Skeleton className="h-8 w-48" />}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {isLoading ? (
                            <>
                                <SkeletonInfoCard />
                                <SkeletonInfoCard />
                                <SkeletonInfoCard />
                            </>
                        ) : volcanoData && (
                            <>
                                <InfoCard icon={ShieldAlert} label={t('volcano.status')} value={volcanoData.status} status={volcanoData.status} />
                                <InfoCard icon={Mountain} label={t('volcano.volcano')} value={volcanoData.name} />
                                <InfoCard icon={Clock} label={t('volcano.latest_update')} value={volcanoData.lastEruption} />
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-1">
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2 text-xl">
                            <ListChecks className="text-primary"/> {t('volcano.official_recommendations')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         {isLoading ? (
                             <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        ) : volcanoData ? (
                            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                                {volcanoData.recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
                            </ul>
                        ) : (
                             <p className="text-muted-foreground">{t('volcano.no_recommendations')}</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                           <Lightbulb className="text-primary"/> {t('volcano.ai_summary_precautions')}
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
                                    <h3 className="font-semibold mb-2">{t('volcano.summary')}</h3>
                                    <p className="text-muted-foreground italic border-l-2 border-primary pl-3">{aiInfo.summary}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">{t('volcano.safety_precautions')}</h3>
                                    <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                                        {aiInfo.safety_precautions.map((tip, index) => <li key={index}>{tip}</li>)}
                                    </ul>
                                </div>
                            </>
                        ) : (
                             <p className="text-muted-foreground">{t('volcano.no_ai_info')}</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <footer className="text-center mt-12 text-muted-foreground text-sm">
                <p>{t('volcano.footer')}</p>
            </footer>
        </div>
    );
}
