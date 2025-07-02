'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { WeatherRecommendationsOutput } from "@/ai/flows/weather-recommendations";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Lightbulb, Shirt, Activity } from 'lucide-react';

interface AiRecommendationsProps {
    recommendations: WeatherRecommendationsOutput | null | undefined;
    isLoading: boolean;
}

const RecommendationSkeleton = () => (
    <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border-b">
                <div className="flex justify-between items-center py-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-4" />
                </div>
            </div>
        ))}
    </div>
);

export default function AiRecommendations({ recommendations, isLoading }: AiRecommendationsProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-primary" />
                    <CardTitle className="text-2xl text-primary font-bold">AI Recommendations</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? <RecommendationSkeleton /> :
                    !recommendations || recommendations.recommendations.length === 0 ? (
                        <p className="text-muted-foreground">No recommendations available at the moment.</p>
                    ) : (
                        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                            {recommendations.recommendations.map((rec, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger className="font-semibold text-lg hover:no-underline">
                                        Recommendation for Day {index + 1}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-4 p-2">
                                            <div className="flex items-start gap-4">
                                                <Activity className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold text-foreground">Activity</h4>
                                                    <p className="text-muted-foreground">{rec.activity}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <Shirt className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold text-foreground">Clothing</h4>
                                                    <p className="text-muted-foreground">{rec.clothing}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground mb-1">Justification</h4>
                                                <p className="text-sm text-muted-foreground italic border-l-2 border-accent pl-3">{rec.justification}</p>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )
                }
            </CardContent>
        </Card>
    );
}
