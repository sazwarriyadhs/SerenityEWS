'use client';

import { useState, useEffect } from 'react';
import { fetchLandslideData, fetchLandslideInfo } from '@/app/actions';
import type { LandslideData } from '@/lib/landslide';
import type { LandslideInfoOutput } from '@/ai/flows/landslide-info';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDownFromLine, MapPin, Clock, Lightbulb, AlertTriangle, SignalHigh, CloudRain, ClipboardList } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function InfoCard({ icon: Icon, label, value, riskLevel }: { icon: React.ElementType, label: string, value: string | number, riskLevel?: 'High' | 'Moderate' | 'Low' }) {
    const riskColor = riskLevel === 'High' ? 'text-destructive' : riskLevel === 'Moderate' ? 'text-accent' : 'text-primary';
    return (
        <div className="flex items-center gap-4 rounded-lg bg-secondary/50 p-4">
            <Icon className={`h-8 w-8 ${label === 'Risk Level' ? riskColor : 'text-primary'}`} />
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className={`text-lg font-bold ${label === 'Risk Level' ? riskColor : ''}`}>{value}</p>
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
                });

                if(info) {
                    setAiInfo(info);
                } else {
                    toast({
                        variant: "destructive",
                        title: "AI Error",
                        description: "Could not fetch AI-powered landslide information.",
                    });
                }
            } catch (error) {
                console.error("Failed to load landslide data", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load landslide data.",
                });
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [toast]);

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center gap-3">
                    <ArrowDownFromLine className="h-10 w-10" />
                    <span>Landslide Watch</span>
                </h1>
                <p className="text-muted-foreground mt-2">Latest landslide risk information and safety tips for the Bogor area.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                           <AlertTriangle className="text-destructive"/> Current Risk Assessment
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
                                <InfoCard icon={SignalHigh} label="Risk Level" value={landslideData.riskLevel} riskLevel={landslideData.riskLevel} />
                                <InfoCard icon={MapPin} label="Location" value={landslideData.location} />
                                <InfoCard icon={CloudRain} label="Primary Trigger" value={landslideData.trigger} />
                                <InfoCard icon={Clock} label="Assessment Time" value={landslideData.time} />
                                <InfoCard icon={ClipboardList} label="Potential Impact" value={landslideData.potentialImpact} />
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                           <Lightbulb className="text-primary"/> AI Summary & Safety Tips
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
                                    <h3 className="font-semibold mb-2">Summary</h3>
                                    <p className="text-muted-foreground italic border-l-2 border-primary pl-3">{aiInfo.summary}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Safety Recommendations</h3>
                                    <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                                        {aiInfo.safety_recommendations.map((tip, index) => <li key={index}>{tip}</li>)}
                                    </ul>
                                </div>
                            </>
                        ) : (
                             <p className="text-muted-foreground">No AI information available.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <footer className="text-center mt-12 text-muted-foreground text-sm">
                <p>Data bersumber dari gis.bnpb.go.id (untuk tujuan demonstrasi). Didukung oleh AI.</p>
            </footer>
        </div>
    );
}
