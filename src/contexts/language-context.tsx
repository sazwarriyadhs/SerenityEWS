'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Language = 'en' | 'id';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string, ...args: any[]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

const setCookie = (name: string, value: string, days: number) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    if (typeof document !== 'undefined') {
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
}

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
        document.documentElement.lang = lang;
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
