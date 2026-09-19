"use client";
import { useState, useEffect, useCallback } from 'react';
import { translateText } from './api-client';

export function useLanguage() {
  const [lang, setLang] = useState('en');
  
  useEffect(() => {
    const saved = localStorage.getItem('sevasetu-language');
    if (saved) setLang(saved);
    
    const handler = (e: CustomEvent) => setLang(e.detail.code);
    window.addEventListener('languageChange', handler as EventListener);
    return () => window.removeEventListener('languageChange', handler as EventListener);
  }, []);
  
  return lang;
}

export function useTranslatedText(text: string): string {
  const lang = useLanguage();
  const [translated, setTranslated] = useState(text);
  
  useEffect(() => {
    if (lang === 'en') {
      setTranslated(text);
      return;
    }
    translateText(text, lang).then(setTranslated).catch(() => setTranslated(text));
  }, [text, lang]);
  
  return translated;
}
