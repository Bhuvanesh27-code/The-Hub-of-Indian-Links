import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Building2,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Search,
  Quote,
  Shield,
  Globe,
  Zap,
  ShieldCheck,
  RefreshCw,
  Map,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { ALL_INDIAN_STATES, ALL_UNION_TERRITORIES } from '../data/seedLinks';
import { getTranslatedState } from '../utils/translator';

interface CategoryCardsProps {
  onSelectCentral: () => void;
  onOpenStateSelector: () => void;
  onSelectState: (stateOrUT: string) => void;
  onSelectUTs: () => void;
  onSelectNonGov: () => void;
  onSelectProverb?: () => void;
  isStateSelectorOpen: boolean;
  onCloseStateSelector: () => void;
  centralCount?: number;
  stateCount?: number;
  utCount?: number;
  nonGovCount?: number;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({
  onSelectCentral,
  onOpenStateSelector,
  onSelectState,
  onSelectUTs,
  onSelectNonGov,
  onSelectProverb,
  isStateSelectorOpen,
  onCloseStateSelector,
}) => {
  const { currentLang, t } = useLanguage();
  const [stateSearch, setStateSearch] = useState<string>('');

  const filteredStates = ALL_INDIAN_STATES.filter((s) =>
    s.toLowerCase().includes(stateSearch.toLowerCase())
  );
  const filteredUTs = ALL_UNION_TERRITORIES.filter((u) =>
    u.toLowerCase().includes(stateSearch.toLowerCase())
  );

  // If user clicked "State Governments" and chooses to view all 28 states & 8 UTs
  if (isStateSelectorOpen) {
    return (
      <section id="state-selector-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-24 animate-fade-scale">
        <div className="bg-[#0A1224] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
          {/* Header with Back button and search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={onCloseStateSelector}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all active:scale-95"
                title="Back to Categories"
                aria-label="Back to Categories"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {t('state_selector_title') || 'Choose State or Union Territory'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  {t('state_selector_sub') || "Select any of India's 28 States or 8 Union Territories to view official services"}
                </p>
              </div>
            </div>

            {/* State filter input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                placeholder={t('state_selector_search') || 'Filter state or UT…'}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#070F22] border border-slate-700 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 28 Indian States Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                <span>{t('state_selector_states') || '28 Indian States'} ({filteredStates.length})</span>
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {filteredStates.map((state) => (
                <button
                  key={state}
                  onClick={() => onSelectState(state)}
                  className="p-3 rounded-xl bg-[#070F22] hover:bg-slate-800 hover:border-emerald-500/60 border border-slate-800 text-left transition-all hover:scale-105 active:scale-95 group shadow-sm"
                >
                  <p className="text-xs font-bold text-white group-hover:text-emerald-400 leading-snug line-clamp-2">
                    {getTranslatedState(state, currentLang)}
                  </p>
                  {currentLang !== 'en' && getTranslatedState(state, currentLang) !== state && (
                    <span className="text-[10px] text-slate-400 block truncate">{state}</span>
                  )}
                  <span className="text-[10px] text-slate-500 mt-1 inline-block group-hover:text-emerald-400">
                    {t('link_visit')} &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 8 Union Territories Section */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                <span>{t('state_selector_uts') || '8 Union Territories'} ({filteredUTs.length})</span>
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5">
              {filteredUTs.map((ut) => (
                <button
                  key={ut}
                  onClick={() => onSelectState(ut)}
                  className="p-3 rounded-xl bg-purple-950/20 hover:bg-purple-900/30 hover:border-purple-500/60 border border-purple-800/40 text-left transition-all hover:scale-105 active:scale-95 group shadow-sm"
                >
                  <p className="text-xs font-bold text-purple-200 group-hover:text-purple-300 leading-snug line-clamp-2">
                    {getTranslatedState(ut, currentLang)}
                  </p>
                  {currentLang !== 'en' && getTranslatedState(ut, currentLang) !== ut && (
                    <span className="text-[10px] text-purple-400 block truncate">{ut}</span>
                  )}
                  <span className="text-[10px] text-purple-400 mt-1 inline-block group-hover:text-purple-200">
                    {t('link_visit')} &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="category-cards" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 scroll-mt-24">
      
      {/* Exactly 4 Major Categories on Homepage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Category 1: Central Government (Blue Theme) */}
        <div
          onClick={onSelectCentral}
          className="group relative bg-gradient-to-b from-[#081836] to-[#040C1E] border border-blue-500/50 hover:border-blue-400 rounded-2xl p-5 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_36px_rgba(37,99,235,0.28)] animate-card-glow-central cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          {/* Silhouette watermark */}
          <div className="absolute right-0 bottom-0 w-36 h-28 opacity-15 pointer-events-none group-hover:opacity-30 group-hover:scale-105 transition-all duration-300">
            <svg viewBox="0 0 100 80" className="w-full h-full text-blue-400 fill-current">
              <path d="M50 5 L60 25 L85 25 L85 75 L15 75 L15 25 L40 25 Z" />
              <circle cx="50" cy="20" r="10" />
              <rect x="25" y="35" width="6" height="35" />
              <rect x="40" y="35" width="6" height="35" />
              <rect x="55" y="35" width="6" height="35" />
              <rect x="70" y="35" width="6" height="35" />
            </svg>
          </div>

          <div>
            <div className="flex items-start gap-3.5 mb-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] border-2 border-blue-300/40 flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all duration-300">
                <Building2 className="w-7 h-7 text-white animate-bounce-subtle" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-sky-300 transition-colors">
                  {t('cat_central_title') || 'Central Government'}
                </h3>
                <p className="mt-1 text-[11px] text-slate-300 leading-snug">
                  {t('cat_central_sub') || 'Ministries • Departments • Services • Portals'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-blue-900/60 flex items-center justify-between text-xs font-semibold text-sky-400 group-hover:text-sky-300 transition-colors">
            <span>{t('cat_central_btn') || 'Explore Central Government Links'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
          </div>
        </div>

        {/* Category 2: State Government (Emerald Theme) */}
        <div
          onClick={onOpenStateSelector}
          className="group relative bg-gradient-to-b from-[#06241B] to-[#03140E] border border-emerald-500/50 hover:border-emerald-400 rounded-2xl p-5 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_36px_rgba(16,185,129,0.28)] animate-card-glow-state cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          {/* Silhouette watermark */}
          <div className="absolute right-0 bottom-0 w-36 h-28 opacity-15 pointer-events-none group-hover:opacity-30 group-hover:scale-105 transition-all duration-300">
            <svg viewBox="0 0 100 80" className="w-full h-full text-emerald-400 fill-current">
              <path d="M20 75 L20 40 L50 20 L80 40 L80 75 Z" />
              <rect x="30" y="45" width="8" height="25" />
              <rect x="45" y="45" width="10" height="30" />
              <rect x="62" y="45" width="8" height="25" />
            </svg>
          </div>

          <div>
            <div className="flex items-start gap-3.5 mb-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#10B981] to-[#059669] border-2 border-emerald-300/40 flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] transition-all duration-300">
                <MapPin className="w-7 h-7 text-white animate-bounce-subtle" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-emerald-300 transition-colors">
                  {t('cat_states_title') || 'State Government'}
                </h3>
                <p className="mt-1 text-[11px] text-slate-300 leading-snug">
                  {t('cat_states_sub') || '28 States • Tamil Nadu • Services • Portals'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-emerald-900/60 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">
            <span>{t('cat_states_btn') || 'Select Any of 28 States'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
          </div>
        </div>

        {/* Category 3: Union Territories (Purple Theme) */}
        <div
          onClick={onSelectUTs}
          className="group relative bg-gradient-to-b from-[#1E0F38] to-[#0F071C] border border-purple-500/50 hover:border-purple-400 rounded-2xl p-5 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_36px_rgba(147,51,234,0.28)] cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          {/* Territory watermark */}
          <div className="absolute right-0 bottom-0 w-36 h-28 opacity-15 pointer-events-none group-hover:opacity-30 group-hover:scale-105 transition-all duration-300">
            <svg viewBox="0 0 100 80" className="w-full h-full text-purple-400 fill-current">
              <circle cx="35" cy="50" r="14" />
              <circle cx="65" cy="35" r="18" />
              <circle cx="75" cy="60" r="10" />
            </svg>
          </div>

          <div>
            <div className="flex items-start gap-3.5 mb-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#8B5CF6] to-[#6D28D9] border-2 border-purple-300/40 flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(147,51,234,0.6)] transition-all duration-300">
                <Map className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-purple-300 transition-colors">
                  {t('cat_ut_title') || 'Union Territories'}
                </h3>
                <p className="mt-1 text-[11px] text-slate-300 leading-snug">
                  {t('cat_ut_sub') || 'All 8 UTs • Delhi • Puducherry • J&K & more'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-purple-900/60 flex items-center justify-between text-xs font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">
            <span>{t('cat_ut_btn') || 'Explore Union Territory Links'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
          </div>
        </div>

        {/* Category 4: Not Under Government (Amber / Bronze Theme) */}
        <div
          onClick={onSelectNonGov}
          className="group relative bg-gradient-to-b from-[#2E1B05] to-[#170E02] border border-amber-500/50 hover:border-amber-400 rounded-2xl p-5 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_36px_rgba(245,158,11,0.28)] cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          {/* Subtle shield / stars watermark */}
          <div className="absolute right-0 bottom-0 w-36 h-28 opacity-15 pointer-events-none group-hover:opacity-30 group-hover:scale-105 transition-all duration-300">
            <svg viewBox="0 0 100 80" className="w-full h-full text-amber-400 fill-current">
              <path d="M50 10 L80 20 L80 50 Q 80 70 50 80 Q 20 70 20 50 L20 20 Z" />
            </svg>
          </div>

          <div>
            <div className="flex items-start gap-3.5 mb-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#F59E0B] to-[#D97706] border-2 border-amber-300/40 flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.6)] transition-all duration-300">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
                    {t('cat_nongov_title') || 'Not Under Government'}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {t('cat_nongov_sub') || 'Education • Consumer Aid • ECI • Non-Gov Resources'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-amber-900/60 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300 transition-colors">
            <span>{t('cat_nongov_btn') || 'Explore Non-Government Portals'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
          </div>
        </div>

      </div>

      {/* 5-Feature Badges Bar directly below the 4 cards */}
      <div className="mt-8 rounded-2xl bg-[#081226]/90 border border-slate-800 p-4 sm:p-5 shadow-xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-2 lg:divide-x lg:divide-slate-800">
          
          {/* 1. Official Government Links */}
          <div className="group/badge flex items-center gap-3 px-2 py-1 rounded-xl hover:bg-slate-800/40 transition-colors cursor-default">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-inner group-hover/badge:scale-110 group-hover/badge:bg-blue-600/30 transition-all duration-200">
              <Shield className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight group-hover/badge:text-sky-300 transition-colors">
                {t('badge_official_1') || 'Official'}
              </p>
              <p className="text-[11px] text-slate-400 leading-tight">
                {t('badge_official_2') || 'Government Links'}
              </p>
            </div>
          </div>

          {/* 2. Multiple Languages */}
          <div className="group/badge flex items-center gap-3 px-2 lg:pl-4 py-1 rounded-xl hover:bg-slate-800/40 transition-colors cursor-default">
            <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 shadow-inner group-hover/badge:scale-110 group-hover/badge:bg-purple-600/30 transition-all duration-200">
              <Globe className="w-5 h-5 text-purple-400 group-hover/badge:rotate-45 transition-transform duration-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight group-hover/badge:text-purple-300 transition-colors">
                {t('badge_multiple_1') || 'Multiple'}
              </p>
              <p className="text-[11px] text-slate-400 leading-tight">
                {t('badge_multiple_2') || 'Languages'}
              </p>
            </div>
          </div>

          {/* 3. Easy Search */}
          <div className="group/badge flex items-center gap-3 px-2 lg:pl-4 py-1 rounded-xl hover:bg-slate-800/40 transition-colors cursor-default">
            <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner group-hover/badge:scale-110 group-hover/badge:bg-emerald-600/30 transition-all duration-200">
              <Zap className="w-5 h-5 text-emerald-400 group-hover/badge:scale-125 transition-transform duration-200" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight group-hover/badge:text-emerald-300 transition-colors">
                {t('badge_easy_1') || 'Easy'}
              </p>
              <p className="text-[11px] text-slate-400 leading-tight">
                {t('badge_easy_2') || 'Search'}
              </p>
            </div>
          </div>

          {/* 4. Trusted Information */}
          <div className="group/badge flex items-center gap-3 px-2 lg:pl-4 py-1 rounded-xl hover:bg-slate-800/40 transition-colors cursor-default">
            <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner group-hover/badge:scale-110 group-hover/badge:bg-indigo-600/30 transition-all duration-200">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight group-hover/badge:text-indigo-300 transition-colors">
                {t('badge_trusted_1') || 'Trusted'}
              </p>
              <p className="text-[11px] text-slate-400 leading-tight">
                {t('badge_trusted_2') || 'Information'}
              </p>
            </div>
          </div>

          {/* 5. Always Updated */}
          <div className="group/badge flex items-center gap-3 px-2 lg:pl-4 py-1 rounded-xl hover:bg-slate-800/40 transition-colors cursor-default">
            <div className="w-10 h-10 rounded-full bg-teal-600/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0 shadow-inner group-hover/badge:scale-110 group-hover/badge:bg-teal-600/30 transition-all duration-200">
              <RefreshCw className="w-5 h-5 text-teal-400 group-hover/badge:rotate-180 transition-transform duration-700 ease-in-out" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight group-hover/badge:text-teal-300 transition-colors">
                {t('badge_updated_1') || 'Always'}
              </p>
              <p className="text-[11px] text-slate-400 leading-tight">
                {t('badge_updated_2') || 'Updated'}
              </p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
