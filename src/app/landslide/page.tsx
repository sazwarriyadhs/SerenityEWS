'use client';

import { useState, useEffect } from 'react';
import { fetchLandslideData, fetchLandslideInfo } from '@/app/actions';
import type { LandslideData } from '@/lib/landslide';
import type { LandslideInfoOutput } from '@/ai/flows/landslide-info';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDownFromLine, MapPin, Clock, Lightbulb, AlertTriangle, SignalHigh, CloudRain, ClipboardList } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';

function InfoCard({ icon: Icon, label, value, riskLevel }: { icon: React.ElementType, label: string, value: string | number, riskLevel?: 'High' | 'Moderate' | 'Low' | 'Tinggi' | 'Sedang' | 'Rendah' }) {
    const isHigh = riskLevel === 'High' || riskLevel === 'Tinggi';
    const isModerate = riskLevel === 'Moderate' || riskLevel === 'Sedang';
    const riskColor = isHigh ? 'text-destructive' : isModerate ? 'text-accent' : 'text-primary';
    return (
        <div className="flex items-center gap-4 rounded-lg bg-secondary/50 p-4">
            <Icon className={`h-8 w-8 ${label === 'Risk Level' || label === 'Tingkat Risiko' ? riskColor : 'text-primary'}`} />
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className={`text-lg font-bold ${label === 'Risk Level' || label === 'Tingkat Risiko' ? riskColor : ''}`}>{value}</p>
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

export default function LandslidePage() {
    const [landslideData, setLandslideData] = useState<LandslideData | null>(null);
    const [aiInfo, setAiInfo] = useState<LandslideInfoOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const { language, t } = useLanguage();

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const data = await fetchLandslideData();
                setLandslideData(data);

                const info = await fetchLandslideInfo({
                    location: data.location,
                    riskLevel: data.riskLevel,
                    trigger: data.trigger,
                    time: data.time,
                    potentialImpact: data.potentialImpact
                }, language);

                if(info) {
                    setAiInfo(info);
                } else {
                    toast({
                        variant: "destructive",
                        title: t('errors.ai_error_title'),
                        description: t('errors.ai_error_description', t('nav.landslide').toLowerCase()),
                    });
                }
            } catch (error) {
                console.error("Failed to load landslide data", error);
                toast({
                    variant: "destructive",
                    title: t('errors.data_error_title'),
                    description: t('errors.data_error_description', t('nav.landslide').toLowerCase()),
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
                    <ArrowDownFromLine className="h-10 w-10" />
                    <span>{t('landslide.title')}</span>
                </h1>
                <p className="text-muted-foreground mt-2">{t('landslide.subtitle')}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                           <AlertTriangle className="text-destructive"/> {t('landslide.current_risk')}
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
                        ) : landslideData && (
                            <>
                                <InfoCard icon={SignalHigh} label={t('landslide.risk_level')} value={landslideData.riskLevel} riskLevel={landslideData.riskLevel} />
                                <InfoCard icon={MapPin} label={t('landslide.location')} value={landslideData.location} />
                                <InfoCard icon={CloudRain} label={t('landslide.trigger')} value={landslideData.trigger} />
                                <InfoCard icon={Clock} label={t('landslide.assessment_time')} value={landslideData.time} />
                                <InfoCard icon={ClipboardList} label={t('landslide.potential_impact')} value={landslideData.potentialImpact} />
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                           <Lightbulb className="text-primary"/> {t('landslide.ai_summary_tips')}
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
                                    <h3 className="font-semibold mb-2">{t('landslide.summary')}</h3>
                                    <p className="text-muted-foreground italic border-l-2 border-primary pl-3">{aiInfo.summary}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">{t('landslide.safety_recommendations')}</h3>
                                    <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                                        {aiInfo.safety_recommendations.map((tip, index) => <li key={index}>{tip}</li>)}
                                    </ul>
                                </div>
                            </>
                        ) : (
                             <p className="text-muted-foreground">{t('landslide.no_ai_info')}</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <footer className="text-center mt-12 text-muted-foreground text-sm">
                <p>{t('landslide.footer')}</p>
            </footer>
        </div>
    );
}
