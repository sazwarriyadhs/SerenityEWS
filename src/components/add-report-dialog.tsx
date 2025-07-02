'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/hooks/use-toast';
import { Camera, MapPin, Send, Loader2, RefreshCw } from 'lucide-react';
import { submitReport } from '@/app/actions';
import type { UserReport } from '@/lib/reports';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface AddReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReportSubmitted: (report: UserReport) => void;
}

type GpsLocation = {
  latitude: number;
  longitude: number;
};

export function AddReportDialog({ open, onOpenChange, onReportSubmitted }: AddReportDialogProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [description, setDescription] = useState('');
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [location, setLocation] = useState<GpsLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function getCameraAndLocation() {
      // Get Location
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
            setLocationError(t('community.location_unavailable'));
          }
        );
      } else {
        setLocationError(t('community.location_unavailable'));
      }

      // Get Camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: t('community.camera_permission_denied_title'),
          description: t('community.camera_permission_denied_description'),
        });
      }
    }

    if (open) {
      getCameraAndLocation();
    } else {
      // Cleanup when dialog closes
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    }
  }, [open, t, toast]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        setPhotoDataUri(dataUri);
      }
    }
  };

    const handleClose = (isOpen: boolean) => {
        if (!isOpen) {
            // Reset state when dialog closes
            setPhotoDataUri(null);
            setDescription('');
            setLocation(null);
            setLocationError(null);
            setHasCameraPermission(null);
        }
        onOpenChange(isOpen);
    };

  const handleSubmit = () => {
    if (!photoDataUri || !description || !location) {
        toast({ variant: 'destructive', title: t('community.error_title'), description: t('community.photo_required') });
        return;
    }

    startTransition(async () => {
      const result = await submitReport({ photoDataUri, description, location }, language);
      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: t('community.error_title'),
          description: t('community.error_description'),
        });
      } else {
        toast({
          title: t('community.success_title'),
          description: t('community.success_description'),
        });
        onReportSubmitted(result);
        handleClose(false);
      }
    });
  };

  const isSubmittable = photoDataUri && description.length >= 10 && location && !isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Camera /> {t('community.add_report')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-secondary">
            {photoDataUri ? (
              <img src={photoDataUri} alt="Captured report" className="h-full w-full object-cover" />
            ) : (
                <>
                    <video ref={videoRef} className="h-full w-full object-cover scale-x-[-1]" autoPlay muted playsInline />
                    {hasCameraPermission === false && (
                         <div className="absolute inset-0 flex items-center justify-center p-4">
                            <Alert variant="destructive">
                              <AlertTitle>{t('community.camera_access_required_title')}</AlertTitle>
                              <AlertDescription>{t('community.camera_access_required_description')}</AlertDescription>
                            </Alert>
                        </div>
                    )}
                </>
            )}
             <canvas ref={canvasRef} className="hidden" />
          </div>

           <div className="flex justify-center">
            {photoDataUri ? (
                <Button variant="outline" onClick={() => setPhotoDataUri(null)}><RefreshCw className="mr-2 h-4 w-4" />{t('community.retake_photo')}</Button>
            ) : (
                <Button onClick={handleCapture} disabled={hasCameraPermission !== true}><Camera className="mr-2 h-4 w-4" />{t('community.capture_photo')}</Button>
            )}
          </div>

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('community.report_description_placeholder')}
            className="min-h-[100px]"
            disabled={isPending}
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-secondary/50 rounded-md">
            <MapPin className="h-4 w-4 text-primary" />
            <span>
              {location
                ? `${t('community.location')}: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                : locationError || t('community.getting_location')}
            </span>
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                 <Button variant="ghost" disabled={isPending}>{t('community.cancel')}</Button>
            </DialogClose>
          <Button onClick={handleSubmit} disabled={!isSubmittable}>
            {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
            {isPending ? t('community.submitting') : t('community.submit_report')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
