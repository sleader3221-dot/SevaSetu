"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useState, useEffect } from "react";

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
];

export default function LanguageSelector() {
  const [lang, setLang] = useState(LANGUAGES[0]);

  useEffect(() => {
    const savedCode = localStorage.getItem('sevasetu-language');
    if (savedCode) {
      const savedLang = LANGUAGES.find(l => l.code === savedCode);
      if (savedLang) setLang(savedLang);
    }
  }, []);

  const handleLanguageChange = (selectedLang: typeof LANGUAGES[0]) => {
    setLang(selectedLang);
    localStorage.setItem('sevasetu-language', selectedLang.code);
    
    // Set googtrans cookies for full-page translation
    const host = window.location.hostname;
    const cookieVal = selectedLang.code === 'en' ? '/en/en' : `/en/${selectedLang.code}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    if (host) {
      document.cookie = `googtrans=${cookieVal}; path=/; domain=${host};`;
      document.cookie = `googtrans=${cookieVal}; path=/; domain=.${host};`;
    }

    // Trigger select element if injected by Google Translate
    const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (selectElem) {
      selectElem.value = selectedLang.code;
      selectElem.dispatchEvent(new Event('change'));
    } else {
      // Reload briefly to apply translation cookies across all components
      window.location.reload();
    }

    window.dispatchEvent(new CustomEvent('languageChange', { detail: { code: selectedLang.code } }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 text-gray-700 hover:text-primary hover:bg-orange-50 rounded-full px-4 h-10">
          <Globe className="h-5 w-5" />
          <span className="hidden sm:inline-block font-medium">{lang.native}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white/90 backdrop-blur-md border-gray-100 shadow-xl rounded-xl">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem 
            key={l.code} 
            onClick={() => handleLanguageChange(l)}
            className={`cursor-pointer justify-between py-3 px-4 ${lang.code === l.code ? 'bg-orange-50 text-primary font-bold' : 'text-gray-700 font-medium'}`}
          >
            <span>{l.native}</span>
            <span className="text-xs text-gray-400">{l.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
