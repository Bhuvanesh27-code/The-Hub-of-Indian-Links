import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  SUPPORTED_LANGUAGES,
  TranslationDictionary,
  getTranslation,
  getLanguageCompleteness,
} from '../data/translations';
import { LanguageInfo } from '../types';

interface LanguageContextType {
  currentLang: string;
  currentLangInfo: LanguageInfo;
  languages: LanguageInfo[];
  setLanguage: (code: string) => void;
  t: (key: keyof TranslationDictionary) => string;
  isRtl: boolean;
  completeness: number;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLang: 'en',
  currentLangInfo: SUPPORTED_LANGUAGES[0],
  languages: SUPPORTED_LANGUAGES,
  setLanguage: () => {},
  t: () => '',
  isRtl: false,
  completeness: 100,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLangState] = useState<string>(() => {
    return localStorage.getItem('bright_indian_lang') || 'en';
  });

  const currentLangInfo =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const isRtl = !!currentLangInfo.isRtl;

  const setLanguage = (code: string) => {
    setCurrentLangState(code);
    localStorage.setItem('bright_indian_lang', code);
    document.documentElement.lang = code;
    document.documentElement.dir = SUPPORTED_LANGUAGES.find((l) => l.code === code)?.isRtl
      ? 'rtl'
      : 'ltr';
  };

  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [currentLang, isRtl]);

  const t = (key: keyof TranslationDictionary): string => {
    return getTranslation(currentLang, key);
  };

  const completeness = getLanguageCompleteness(currentLang);

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        currentLangInfo,
        languages: SUPPORTED_LANGUAGES,
        setLanguage,
        t,
        isRtl,
        completeness,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
