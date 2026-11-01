import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Globe,
  Menu,
  X,
  Shield,
  User as UserIcon,
  LogIn,
  LogOut,
  ChevronDown,
  UploadCloud,
  Search,
  Home,
  Building2,
  MapPin,
  Map,
  Quote,
  Info,
  Check,
  Plus,
  Sparkles,
  Lock,
  PlayCircle,
} from 'lucide-react';

interface HeaderProps {
  onNavigate: (section: string) => void;
  activeSection: string;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onOpenImport: () => void;
  onQuickSearch?: (query: string) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

// Indian circular flag SVG
const IndiaFlagIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={`${className} rounded-full overflow-hidden shrink-0 shadow-xs`} viewBox="0 0 32 32">
    <rect width="32" height="10.66" fill="#FF9933" />
    <rect y="10.66" width="32" height="10.66" fill="#FFFFFF" />
    <rect y="21.33" width="32" height="10.66" fill="#138808" />
    <circle cx="16" cy="16" r="4.5" fill="none" stroke="#000080" strokeWidth="1" />
    <circle cx="16" cy="16" r="1.2" fill="#000080" />
  </svg>
);

// English (UK) circular flag SVG
const UKFlagIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={`${className} rounded-full overflow-hidden shrink-0 shadow-xs`} viewBox="0 0 32 32">
    <clipPath id="circle-clip">
      <circle cx="16" cy="16" r="16" />
    </clipPath>
    <g clipPath="url(#circle-clip)">
      <rect width="32" height="32" fill="#012169" />
      <path d="M0,0 L32,32 M32,0 L0,32" stroke="#FFFFFF" strokeWidth="4.5" />
      <path d="M0,0 L32,32 M32,0 L0,32" stroke="#C8102E" strokeWidth="2.5" />
      <path d="M16,0 V32 M0,16 H32" stroke="#FFFFFF" strokeWidth="6.5" />
      <path d="M16,0 V32 M0,16 H32" stroke="#C8102E" strokeWidth="3.8" />
    </g>
  </svg>
);

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  activeSection,
  onOpenSearch,
  onOpenAdmin,
  onOpenImport,
  onQuickSearch,
}) => {
  const { currentLang, languages, setLanguage, t, isRtl } = useLanguage();
  const { user, isAdmin, loginWithGoogle, logout } = useAuth();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
        setShowAllLanguages(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = languages.find((l) => l.code === currentLang) || languages[0];

  // Primary languages shown first in the dropdown (matching mockup)
  const primaryLangCodes = ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'gu', 'mr'];
  const primaryLanguages = primaryLangCodes
    .map((code) => languages.find((l) => l.code === code))
    .filter(Boolean) as typeof languages;

  const displayLanguages = showAllLanguages ? languages : primaryLanguages;

  return (
    <header className="sticky top-0 z-50 bg-[#070E1E]/95 backdrop-blur-md text-slate-100 shadow-xl border-b border-slate-800/80">
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-3">
          
          {/* Left Brand Identity: Ashoka Emblem + Title + Subtitle */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none shrink-0"
            onClick={() => onNavigate('home')}
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-wider text-slate-300 uppercase leading-none">
                {t('brand_prefix') || 'The Hub of'}
              </span>
              <span className="text-base sm:text-xl xl:text-2xl font-black tracking-tight leading-tight whitespace-nowrap">
                <span className="text-[#38BDF8]">{t('brand_highlight_1') || 'Indian'}</span>{' '}
                <span className="text-[#34D399]">{t('brand_highlight_2') || 'Links'}</span>
              </span>
              <span className="text-[9px] text-slate-400 font-medium leading-none hidden 2xl:block">
                {t('brand_tagline') || 'All Government Links in One Place'}
              </span>
            </div>
            <div className="hidden xl:block h-7 w-[1px] bg-slate-700/80 ml-1 mr-1" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-medium">
            {/* Home (Capsule Active State) */}
            <button
              onClick={() => onNavigate('home')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                activeSection === 'home'
                  ? 'bg-[#1D4ED8] text-white font-bold shadow-md shadow-blue-900/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t('nav_home')}</span>
            </button>

            {/* Central Government */}
            <button
              onClick={() => onNavigate('central')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                activeSection === 'central'
                  ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
              <span>{t('nav_central_short') || 'Central'}</span>
            </button>

            {/* State Governments */}
            <button
              onClick={() => onNavigate('states')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                activeSection === 'states'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('nav_states_short') || 'States'}</span>
            </button>

            {/* Union Territories */}
            <button
              onClick={() => onNavigate('ut')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                activeSection === 'ut'
                  ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Map className="w-3.5 h-3.5 text-purple-400" />
              <span>{t('nav_uts_short') || 'UTs'}</span>
            </button>

            {/* Not Under Government */}
            <button
              onClick={() => onNavigate('nongov')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                activeSection === 'nongov'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Not Under Gov</span>
            </button>

            {/* Video Tour */}
            <button
              onClick={() => onNavigate('video')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                activeSection === 'video'
                  ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>Video</span>
            </button>

            {/* Proverb */}
            <button
              onClick={() => onNavigate('proverbs')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                activeSection === 'proverbs'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Quote className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('nav_proverbs')}</span>
            </button>

            {/* About */}
            <button
              onClick={() => onNavigate('about')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                activeSection === 'about'
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('nav_about')}</span>
            </button>
          </nav>

          {/* Right Controls: Quick Search + Language Dropdown + Admin Tab */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Search Pill */}
            <div className="relative hidden xl:flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder={t('search_short') || 'Search'}
                onClick={onOpenSearch}
                onChange={(e) => onQuickSearch?.(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-full bg-[#0B1528] border border-slate-700 text-xs text-white placeholder-slate-400 w-28 focus:w-44 focus:border-sky-500 focus:outline-none transition-all shadow-inner"
              />
            </div>

            {/* Language Selector Dropdown with Flag Icons */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0B1528] hover:bg-slate-800 border border-sky-500/50 hover:border-sky-400 text-xs font-medium text-slate-200 hover:text-white transition-all shadow-sm"
                aria-expanded={langMenuOpen}
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-semibold">{currentLangObj.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div
                  className={`absolute ${
                    isRtl ? 'left-0' : 'right-0'
                  } mt-2 w-56 max-h-96 overflow-y-auto bg-[#070F22] text-slate-100 rounded-2xl shadow-2xl border border-sky-500/40 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150`}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex justify-between items-center">
                    <span>Language</span>
                    <span className="text-[10px] text-sky-400 font-mono">22 Scheduled</span>
                  </div>

                  <div className="py-1 space-y-0.5">
                    {displayLanguages.map((lang) => {
                      const isSelected = lang.code === currentLang;
                      const isEnglish = lang.code === 'en';

                      return (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setLangMenuOpen(false);
                            setShowAllLanguages(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-[#1D4ED8] text-white font-bold'
                              : 'text-slate-200 hover:bg-slate-800/80 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isEnglish ? <UKFlagIcon className="w-4 h-4" /> : <IndiaFlagIcon className="w-4 h-4" />}
                            <span>{lang.nativeName}</span>
                            {lang.nativeName !== lang.name && (
                              <span className="text-[10px] text-slate-400">({lang.name})</span>
                            )}
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      );
                    })}
                  </div>

                  {!showAllLanguages ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAllLanguages(true);
                      }}
                      className="w-full mt-1.5 pt-2 border-t border-slate-800 text-left px-2.5 py-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 hover:bg-slate-800/60 rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t('lang_more') || 'More Languages'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAllLanguages(false);
                      }}
                      className="w-full mt-1.5 pt-2 border-t border-slate-800 text-center px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:text-slate-200"
                    >
                      {t('lang_less') || 'Show Less'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ADMIN TAB IN TOP-RIGHT CORNER */}
            <div className="relative" ref={userRef}>
              {isAdmin ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onOpenAdmin}
                    className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all border border-amber-300/40 active:scale-95"
                    title="Open Administrator Dashboard"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-200" />
                    <span>{t('admin_panel_title') || 'Admin Panel'}</span>
                  </button>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    aria-label="Account Settings"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAdmin}
                  className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors border border-slate-700/60"
                  title="Admin Access (Ctrl+Alt+A)"
                  aria-label="Admin Access"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              )}

              {/* User Account Popover */}
              {user && userMenuOpen && (
                <div
                  className={`absolute ${
                    isRtl ? 'left-0' : 'right-0'
                  } mt-2 w-56 bg-[#070F22] text-slate-100 rounded-2xl shadow-2xl border border-slate-700 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150`}
                >
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white">
                      {isAdmin ? 'Administrator' : 'Visitor Mode'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isAdmin ? 'Authorized Management' : 'Read-Only Citizen Access'}
                    </p>
                  </div>
                  <div className="mt-1 space-y-1">
                    {isAdmin ? (
                      <button
                        onClick={() => {
                          onOpenAdmin();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-sky-400 hover:bg-slate-800 flex items-center gap-2 font-medium"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Open Admin Dashboard</span>
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          setUserMenuOpen(false);
                          await loginWithGoogle();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-sky-400 hover:bg-slate-800 flex items-center gap-2 font-medium"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Log in as Admin</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/40 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('admin_logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
                  activeSection === 'home' ? 'bg-[#1D4ED8] text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>{t('nav_home')}</span>
              </button>
              <button
                onClick={() => {
                  onNavigate('central');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 text-slate-300 hover:bg-slate-800"
              >
                <Building2 className="w-4 h-4 text-sky-400" />
                <span>{t('nav_central')}</span>
              </button>
              <button
                onClick={() => {
                  onNavigate('states');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 text-slate-300 hover:bg-slate-800"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{t('nav_states')}</span>
              </button>
              <button
                onClick={() => {
                  onNavigate('ut');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 text-slate-300 hover:bg-slate-800"
              >
                <Map className="w-4 h-4 text-purple-400" />
                <span>Union Territories</span>
              </button>
              <button
                onClick={() => {
                  onNavigate('proverbs');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 text-slate-300 hover:bg-slate-800"
              >
                <Quote className="w-4 h-4 text-amber-400" />
                <span>{t('nav_proverbs')}</span>
              </button>
              <button
                onClick={() => {
                  onNavigate('about');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 text-slate-300 hover:bg-slate-800"
              >
                <Info className="w-4 h-4 text-slate-400" />
                <span>{t('nav_about')}</span>
              </button>
              
              <div className="pt-2 mt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    onOpenImport();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <UploadCloud className="w-4 h-4 text-sky-400" />
                  <span>Import Dataset</span>
                </button>
                <button
                  onClick={() => {
                    onOpenAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Panel</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
