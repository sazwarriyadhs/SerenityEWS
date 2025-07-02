'use client';

import { CloudSun, Zap, Menu, Mountain, Flame, Tornado, ArrowDownFromLine, Waves, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { LanguageSwitcher } from './language-switcher';

export function AppHeader() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { t } = useLanguage();

    const navItems = [
        { href: '/weather', label: t('nav.weather'), icon: CloudSun },
        { href: '/earthquake', label: t('nav.earthquake'), icon: Zap },
        { href: '/landslide', label: t('nav.landslide'), icon: ArrowDownFromLine },
        { href: '/flood', label: t('nav.flood'), icon: Waves },
        { href: '/fire', label: t('nav.fire'), icon: Flame },
        { href: '/whirlwind', label: t('nav.whirlwind'), icon: Tornado },
        { href: '/volcano', label: t('nav.volcano'), icon: Mountain },
        { href: '/community-reports', label: t('nav.community'), icon: Megaphone },
    ];

    const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
        <nav className={cn("flex items-center gap-2", isMobile && "flex-col items-start gap-4 p-4")}>
            {navItems.map((item) => (
                <Link href={item.href} key={item.href} passHref>
                    <Button
                        variant={pathname === item.href ? 'default' : 'ghost'}
                        className={cn("w-full justify-start", !isMobile && "rounded-full")}
                        onClick={() => isMobile && setMobileMenuOpen(false)}
                    >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                    </Button>
                </Link>
            ))}
        </nav>
    );

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-20 items-center">
                <div className="flex items-center flex-1">
                    <Link href="/" className="flex items-center gap-3 font-bold">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 100 110"
                          className="h-14 w-14"
                          fill="none"
                        >
                          <path
                            fill="#1A4D2E"
                            d="M50 0L9.38 12.5v68.75c0 4.14 2.1 7.98 5.43 10.15l35.19 22.45a12.5 12.5 0 0010 0l35.19-22.45c3.32-2.17 5.43-6.01 5.43-10.15V12.5L50 0z"
                          />
                          <path fill="#F5EFE6" d="M85 80.5V17L50 5 15 17v63.5c0 2.76 1.4 5.32 3.62 6.77L48.8 103.4a8.33 8.33 0 006.66 0l30.18-16.13c2.22-1.45 3.62-4.01 3.62-6.77z"/>
                          <path
                            fill="#001C30"
                            d="M29.69 35.83c-1.3-.92-3-1.07-4.47-.4a4.17 4.17 0 00-2.88 3.93v.83c.9-2.9 3.73-4.94 6.9-4.83a5.03 5.03 0 014.28 2.05l-3.83-1.58z"
                          />
                          <path
                            fill="#001C30"
                            d="M62.5 30a12.5 12.5 0 00-25 0h-4.17c0-9.2 7.46-16.67 16.67-16.67S66.67 20.8 66.67 30H62.5z"
                          />
                          <path fill="#001C30" d="M37.5 45.42c-1.72 0-3.13-1.4-3.13-3.13s1.4-3.12 3.13-3.12 3.12 1.4 3.12 3.12-1.4 3.13-3.12 3.13zM29.17 52.08c-1.72 0-3.13-1.4-3.13-3.13s1.4-3.12 3.13-3.12 3.12 1.4 3.12 3.12-1.4 3.13-3.12 3.13zM45.83 52.08c-1.72 0-3.13-1.4-3.13-3.13s1.4-3.12 3.13-3.12 3.12 1.4 3.12 3.12-1.4 3.13-3.12 3.13z"/>
                          <path
                            fill="#F08A4B"
                            d="M60.42 52.08a18.75 18.75 0 00-18.75-18.75h-2.08v4.17h2.08a14.58 14.58 0 0114.58 14.58v2.09h4.17v-2.09zM60.42 41.67a8.33 8.33 0 00-8.33-8.34h-2.09v4.17h2.09a4.17 4.17 0 014.17 4.17v2.08h4.16v-2.08z"
                          />
                          <path
                            fill="#1A4D2E"
                            d="M75.24 67.24L50 85.5 24.76 67.24a2.5 2.5 0 01-.24-3.7l10.9-12.7c1.03-1.2 2.8-1.3 3.93-.24l9.8 9.32 21.3-25.75c1.08-1.2 2.87-1.2 3.95 0l9.8 11.83a2.5 2.5 0 01-.25 3.54z"
                          />
                          <path fill="#FFFFFF" d="M62.58 39.46l-12.5 15-8.33-4.17-14.17 17.5h50l-15-28.33z" />
                          <path
                            fill="#4F6F52"
                            d="M45.42 64.17A20.83 20.83 0 0024.6 85h2.09c10.6 0 19.6-8.02 20.65-18.4l-1.92-2.43z"
                          />
                          <path
                            fill="#1A4D2E"
                            d="M47.5 95.83a25 25 0 01-22.7-15h-4.17c.53 13.9 12.23 25 26.87 25a24.91 24.91 0 0016.3-5.97l-6.3-9.03z"
                          />
                        </svg>
                        <div className="hidden sm:block">
                            <span className="text-xl font-bold text-primary">{t('header.title')}</span>
                            <p className="text-xs text-muted-foreground font-semibold tracking-wider uppercase">{t('header.subtitle')}</p>
                        </div>
                    </Link>
                </div>

                <div className="hidden md:flex flex-1 justify-center">
                    <NavLinks />
                </div>
                
                <div className="flex flex-1 justify-end items-center">
                     <LanguageSwitcher />
                    <div className="md:hidden">
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                               <NavLinks isMobile />
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
