import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  X,
  ArrowRight,
  ShieldAlert,
  Building2,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { GovernmentLink } from '../types';
import { getSearchSuggestions, highlightMatch } from '../utils/directory';

interface HeroSectionProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSelectSuggestion: (link: GovernmentLink) => void;
  onSelectCategory?: (category: string) => void;
  onSelectLevel?: (level: 'central' | 'state' | 'ut') => void;
  allLinks: GovernmentLink[];
  onOpenImport?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  query,
  onQueryChange,
  onSelectSuggestion,
  onSelectLevel,
  allLinks,
}) => {
  const { t, isRtl } = useLanguage();
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = getSearchSuggestions(allLinks, query, 6);

  // Close suggestions when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation through suggestions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
      return;
    }

    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        const selected = suggestions[selectedIndex];
        if (selected.link) {
          onSelectSuggestion(selected.link);
          setIsFocused(false);
        }
      } else {
        // Scroll to directory results
        const el = document.getElementById('directory-results');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFocused(false);
    const el = document.getElementById('directory-results');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-[#070F22] pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-slate-800/80 select-none">
      
      {/* Background Graphic Left: Clean Waving Indian National Tricolor Flag Ribbon */}
      <div className="absolute -left-4 top-0 bottom-0 w-[42%] max-w-[480px] pointer-events-none select-none z-0 hidden md:block overflow-hidden">
        <img
          src="/src/assets/images/indian_flag_ribbon_1793010703569.jpg"
          alt="Indian Flag Ribbon"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-left opacity-80 filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-float-gentle transition-transform will-change-transform"
          style={{
            maskImage: 'linear-gradient(to right, black 55%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black 55%, transparent 100%)',
          }}
        />
      </div>

      {/* Background Graphic Right: Clean Illuminated India Gate Monument */}
      <div className="absolute right-0 top-0 bottom-0 w-[40%] max-w-[460px] pointer-events-none select-none z-0 hidden md:block overflow-hidden">
        <img
          src="/src/assets/images/india_gate_1793010703505.jpg"
          alt="India Gate Monument"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-85 filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-pulse-glow transition-all will-change-auto"
          style={{
            maskImage: 'linear-gradient(to left, black 55%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to left, black 55%, transparent 100%)',
          }}
        />
      </div>

      {/* Subtle Central Lighting / Radial glow for focus */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sky-500/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[#FF9933]/10 blur-[100px] rounded-full pointer-events-none z-0" />

      {/* Center Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Intro divider: —— Welcome to —— */}
        <div className="flex items-center justify-center gap-3 text-slate-300 text-sm font-semibold tracking-wider">
          <span className="w-10 sm:w-16 h-[1.5px] bg-gradient-to-r from-transparent to-slate-400" />
          <span className="text-xs sm:text-base tracking-widest text-slate-200 uppercase font-bold animate-fade-scale">
            {t('welcome_to') || 'Welcome to'}
          </span>
          <span className="w-10 sm:w-16 h-[1.5px] bg-gradient-to-l from-transparent to-slate-400" />
        </div>

        {/* Main Title: The Hub of Indian Links */}
        <h1 className="mt-3 text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight filter drop-shadow-md">
          {t('brand_prefix') || 'The Hub of'}{' '}
          <span className="text-[#38BDF8] animate-text-glow inline-block">
            {t('brand_highlight_1') || 'Indian'}
          </span>{' '}
          <span className="text-[#34D399] animate-text-glow inline-block">
            {t('brand_highlight_2') || 'Links'}
          </span>
        </h1>

        {/* Subtitle: All Government Links in One Place */}
        <p className="mt-2 text-base sm:text-2xl text-slate-100 font-semibold tracking-normal filter drop-shadow">
          {t('brand_tagline') || 'All Government Links in One Place'}
        </p>

        {/* Actions Row: Caution Capsule + Watch Video Tour Button */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <div className="px-4 sm:px-6 py-2 rounded-full bg-gradient-to-r from-amber-700/40 via-amber-600/50 to-amber-700/40 border border-amber-400/60 shadow-lg backdrop-blur-md flex items-center gap-2 text-amber-200 text-xs sm:text-sm font-semibold animate-soft-pulse hover:scale-105 transition-transform cursor-default">
            <span className="text-amber-300 text-base">🛡️</span>
            <span>{t('hero_caution') || 'Caution : Double check the website you entered.'}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('portal-video-tour');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            aria-label="Watch official video walkthrough of The Hub of Indian Links"
            className="px-4 sm:px-5 py-2 rounded-full bg-blue-950/80 hover:bg-blue-900/90 border border-sky-400/60 text-sky-200 hover:text-white text-xs sm:text-sm font-bold shadow-lg backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 group/tour"
          >
            <span className="w-5 h-5 rounded-full bg-sky-500 text-black flex items-center justify-center text-[10px] font-black group-hover/tour:bg-sky-400 transition-colors">▶</span>
            <span>Watch Video Tour</span>
          </button>
        </div>

        {/* Large White Pill Search Bar */}
        <div className="mt-8 relative max-w-3xl mx-auto" ref={containerRef}>
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-full p-1.5 sm:p-2 pl-4 sm:pl-6 flex items-center shadow-2xl border-2 border-white/80 focus-within:ring-4 focus-within:ring-sky-500/30 hover:shadow-[0_12px_45px_rgba(37,99,235,0.22)] transition-all duration-300 select-text"
          >
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#2563EB] shrink-0 mr-2 animate-bounce-subtle" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                onQueryChange(e.target.value);
                setIsFocused(true);
                setSelectedIndex(-1);
              }}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder={t('search_placeholder') || 'Search for government links, services, schemes, certificates, departments...'}
              className="w-full py-2 text-xs sm:text-base text-slate-800 placeholder-slate-400 font-medium bg-transparent focus:outline-none"
              aria-label="Search government links"
            />

            {query && (
              <button
                type="button"
                onClick={() => {
                  onQueryChange('');
                  inputRef.current?.focus();
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full transition-colors mr-1"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="group/search-btn px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#1D4ED8] hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all shrink-0"
            >
              <span>{t('hero_search_btn') || 'Search'}</span>
              <ArrowRight className="w-4 h-4 group-hover/search-btn:translate-x-1 transition-transform duration-200" />
            </button>
          </form>

          {/* Search Suggestions Dropdown */}
          {isFocused && query.trim().length > 0 && suggestions.length > 0 && (
            <div
              className={`absolute top-full left-0 right-0 mt-2 bg-[#0B1528] rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150 ${
                isRtl ? 'rtl' : 'ltr'
              }`}
            >
              <div className="p-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px] text-sky-400">
                  {t('search_suggestions_title')}
                </span>
                <span className="text-[10px]">{t('search_nav_hint') || 'Use ↑↓ to navigate & Enter to visit'}</span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                {suggestions.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (item.link) {
                          onSelectSuggestion(item.link);
                          setIsFocused(false);
                        }
                      }}
                      className={`w-full p-3 flex items-start gap-3 transition-colors text-left ${
                        isSelected ? 'bg-[#1D4ED8]/25 text-white' : 'hover:bg-slate-800/70 text-slate-200'
                      }`}
                    >
                      <div className="mt-0.5 w-6 h-6 rounded-lg bg-sky-950/60 border border-sky-800/80 flex items-center justify-center shrink-0">
                        {item.type === 'state' ? (
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Building2 className="w-3.5 h-3.5 text-sky-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">
                          {highlightMatch(item.title, query).map((part, i) =>
                            part.match ? (
                              <mark key={i} className="bg-sky-400/30 text-sky-200 font-extrabold px-0.5 rounded">
                                {part.text}
                              </mark>
                            ) : (
                              part.text
                            )
                          )}
                        </p>
                        {item.subtitle && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                        )}
                      </div>

                      <ExternalLink className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Quick Level Selector Bar: Let visitors select Central, State, or Union */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs" role="region" aria-label="Select government level">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] mr-1">
            {t('hero_select_level') || 'Select Government Level:'}
          </span>
          <button
            type="button"
            onClick={() => onSelectLevel?.('central')}
            className="px-4 py-2 rounded-full bg-blue-950/80 hover:bg-blue-900 border border-blue-500/50 hover:border-blue-400 text-sky-200 hover:text-white font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-md focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
          >
            <Building2 className="w-3.5 h-3.5 text-sky-400" />
            <span>{t('filter_central') || 'Central Government'}</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectLevel?.('state')}
            className="px-4 py-2 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 hover:border-emerald-400 text-emerald-200 hover:text-white font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-md focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('filter_states') || 'State Governments'} (28 States)</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectLevel?.('ut')}
            className="px-4 py-2 rounded-full bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-md focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none"
          >
            <Building2 className="w-3.5 h-3.5 text-purple-400" />
            <span>{t('filter_uts') || 'Union Territories'} (8 UTs)</span>
          </button>
        </div>

      </div>
    </section>
  );
};
