'use client';

import { useState, useEffect } from 'react';
import { fetchReports } from '@/app/actions';
import type { UserReport } from '@/lib/reports';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AddReportDialog } from '@/components/add-report-dialog';
import { Megaphone, MapPin, Tag, MessageSquare, Clock, Waves, Flame, Siren, Car, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { id, enUS } from 'date-fns/locale';

function ReportCard({ report, locale }: { report: UserReport, locale: Locale }) {
    const { t } = useLanguage();

    const getIcon = (category: string) => {
        const cat = category.toLowerCase();
        if (cat.includes('banjir') || cat.includes('flood')) return <Waves className="h-5 w-5 text-primary" />;
        if (cat.includes('kebakaran') || cat.includes('fire')) return <Flame className="h-5 w-5 text-destructive" />;
        if (cat.includes('pohon') || cat.includes('tree')) return <Siren className="h-5 w-5 text-yellow-500" />;
        if (cat.includes('lalu lintas') || cat.includes('traffic')) return <Car className="h-5 w-5 text-orange-500" />;
        if (cat.includes('jalan rusak') || cat.includes('road damage')) return <AlertTriangle className="h-5 w-5 text-accent" />;
        return <Tag className="h-5 w-5 text-muted-foreground" />;
    };

    const timeAgo = formatDistanceToNow(new Date(report.timestamp), { addSuffix: true, locale });

    return (
        <Card className="overflow-hidden flex flex-col">
            <div className="aspect-video relative">
                <Image
                    src={report.photoDataUri || report.photoUrl || 'https://placehold.co/600x400.png'}
                    alt={report.description}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="bg-secondary object-cover"
                    data-ai-hint={report.photoHint}
                />
            </div>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    {getIcon(report.category)}
                    {report.category}
                </CardTitle>
                <CardDescription>{t('community.user_report_from', report.user)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
                 <div>
                    <h4 className="font-semibold text-sm mb-1 flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> {t('community.description')}</h4>
                    <p className="text-muted-foreground text-sm">{report.description}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-sm mb-1 flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /> {t('community.summary')}</h4>
                    <p className="text-muted-foreground text-sm italic">"{report.summary}"</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between text-xs text-muted-foreground bg-secondary/50 py-2 px-4 mt-auto">
                 <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" />
                    <span>{report.location ? `${report.location.latitude.toFixed(4)}, ${report.location.longitude.toFixed(4)}` : t('community.location_unavailable')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    <span>{timeAgo}</span>
                </div>
            </CardFooter>
        </Card>
    );
}


export default function CommunityReportsPage() {
    const [reports, setReports] = useState<UserReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { t, language } = useLanguage();

    useEffect(() => {
        async function loadReports() {
            setIsLoading(true);
            const data = await fetchReports();
            setReports(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
            setIsLoading(false);
        }
        loadReports();
    }, []);
    
    const handleReportSubmitted = (newReport: UserReport) => {
        // Add new report to the top of the list for immediate feedback
        // The report is also persisted in the server's memory via the action
        setReports(prev => [newReport, ...prev]);
    };

    const dateLocale = language === 'id' ? id : enUS;

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center gap-3">
                        <Megaphone className="h-10 w-10" />
                        <span>{t('community.title')}</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">{t('community.subtitle')}</p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)}>{t('community.add_report')}</Button>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
                </div>
            ) : reports.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map(report => <ReportCard key={report.id} report={report} locale={dateLocale} />)}
                </div>
            ) : (
                <div className="text-center py-16 text-muted-foreground">
                    <p>{t('community.no_reports')}</p>
                </div>
            )}
            
            <AddReportDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onReportSubmitted={handleReportSubmitted} />
        </div>
    );
}
