'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DisasterTrendAnalysisOutput } from '@/ai/flows/disaster-trend-analysis';
import { useLanguage } from '@/contexts/language-context';
import { Bot, LineChart, Target, Zap } from 'lucide-react';

interface TrendAnalysisCardProps {
    analysis: DisasterTrendAnalysisOutput | null;
    isLoading: boolean;
}

export function TrendAnalysisCard({ analysis, isLoading }: TrendAnalysisCardProps) {
    const { t } = useLanguage();
    
    const renderSkeleton = () => (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-16 w-full" />
            </div>
             <div className="space-y-2">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
            </div>
             <div className="space-y-2">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    );
    
    const renderContent = () => {
        if (!analysis) {
            return <p className="text-muted-foreground">{t('disaster_report.no_analysis')}</p>;
        }
        
        return (
            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                        <LineChart className="h-5 w-5" />
                        {t('disaster_report.trend_summary')}
                    </h3>
                    <p className="text-muted-foreground italic border-l-2 border-primary pl-3">{analysis.trendSummary}</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                        <Target className="h-5 w-5" />
                         {t('disaster_report.key_observations')}
                    </h3>
                    <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                        {analysis.keyObservations.map((obs, index) => <li key={index}>{obs}</li>)}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                        <Zap className="h-5 w-5" />
                        {t('disaster_report.future_outlook')}
                    </h3>
                    <p className="text-muted-foreground">{analysis.futureOutlook}</p>
                </div>
            </div>
        )
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot className="text-primary"/> {t('disaster_report.ai_analysis_title')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? renderSkeleton() : renderContent()}
            </CardContent>
        </Card>
    );
}
