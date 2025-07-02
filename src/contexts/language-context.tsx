'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getCookie, setCookie } from '@/lib/utils';

type Language = 'en' | 'id';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string, ...args: any[]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('id'); // Default to Indonesian
    const [translations, setTranslations] = useState<Record<string, any>>({});

    useEffect(() => {
        const savedLanguage = getCookie('app-language') as Language;
        const initialLanguage = savedLanguage || 'id'; // Default to Indonesian
        setLanguage(initialLanguage);
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        setCookie('app-language', lang, 365);
        if (typeof document !== 'undefined') {
            document.documentElement.lang = lang;
        }
        const translationModule = lang === 'id' ? import('@/locales/id.json') : import('@/locales/en.json');
        
        translationModule
            .then(module => setTranslations(module.default))
            .catch(err => console.error(`Could not load ${lang}.json`, err));
    }, []);
    
    useEffect(() => {
        // Load default language on initial render
        if (Object.keys(translations).length === 0) {
            setLanguage(language);
        }
    }, [language, translations, setLanguage]);

    const t = useCallback((key: string, ...args: any[]): string => {
        const keys = key.split('.');
        let result: any = translations;
        for (const k of keys) {
            if (result && typeof result === 'object' && k in result) {
                result = result[k];
            } else {
                return key; // Return the key if translation is not found
            }
        }
        if (typeof result === 'string') {
            return result.replace(/{(\d+)}/g, (match, number) => {
                return typeof args[number] !== 'undefined' ? args[number] : match;
            });
        }
        return key;
    }, [translations]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
