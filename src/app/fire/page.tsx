'use client';

import { useState, useEffect } from 'react';
import { fetchFireData, fetchFireInfo } from '@/app/actions';
import type { FireData } from '@/lib/fire';
import type { FireInfoOutput } from '@/ai/flows/fire-info';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Flame, MapPin, Clock, Lightbulb, AlertTriangle, ShieldAlert, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';

function InfoCard({ icon: Icon, label, value, status }: { icon: React.ElementType, label: string, value: string | number, status?: 'Active' | 'Contained' | 'Under Control' | 'Terkendali' }) {
    const isActive = status === 'Active';
    const isUnderControl = status === 'Under Control' || status === 'Terkendali';
    const statusColor = isActive ? 'text-destructive' : isUnderControl ? 'text-accent' : 'text-primary';
    
    return (
        <div className="flex items-center gap-4 rounded-lg bg-secondary/50 p-4">
            <Icon className={`h-8 w-8 ${label === 'Status' ? statusColor : 'text-primary'}`} />
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className={`text-lg font-bold ${label === 'Status' ? statusColor : ''}`}>{value}</p>
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

export default function FirePage() {
    const [fireData, setFireData] = useState<FireData | null>(null);
    const [aiInfo, setAiInfo] = useState<FireInfoOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const { language, t } = useLanguage();

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const data = await fetchFireData();
                setFireData(data);

                const info = await fetchFireInfo({
                    location: data.location,
                    status: data.status,
                    type: data.type,
                    time: data.time,
                    cause: data.cause
                }, language);

                if(info) {
                    setAiInfo(info);
                } else {
                    toast({
                        variant: "destructive",
                        title: t('errors.ai_error_title'),
                        description: t('errors.ai_error_description', t('nav.fire').toLowerCase()),
                    });
                }
            } catch (error) {
                console.error("Failed to load fire data", error);
                toast({
                    variant: "destructive",
                    title: t('errors.data_error_title'),
                    description: t('errors.data_error_description', t('nav.fire').toLowerCase()),
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
                    <Flame className="h-10 w-10" />
                    <span>{t('fire.title')}</span>
                </h1>
                <p className="text-muted-foreground mt-2">{t('fire.subtitle')}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                           <AlertTriangle className="text-destructive"/> {t('fire.incident_details')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {isLoading ? (
                            <>
                                <SkeletonInfoCard />
                                <SkeletonInfoCard />
                                <SkeletonInfoCard />
                                <SkeletonInfoCard />
                                <SkeletonInfoCard />
                            </>
                        ) : fireData && (
                            <>
                                <InfoCard icon={ShieldAlert} label={t('fire.status')} value={fireData.status} status={fireData.status} />
                                <InfoCard icon={MapPin} label={t('fire.location')} value={fireData.location} />
                                <InfoCard icon={Flame} label={t('fire.type')} value={fireData.type} />
                                <InfoCard icon={Clock} label={t('fire.report_time')} value={fireData.time} />
                                <InfoCard icon={Zap} label={t('fire.cause')} value={fireData.cause} />
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                           <Lightbulb className="text-primary"/> {t('fire.ai_summary_alerts')}
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
                                    <h3 className="font-semibold mb-2">{t('fire.summary')}</h3>
                                    <p className="text-muted-foreground italic border-l-2 border-primary pl-3">{aiInfo.summary}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">{t('fire.safety_recommendations')}</h3>
                                    <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                                        {aiInfo.safety_recommendations.map((tip, index) => <li key={index}>{tip}</li>)}
                                    </ul>
                                </div>
                            </>
                        ) : (
                             <p className="text-muted-foreground">{t('fire.no_ai_info')}</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <footer className="text-center mt-12 text-muted-foreground text-sm">
                <p>{t('fire.footer')}</p>
            </footer>
        </div>
    );
}
