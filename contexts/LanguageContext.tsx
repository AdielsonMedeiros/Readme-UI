'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { en } from '../locales/en';
import { pt } from '../locales/pt';

type Language = 'en' | 'pt';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Load language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'pt')) {
      setLanguage(savedLang);
    }
  }, []);

  // Save language to localStorage on change
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const dictionary = language === 'pt' ? pt : en;

  // Translation helper
  const t = (path: string) => {
    const keys = path.split('.');
    let current: any = dictionary;
    
    for (const key of keys) {
      if (current[key] === undefined) {
        // Fallback to English if missing in PT
        let fallback: any = en;
        for (const k of keys) {
            fallback = fallback?.[k];
        }
        if (fallback) return fallback as string;

        console.warn(`Translation key not found: ${path}`);
        return path;
      }
      current = current[key];
    }
    
    return current as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
