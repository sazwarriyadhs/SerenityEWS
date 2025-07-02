'use client';

import Image from 'next/image';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[101] flex h-screen w-screen items-center justify-center bg-background">
      <div className="animate-splash-pulse">
        <Image
          src="/images/logo.png"
          alt="Serenity EWS Bogor Logo"
          width={150}
          height={150}
          priority
        />
      </div>
    </div>
  );
}
