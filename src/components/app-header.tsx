'use client';

import { CloudSun, Zap, Menu, Mountain, Flame, Tornado, ArrowDownFromLine, Waves, Megaphone, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
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
        { href: '/disaster-report', label: t('nav.disaster_report'), icon: BarChart3 },
        { href: '/community-reports', label: t('nav.community'), icon: Megaphone },
        { href: '/earthquake', label: t('nav.earthquake'), icon: Zap },
        { href: '/landslide', label: t('nav.landslide'), icon: ArrowDownFromLine },
        { href: '/flood', label: t('nav.flood'), icon: Waves },
        { href: '/fire', label: t('nav.fire'), icon: Flame },
        { href: '/whirlwind', label: t('nav.whirlwind'), icon: Tornado },
        { href: '/volcano', label: t('nav.volcano'), icon: Mountain },
    ];

    const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
        <nav className={cn("flex items-center gap-1", isMobile && "flex-col items-start gap-4 p-4")}>
            {navItems.map((item) => (
                <Link href={item.href} key={item.href} passHref>
                    <Button
                        variant={pathname === item.href ? 'default' : 'ghost'}
                        className={cn("w-full justify-start text-xs px-3", !isMobile && "rounded-full")}
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
                        <Image
                            src="/images/logo.png"
                            alt="Serenity EWS Bogor Logo"
                            width={150}
                            height={150}
                            className="h-16 w-16"
                        />
                        <div className="hidden sm:block">
                            <span className="text-xl font-bold text-primary">{t('header.title')}</span>
                            <p className="text-xs text-muted-foreground font-semibold tracking-wider uppercase">{t('header.subtitle')}</p>
                        </div>
                    </Link>
                </div>

                <div className="hidden lg:flex flex-1 justify-center">
                    <NavLinks />
                </div>
                
                <div className="flex flex-1 justify-end items-center">
                     <LanguageSwitcher />
                    <div className="lg:hidden">
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                               <SheetHeader>
                                 <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                               </SheetHeader>
                               <NavLinks isMobile />
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
