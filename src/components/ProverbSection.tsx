import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Proverb } from '../types';
import { getTranslatedProverb } from '../data/proverbs';

interface ProverbSectionProps {
  proverbs: Proverb[];
}

export const ProverbSection: React.FC<ProverbSectionProps> = ({ proverbs }) => {
  const { currentLang, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  if (!proverbs || proverbs.length === 0) return null;

  const currentProverb = proverbs[currentIndex] || proverbs[0];
  const translatedText = getTranslatedProverb(currentProverb.text, currentLang);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : proverbs.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < proverbs.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="proverbs" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2 animate-bounce-subtle">
          <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
          <span>{t('proverbs_sub') || 'Wisdom & Values'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t('proverbs_heading')}
        </h2>
      </div>

      <div className="relative bg-[#0D1527] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800 overflow-hidden card-hover-tilt">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9933]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
          {/* Subtle quote icon */}
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-[#FF9933] mb-6 shadow-inner animate-pulse-badge">
            <Quote className="w-6 h-6" />
          </div>

          {/* Proverb text with localized wording */}
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight leading-relaxed italic text-white min-h-[5rem] flex flex-col items-center justify-center">
            <span>"{translatedText}"</span>
            {currentLang !== 'en' && translatedText !== currentProverb.text && (
              <span className="text-sm font-normal text-slate-400 not-italic mt-2 block">
                ({currentProverb.text})
              </span>
            )}
          </blockquote>

          {/* Indicators & Counter */}
          <div className="mt-8 flex items-center gap-2">
            {proverbs.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to proverb ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'w-8 bg-[#FF9933]' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handlePrev}
              aria-label={t('proverbs_prev')}
              className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all active:scale-95 hover:border-sky-400"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">
              {currentIndex + 1} / {proverbs.length}
            </span>

            <button
              onClick={handleNext}
              aria-label={t('proverbs_next')}
              className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all active:scale-95 hover:border-sky-400"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
