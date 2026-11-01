import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldAlert,
  SearchCheck,
  Flag,
  Sparkles,
  School,
  Heart,
} from 'lucide-react';

interface AboutSectionProps {
  onOpenReportModal: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenReportModal }) => {
  const { t } = useLanguage();

  return (
    <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 scroll-mt-24">
      <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-scale">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-950/60 border border-blue-800 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-3 animate-bounce-subtle">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>{t('about_story_mission') || 'Our Story & Mission'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t('about_heading')}
        </h2>
        <p className="mt-3 text-base text-slate-300 leading-relaxed">
          {t('brand_tagline')} An independent educational directory dedicated to bridging the information divide across Bharat.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Creator Card */}
        <div className="bg-[#0D1527] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden card-hover-tilt">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF9933]/5 rounded-bl-full pointer-events-none" />

          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-400 flex items-center justify-center mb-4 shadow-inner animate-pulse-badge">
              <School className="w-6 h-6 text-[#FF9933]" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              {t('about_creator_title')}
            </h3>

            {/* Preserving creator information */}
            <div className="p-4 rounded-2xl bg-[#070B14] border border-amber-500/30 my-3">
              <p className="text-sm font-semibold text-amber-200 leading-relaxed">
                “{t('about_creator_text')}”
              </p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mt-4">
              {t('about_mission_text')}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
            <Heart className="w-4 h-4 text-red-400 flex-shrink-0 animate-pulse" />
            <span>{t('about_passion_text') || 'Built with passion to serve fellow Indian citizens and learners.'}</span>
          </div>
        </div>

        {/* Verification Methodology */}
        <div className="bg-[#0D1527] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden card-hover-tilt">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-bl-full pointer-events-none" />

          <div>
            <div className="w-12 h-12 rounded-2xl bg-sky-950/40 border border-sky-800/60 text-sky-400 flex items-center justify-center mb-4 shadow-inner animate-pulse-badge">
              <SearchCheck className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              {t('about_how_verified_title')}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              {t('about_how_verified_text')}
            </p>

            <ul className="mt-4 space-y-2 text-xs sm:text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-2 flex-shrink-0" />
                <span>{t('about_domain_text') || 'Authoritative domain confirmation: .gov.in, .nic.in, and state gTLDs.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-2 flex-shrink-0" />
                <span>{t('about_ssl_text') || 'SSL/TLS security protocol audit (HTTPS encryption).'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-2 flex-shrink-0" />
                <span>{t('about_gazette_text') || 'Cross-referenced against official notifications and gazettes.'}</span>
              </li>
            </ul>
          </div>

          {/* Citizen reporting CTA */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={onOpenReportModal}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-[#2478FF] text-slate-200 hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-slate-700 active:scale-95"
            >
              <Flag className="w-4 h-4 text-amber-400 animate-bounce-subtle" />
              <span>{t('report_broken_link') || 'Report a Broken or Changed Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Independent Directory Disclaimer Banner */}
      <div className="mt-8 rounded-3xl bg-[#070B14] border border-slate-800 p-6 sm:p-8 card-hover-tilt">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0 border border-slate-700">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>

          <div>
            <h4 className="text-base font-bold text-white">
              {t('about_disclaimer_title')}
            </h4>
            <p className="mt-1 text-sm text-slate-300 leading-relaxed">
              {t('about_disclaimer_text')}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              {t('about_trademark_note') || 'All government trademarks, logos, and portal names referenced in this directory belong to their respective ministries, departments, and statutory bodies of the Republic of India.'}
            </p>
          </div>
        </div>
      </div>

      {/* Mockup Signature Attribution Strip */}
      <div className="mt-10 rounded-2xl bg-[#050C1B] border border-slate-800 p-6 sm:p-7 shadow-xl card-hover-tilt">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            {/* India Map outline SVG */}
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 48 48" className="w-7 h-7 text-white fill-current opacity-90 animate-pulse">
                <path d="M22 6 L26 8 L28 14 L32 16 L31 22 L35 25 L34 29 L28 35 L26 42 L22 41 L20 34 L15 28 L17 21 L14 18 L18 12 Z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {t('about_heading') || 'About The Hub of Indian Links'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-relaxed">
                {t('about_creator_note') || 'This is created by S Bhuvanesh .A student of grade 9 in E.S.Lords International CBSE School in Villupuram.All links in one place'}
              </p>
            </div>
          </div>

          {/* Artistic cursive lettering "Better Information Stronger India" */}
          <div className="md:text-right shrink-0 select-none">
            <div className="text-xl sm:text-2xl font-serif italic text-sky-400 font-bold tracking-wide animate-text-glow">
              {t('better_info') || 'Better Information'}
            </div>
            <div className="text-xl sm:text-2xl font-serif italic text-sky-400 font-bold tracking-wide -mt-1 animate-text-glow">
              {t('stronger_india') || 'Stronger India'}
            </div>
            <svg
              className="w-28 sm:w-36 h-2 md:ml-auto text-sky-400 mt-1"
              viewBox="0 0 100 10"
              fill="none"
            >
              <path
                d="M0 5 Q 50 12, 100 2"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
