import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Shield, ArrowUp, Lock, FileCode, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050811] text-slate-300 border-t border-slate-800/80 mt-16 relative">
      {/* Tricolour Accent Line */}
      <div className="w-full h-[2px] bg-gradient-to-r from-[#FF9933] via-sky-400 to-[#10B981]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Brand Info & Creator Credit */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl font-black tracking-tight text-white">{t('brand_name') || 'The Hub of Indian Links'}</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {t('brand_tagline') || 'All Indian Government Links in One Place.'} Direct access to authentic Central, State, and Union Territory government portals, public services, and verified citizen resources.
            </p>
            
            <div className="mt-4 p-3.5 rounded-2xl bg-[#0B1220] border border-slate-800 max-w-md text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-amber-300">
                Created by S Bhuvanesh, Grade 9 (2026), ES.Lords International CBSE School in Villupuram.
              </p>
              <p className="text-[11px] text-slate-400">
                All links in one place &bull; Safeguarding citizens against counterfeit and phishing portals.
              </p>
            </div>
            
            {/* Direct Master Dataset JSON Download */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a
                href="/api/admin/dataset/export"
                download="dataset.json"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/60 text-sky-300 hover:text-white text-xs font-semibold transition-all hover:scale-105"
                title="Download consolidated master dataset.json"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Download dataset.json</span>
              </a>
            </div>
          </div>

          {/* Column 2: 4 Major Categories Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3">
              Four Categories
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('central')}
                  className="hover:text-white transition-colors"
                >
                  1. Central Government
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('states')}
                  className="hover:text-white transition-colors"
                >
                  2. State Government (28 States)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ut')}
                  className="hover:text-white transition-colors"
                >
                  3. Union Territories (8 UTs)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('nongov')}
                  className="hover:text-white transition-colors text-amber-300 hover:text-amber-200"
                >
                  4. Not Under Government
                </button>
              </li>
              <li className="pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => onNavigate('video')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px] text-sky-400">▶</span>
                  <span>Video Tour</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About & Methodology
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust, Security & Discreet Admin */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3">
              Trust & Administration
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-1.5 text-xs text-slate-400">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified SSL / TLS Encryption</span>
              </li>
              <li className="flex items-center gap-1.5 text-xs text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Anti-Phishing Verification</span>
              </li>
              
              {/* Discreet Administrator Trigger */}
              <li className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="text-slate-500 hover:text-slate-300 flex items-center gap-1.5 text-xs transition-colors group"
                  title="Discreet Administrative Access (Shortcut: Ctrl+Alt+A)"
                >
                  <Lock className="w-3.5 h-3.5 group-hover:text-amber-400 transition-colors" />
                  <span>Admin Access <span className="text-[10px] font-mono text-slate-600">(Ctrl+Alt+A)</span></span>
                </button>
              </li>

              <li>
                <button
                  onClick={scrollToTop}
                  className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 hover:text-white transition-all border border-slate-700 active:scale-95"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Back to top</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>Caution : Double check the website you entered. Confirm the URL ends with an authentic domain before entering sensitive details.</p>
          <p className="flex items-center gap-1">
            <span>The Hub of Indian Links &bull; Built with Pride for Indian Citizens.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
