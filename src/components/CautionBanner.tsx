import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const CautionBanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative overflow-hidden rounded-2xl bg-amber-950/30 border border-amber-600/40 p-4 sm:p-6 shadow-md">
        <div className="flex items-start sm:items-center gap-4">
          {/* Warning Icon with amber badge */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-900/50 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-inner">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>

          <div className="flex-1">
            <h2 className="text-base sm:text-lg font-bold text-amber-200 flex items-center gap-2">
              <span>{t('caution_title')}</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-900/60 border border-amber-700/60 px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                Cyber Safety Advisory
              </span>
            </h2>
            <p className="mt-1 text-sm sm:text-base text-amber-100/90 font-normal leading-relaxed">
              {t('caution_desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
