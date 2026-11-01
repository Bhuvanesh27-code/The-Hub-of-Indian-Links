import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  Clock,
  Copy,
  Check,
  Flag,
  Building,
  Globe2,
} from 'lucide-react';
import { GovernmentLink } from '../types';
import {
  getTranslatedDescription,
  getTranslatedCategory,
  getTranslatedLevel,
  getTranslatedState,
  getTranslatedUses,
  getTranslatedLinkName,
} from '../utils/translator';

interface LinkCardProps {
  link: GovernmentLink;
  onReportIssue: (link: GovernmentLink) => void;
  onLinkClick?: (link: GovernmentLink) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({ link, onReportIssue, onLinkClick }) => {
  const { currentLang, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const targetUrl = link.official_website_url || link.url;
  const targetName = link.portal_name || link.name;
  const isNonGov =
    link.governmentLevel === 'not_under_government' ||
    link.government_level === 'not_under_government' ||
    link.organization_type === 'Non-Government';

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isVerified = link.verificationStatus === 'verified' || link.official_status === 'official' || link.official_status === 'non-government';

  // Dynamic language translations
  const translatedName = getTranslatedLinkName(link, currentLang);
  const translatedDescription = getTranslatedDescription(link, currentLang);
  const translatedCategory = getTranslatedCategory(link.category, currentLang);
  const translatedLevel = getTranslatedLevel(link.governmentLevel || link.government_level || 'central', currentLang);
  const stateOrUTVal = link.jurisdiction || link.stateOrUT;
  const translatedState = stateOrUTVal ? getTranslatedState(stateOrUTVal, currentLang) : null;
  const translatedUses = getTranslatedUses(link, currentLang);

  // Keyboard navigation on link card item
  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      e.preventDefault();
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      onLinkClick?.(link);
    }
  };

