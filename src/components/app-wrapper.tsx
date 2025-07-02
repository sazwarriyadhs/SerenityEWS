'use client';

import { useState, useEffect, ReactNode } from 'react';
import { SplashScreen } from './splash-screen';

export function AppWrapper({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <SplashScreen /> : <>{children}</>;
}
