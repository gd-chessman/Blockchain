"use client";
import React, { createContext, useState, useEffect } from 'react';
import { langConfig as importedLangConfig } from "./index";

export interface LangContextProps {
  lang: string;
  setLang: (lang: string) => void;
  langConfig: typeof importedLangConfig;
}

export const LangContext = createContext<LangContextProps | undefined>(undefined);

interface LangProviderProps {
  children: React.ReactNode;
  initialLang?: string; // Nhận giá trị ngôn ngữ từ SSR
  langConfig?: typeof importedLangConfig;
}

export const LangProvider: React.FC<LangProviderProps> = ({ 
  children, 
  initialLang = 'kr', 
  langConfig 
}) => {
  const isClient = typeof window !== 'undefined';
  const [lang, setLang] = useState<string>(() => {
    if (isClient) {
      const storedLang = localStorage.getItem('appLang');
      return storedLang || initialLang;
    }
    return initialLang;
  });

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('appLang', lang);
      document.documentElement.lang = lang;
    }
  }, [lang, isClient]);

  const config = langConfig || importedLangConfig;

  return (
    <LangContext.Provider value={{ lang, setLang, langConfig: config }}>
      {children}
    </LangContext.Provider>
  );
};
