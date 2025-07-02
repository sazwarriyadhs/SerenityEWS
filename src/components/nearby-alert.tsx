'use client';

import { useState, useEffect, useTransition } from 'react';
import { fetchNearbyAlert } from '@/app/actions';
import type { NearbyAlertOutput } from '@/ai/flows/nearby-alert-flow';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Siren, ShieldCheck, MapPin, Loader2, ListChecks, CloudSun } from 'lucide-react';
import Link from 'next/link';

type GpsLocation = {
  latitude: number;
  longitude: number;
};

export default function NearbyAlert() {
  const [location, setLocation] = useState<GpsLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [alertInfo, setAlertInfo] = useState<NearbyAlertOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { language, t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
        },
        () => {
          setLocationError(t('nearby_alert.permission_denied_title'));
          toast({
            variant: 'destructive',
            title: t('nearby_alert.permission_denied_title'),
            description: t('nearby_alert.permission_denied_description'),
          });
        }
      );
    } else {
      setLocationError(t('nearby_alert.permission_denied_title'));
    }
  }, [t, toast]);

  useEffect(() => {
    if (location) {
      startTransition(async () => {
        const result = await fetchNearbyAlert(location, language);
        if (result) {
          setAlertInfo(result);
        } else {
          toast({
            variant: "destructive",
            title: t('errors.ai_error_title'),
            description: t('errors.ai_error_description', 'nearby alerts'),
          });
        }
      });
    }
  }, [location, language, t, toast]);

  const renderContent = () => {
    if (isPending || !alertInfo) {
      return (
        <CardContent className="flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-semibold text-muted-foreground">{location ? t('nearby_alert.analyzing') : t('nearby_alert.requesting_location')}</p>
        </CardContent>
      );
    }

    if (locationError) {
        return (
             <CardContent className="flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
                <Siren className="h-12 w-12 text-destructive mb-4" />
                <p className="text-lg font-semibold">{t('nearby_alert.permission_denied_title')}</p>
                <p className="text-muted-foreground">{t('nearby_alert.permission_denied_description')}</p>
            </CardContent>
        );
    }

    if (alertInfo.isAtRisk) {
      return (
        <Alert variant="destructive" className="border-2">
          <Siren className="h-5 w-5" />
          <AlertTitle className="text-xl font-bold">{alertInfo.alertTitle}</AlertTitle>
          <AlertDescription className="space-y-4 mt-2">
            <p className="text-base">{alertInfo.alertMessage}</p>
            <div>
              <h4 className="font-semibold text-destructive-foreground mb-2 flex items-center gap-2">
                <ListChecks />
                {t('nearby_alert.safety_first_recommendations')}
              </h4>
              <ul className="list-disc list-inside space-y-1 pl-2">
                {alertInfo.safetyRecommendations.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <CardContent className="flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
        <ShieldCheck className="h-16 w-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold text-primary">{t('nearby_alert.safe_title')}</h2>
        <p className="mt-2 max-w-prose text-muted-foreground">{t('nearby_alert.safe_message')}</p>
      </CardContent>
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-3">
          <MapPin className="h-10 w-10" />
          <span>{t('nearby_alert.title')}</span>
        </h1>
        <p className="text-muted-foreground mt-2">{t('nearby_alert.subtitle')}</p>
      </header>

      <div className="max-w-4xl mx-auto">
        {renderContent()}
      </div>
       <div className="text-center mt-8">
          <Button asChild variant="outline">
              <Link href="/weather">
                  <CloudSun className="mr-2 h-4 w-4" />
                  {t('nearby_alert.view_weather')}
              </Link>
          </Button>
      </div>
    </div>
  );
}
