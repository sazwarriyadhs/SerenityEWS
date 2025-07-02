'use client';

import { useState, useEffect } from 'react';
import { fetchWhirlwindData, fetchWhirlwindInfo } from '@/app/actions';
import type { WhirlwindData } from '@/lib/whirlwind';
import type { WhirlwindInfoOutput } from '@/ai/flows/whirlwind-info';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tornado, MapPin, Clock, Lightbulb, AlertTriangle, Wind, Gauge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function InfoCard({ icon: Icon, label, value, category }: { icon: React.ElementType, label: string, value: string | number, category?: string }) {
    const categoryColor = category ? 'text-destructive' : 'text-primary';
    return (
        <div className="flex items-center gap-4 rounded-lg bg-secondary/50 p-4">
            <Icon className={`h-8 w-8 ${label === 'Category' ? categoryColor : 'text-primary'}`} />
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className={`text-lg font-bold ${label === 'Category' ? categoryColor : ''}`}>{value}</p>
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

export default function WhirlwindPage() {
    const [whirlwindData, setWhirlwindData] = useState<WhirlwindData | null>(null);
    const [aiInfo, setAiInfo] = useState<WhirlwindInfoOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const data = await fetchWhirlwindData();
                setWhirlwindData(data);

                const info = await fetchWhirlwindInfo({
                    location: data.location,
                    category: data.category,
                    windSpeed: data.windSpeed,
                    time: data.time,
                    potentialThreat: data.potentialThreat
                });

                if(info) {
                    setAiInfo(info);
                } else {
                    toast({
                        variant: "destructive",
                        title: "AI Error",
                        description: "Could not fetch AI-powered whirlwind information.",
                    });
                }
            } catch (error) {
                console.error("Failed to load whirlwind data", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load whirlwind data.",
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
                    <Tornado className="h-10 w-10" />
                    <span>Whirlwind & Typhoon Watch</span>
                </h1>
                <p className="text-muted-foreground mt-2">Latest storm information and safety alerts for the Bogor area.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                           <AlertTriangle className="text-destructive"/> Storm Details
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
                        ) : whirlwindData && (
                            <>
                                <InfoCard icon={Gauge} label="Category" value={whirlwindData.category} category={whirlwindData.category} />
                                <InfoCard icon={MapPin} label="Location" value={whirlwindData.location} />
                                <InfoCard icon={Wind} label="Wind Speed" value={`${whirlwindData.windSpeed} km/h`} />
                                <InfoCard icon={Clock} label="Last Update" value={whirlwindData.time} />
                                <InfoCard icon={AlertTriangle} label="Potential Threat" value={whirlwindData.potentialThreat} />
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                           <Lightbulb className="text-primary"/> AI Summary & Safety Alerts
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
