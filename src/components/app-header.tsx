'use client';

import { CloudSun, Zap, Menu, Mountain, Flame } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
    { href: '/', label: 'Weather', icon: CloudSun },
    { href: '/earthquake', label: 'Earthquake', icon: Zap },
    { href: '/landslide', label: 'Landslide', icon: Mountain },
    { href: '/fire', label: 'Fire', icon: Flame },
];

export function AppHeader() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <div className="container flex h-14 items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-primary"
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                    <span className="text-xl">Bogor Info Hub</span>
                </Link>

                <div className="hidden md:flex">
                    <NavLinks />
                </div>
                
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
        </header>
    );
}