  return (
    <div
      role="listitem"
      tabIndex={0}
      onKeyDown={handleCardKeyDown}
      aria-label={`${translatedName}. ${isNonGov ? 'Non-Government Website. ' : `Government level: ${translatedLevel}. `}${
        translatedState ? `Region: ${translatedState}. ` : ''
      }Category: ${translatedCategory}. ${
        isVerified ? 'Verified link' : 'Pending verification'
      }. Press Enter to visit website.`}
      className={`rounded-2xl border shadow-lg hover:-translate-y-1.5 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between group focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none ${
        isNonGov
          ? 'bg-[#15110A] border-amber-900/50 hover:border-amber-500/70 hover:shadow-[0_12px_32px_rgba(245,158,11,0.18)]'
          : 'bg-[#0D1527] border-slate-800 hover:border-sky-500/60 hover:shadow-[0_12px_32px_rgba(37,99,235,0.2)]'
      }`}
    >
      <div>
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Portal metadata tags">
            
            {/* MANDATORY PROMINENT BADGE for Category 4: Non-Government Website */}
            {isNonGov ? (
              <span
                role="status"
                aria-label="Important notice: This is a Non-Government Website"
                className="text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/60 flex items-center gap-1 shadow-xs"
              >
                <AlertTriangle className="w-3 h-3 text-amber-400" aria-hidden="true" />
                <span>Non-Government Website</span>
              </span>
            ) : (
              /* Government Level Badge */
              <span
                role="status"
                aria-label={`Government level: ${translatedLevel}`}
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  link.governmentLevel === 'central'
                    ? 'bg-blue-950/70 text-sky-300 border border-blue-800/80'
                    : link.governmentLevel === 'ut' || link.government_level === 'union_territory'
                    ? 'bg-purple-950/70 text-purple-300 border border-purple-800/80'
                    : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/80'
                }`}
              >
                {translatedLevel}
              </span>
            )}

            {/* State or UT Badge */}
            {translatedState && !isNonGov && (
              <span
                role="status"
                aria-label={`Region: ${translatedState}`}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-200"
              >
                {translatedState}
              </span>
            )}

            {/* Category / Service Category Badge */}
            <span
              role="status"
              aria-label={`Category: ${translatedCategory}`}
              className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 truncate max-w-[200px]"
              title={translatedCategory}
            >
              {translatedCategory}
            </span>
          </div>

          {/* Verification Status Pill */}
          <div
            role="status"
            aria-label={
              isVerified
                ? isNonGov ? 'Authentic citizen portal' : 'Verified official government website'
                : 'Under review'
            }
            className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
              isNonGov
                ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                : isVerified
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
            }`}
          >
            {isVerified ? (
              <>
                <ShieldCheck className={`w-3.5 h-3.5 ${isNonGov ? 'text-amber-400' : 'text-emerald-400'}`} aria-hidden="true" />
                <span>{isNonGov ? 'Verified Public Resource' : t('link_verified')}</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                <span>{t('link_pending')}</span>
              </>
            )}
          </div>
        </div>

        {/* Title in high contrast text */}
        <h3
          id={`link-title-${link.id}`}
          className={`text-lg sm:text-xl font-bold leading-snug transition-colors ${
            isNonGov ? 'text-amber-100 group-hover:text-amber-300' : 'text-white group-hover:text-sky-400'
          }`}
        >
          {translatedName}
        </h3>

        {/* Department / Organisation */}
        {(link.ministry_or_department || link.department) && (
          <p
            className="mt-1 text-xs font-medium text-slate-400 flex items-center gap-1.5 truncate"
            aria-label={`Organisation: ${link.ministry_or_department || link.department}`}
          >
            <Building className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{link.ministry_or_department || link.department}</span>
          </p>
        )}

        {/* Description */}
        <p className="mt-3 text-sm text-slate-300 leading-relaxed font-normal">
          {translatedDescription}
        </p>

        {/* What users can do (Uses) */}
        {translatedUses && translatedUses.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5" id={`uses-heading-${link.id}`}>
              {t('link_uses')}
            </p>
            <ul className="space-y-1 text-xs text-slate-300" aria-labelledby={`uses-heading-${link.id}`}>
              {translatedUses.slice(0, 3).map((use, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-sky-400 font-bold shrink-0 mt-0.5">&bull;</span>
                  <span className="leading-relaxed">{use}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* URL preview & Verification date */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 truncate max-w-[260px] text-slate-400 group-hover:text-sky-300 font-mono text-[10px]">
            <Globe2 className="w-3 h-3 text-slate-500 shrink-0" aria-hidden="true" />
            <span className="truncate">{targetUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
          </span>

          {(link.lastVerified || link.verified_on) && (
            <span
              className="flex items-center gap-1 text-slate-500 text-[10px]"
              aria-label={`Last verified date: ${link.lastVerified || link.verified_on}`}
            >
              <Clock className="w-3 h-3 text-slate-500" aria-hidden="true" />
              <span>Verified {link.lastVerified || link.verified_on}</span>
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {/* Copy URL */}
          <button
            type="button"
            onClick={handleCopy}
            title={copied ? `URL copied: ${targetUrl}` : `Copy website URL for ${translatedName}`}
            aria-label={
              copied
                ? `Copied website URL for ${translatedName} to clipboard: ${targetUrl}`
                : `Copy website URL for ${translatedName} to clipboard: ${targetUrl}`
            }
            tabIndex={0}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            ) : (
              <Copy className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          {/* Report Issue */}
          <button
            type="button"
            onClick={() => onReportIssue(link)}
            title={`Report broken or changed link for ${translatedName}`}
            aria-label={`Report broken or changed link for ${translatedName}`}
            tabIndex={0}
            className="p-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-amber-950/40 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
          >
            <Flag className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Visit Website Button */}
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onLinkClick?.(link)}
          aria-label={`Visit official website: ${translatedName} at ${targetUrl} (opens in a new tab)`}
          title={`Visit official website: ${translatedName}`}
          tabIndex={0}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-95 group/btn focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
            isNonGov
              ? 'bg-amber-600 hover:bg-amber-500 text-white focus-visible:ring-amber-400'
              : 'bg-[#2478FF] hover:bg-[#1b64db] text-white focus-visible:ring-sky-300'
          }`}
        >
          <span>{t('link_visit')}</span>
          <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
};
