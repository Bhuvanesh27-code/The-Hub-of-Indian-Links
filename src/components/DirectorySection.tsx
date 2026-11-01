import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Filter,
  ArrowUpDown,
  RotateCcw,
  Building2,
  MapPin,
  X,
  SearchX,
  Map,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { FilterOptions, GovernmentLink } from '../types';
import { LinkCard } from './LinkCard';
import { ALL_INDIAN_STATES, ALL_UNION_TERRITORIES, SERVICE_CATEGORIES } from '../data/seedLinks';
import {
  getTranslatedState,
  getTranslatedCategory,
  getTranslatedLevel,
} from '../utils/translator';

interface DirectorySectionProps {
  links: GovernmentLink[];
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onReportIssue: (link: GovernmentLink) => void;
  onLinkClick?: (link: GovernmentLink) => void;
  departments: string[];
  onBackToOverview?: () => void;
  onBackToStates?: () => void;
  onSelectCentral?: () => void;
  onSelectState?: (state: string) => void;
  onSelectUTs?: () => void;
  currentMode?: 'central' | 'state_selected' | 'choose_state' | 'search' | 'overview';
}

export const DirectorySection: React.FC<DirectorySectionProps> = ({
  links,
  filters,
  onFilterChange,
  onReportIssue,
  onLinkClick,
  departments,
  onBackToOverview,
  onBackToStates,
  onSelectCentral,
  onSelectState,
  onSelectUTs,
  currentMode,
}) => {
  const { currentLang, t } = useLanguage();

  const handleResetFilters = () => {
    onFilterChange({
      query: '',
      level: 'all',
      stateOrUT: 'all',
      category: 'all',
      department: 'all',
      verificationStatus: 'all',
      sortBy: 'relevance',
    });
  };

  const hasActiveFilters =
    filters.query.length > 0 ||
    filters.level !== 'all' ||
    filters.stateOrUT !== 'all' ||
    filters.category !== 'all' ||
    filters.department !== 'all' ||
    filters.verificationStatus !== 'all';

  const isLevelUnselected = !filters.query && filters.level === 'all' && filters.stateOrUT === 'all';

  // When no specific level is selected and no active search query exists,
  // do NOT render duplicate boxes; the visitor selects Central, State, or Union from the category cards above.
  if (isLevelUnselected) {
    return null;
  }

  const handleSwitchGovernmentLevel = () => {
    handleResetFilters();
    onBackToOverview?.();
    setTimeout(() => {
      const el = document.getElementById('category-cards');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <section
      id="directory-results"
      role="region"
      aria-label="Official Government Links Directory and Search Results"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-24"
    >
      <div>
          {/* Contextual navigation header when filtered to Central, State, or UT */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-[#0D1527] p-4 rounded-2xl border border-slate-800 shadow-md"
            role="navigation"
            aria-label="Directory navigation trail"
          >
            <div className="flex items-center gap-2">
              {/* Button to Switch / Return to Government Level Selector */}
              <button
                type="button"
                onClick={handleSwitchGovernmentLevel}
                aria-label="Switch Government Level: Return to Central, State, or Union selection"
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
              >
                <span aria-hidden="true">&larr;</span>
                <span>Switch Government Level</span>
              </button>

              {/* If viewing a State: quick button to choose another state */}
              {filters.level === 'state' && onBackToStates && (
                <button
                  type="button"
                  onClick={onBackToStates}
                  aria-label="Choose another Indian state or union territory"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-800/60 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                >
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t('dir_choose_another') || 'Choose Another State'}</span>
                </button>
              )}
            </div>

            {/* Current Active Jurisdiction Indicator */}
            <div aria-live="polite" aria-atomic="true">
              {filters.stateOrUT !== 'all' ? (
                <span
                  className="text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full inline-block"
                  aria-label={`Showing ${getTranslatedState(filters.stateOrUT, currentLang)} portals, total ${links.length} results`}
                >
                  {t('dir_showing') || 'Showing:'} {getTranslatedState(filters.stateOrUT, currentLang)} {t('dir_portals') || 'Portals'} ({links.length})
                </span>
              ) : filters.level === 'central' ? (
                <span
                  className="text-xs font-bold text-sky-300 bg-sky-950/60 border border-sky-800/60 px-3 py-1 rounded-full inline-block"
                  aria-label={`Showing Central Government portals, total ${links.length} results`}
                >
                  {t('dir_showing') || 'Showing:'} {getTranslatedLevel('central', currentLang)} {t('dir_portals') || 'Portals'} ({links.length})
                </span>
              ) : filters.level === 'state' ? (
                <span
                  className="text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full inline-block"
                  aria-label={`Showing State Government portals, total ${links.length} results`}
                >
                  {t('dir_showing') || 'Showing:'} {getTranslatedLevel('state', currentLang)} {t('dir_portals') || 'Portals'} ({links.length})
                </span>
              ) : filters.level === 'ut' ? (
                <span
                  className="text-xs font-bold text-purple-300 bg-purple-950/60 border border-purple-800/60 px-3 py-1 rounded-full inline-block"
                  aria-label={`Showing Union Territory portals, total ${links.length} results`}
                >
                  {t('dir_showing') || 'Showing:'} {getTranslatedLevel('ut', currentLang)} {t('dir_portals') || 'Portals'} ({links.length})
                </span>
              ) : filters.level === 'not_under_government' ? (
                <span
                  className="text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded-full inline-block"
                  aria-label={`Showing Not Under Government portals, total ${links.length} results`}
                >
                  {t('dir_showing') || 'Showing:'} Not Under Government Resources ({links.length})
                </span>
              ) : filters.query ? (
                <span
                  className="text-xs font-bold text-white bg-slate-800 border border-slate-700 px-3 py-1 rounded-full inline-block"
                  aria-label={`Search results for query ${filters.query}, total ${links.length} results`}
                >
                  {t('dir_showing') || 'Showing:'} "{filters.query}" ({links.length})
                </span>
              ) : null}
            </div>
          </div>

          {/* Filter and Sorting Control Bar */}
          <div
            className="bg-[#0D1527] rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl mb-8"
            role="search"
            aria-label="Government links directory filters and sorting controls"
          >
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              
              {/* Level Tabs: Central Government, State Governments, Union Territories (No "All" tab!) */}
              <div
                className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0"
                role="tablist"
                aria-label="Government portal levels"
              >
                {filters.query && (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={filters.level === 'all'}
                    aria-label="Show all matching search results"
                    onClick={() => onFilterChange({ ...filters, level: 'all' })}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none ${
                      filters.level === 'all'
                        ? 'bg-[#2478FF] text-white shadow-sm'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    All Search Results
                  </button>
                )}

                <button
                  type="button"
                  role="tab"
                  aria-selected={filters.level === 'central'}
                  aria-label="Filter central government ministries, departments and national portals"
                  onClick={() => onFilterChange({ ...filters, level: 'central', stateOrUT: 'all' })}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none ${
                    filters.level === 'central'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t('filter_central')}</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={filters.level === 'state'}
                  aria-label="Filter state government portals across India"
                  onClick={() => onFilterChange({ ...filters, level: 'state' })}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                    filters.level === 'state'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t('filter_states')} (28 States)</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={filters.level === 'ut'}
                  aria-label="Filter union territories and special regions portals"
                  onClick={() => onFilterChange({ ...filters, level: 'ut' })}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none ${
                    filters.level === 'ut'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Map className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t('filter_uts')} (8 UTs)</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={filters.level === 'not_under_government'}
                  aria-label="Filter essential non-government portals and educational resources"
                  onClick={() => onFilterChange({ ...filters, level: 'not_under_government', stateOrUT: 'all' })}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
                    filters.level === 'not_under_government'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                  <span>Not Under Gov</span>
                </button>
              </div>

              {/* Sorting Dropdown */}
              <div className="flex items-center gap-2 self-end lg:self-auto">
                <label htmlFor="sort-dropdown" className="text-xs font-semibold text-slate-400 flex items-center gap-1 cursor-pointer">
                  <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t('sort_label')}</span>
                </label>
                <select
                  id="sort-dropdown"
                  value={filters.sortBy}
                  aria-label="Sort government directory results by"
                  onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
                  className="py-1.5 px-3 rounded-xl border border-slate-700 bg-[#070B14] text-xs font-semibold text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="relevance">{t('sort_relevance')}</option>
                  <option value="popular">Most Popular (Clicks)</option>
                  <option value="name_asc">{t('sort_az')}</option>
                  <option value="recently_verified">{t('sort_verified')}</option>
                </select>
              </div>
            </div>

            {/* Detailed Dropdowns (State/UT, Category, Department, Verification) */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* State or UT filter */}
              <div>
                <label htmlFor="state-ut-filter" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {filters.level === 'ut' ? 'Union Territory' : 'State / Region'}
                </label>
                <select
                  id="state-ut-filter"
                  value={filters.stateOrUT}
                  aria-label="Filter government directory by Indian State or Union Territory"
                  onChange={(e) => onFilterChange({ ...filters, stateOrUT: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-700 bg-[#070B14] text-xs font-medium text-white focus:ring-2 focus:ring-sky-500 focus:outline-none truncate"
                >
                  <option value="all">
                    {filters.level === 'state'
                      ? 'All 28 States'
                      : filters.level === 'ut'
                      ? 'All 8 Union Territories'
                      : t('filter_state_select')}
                  </option>
                  {filters.level !== 'ut' && (
                    <optgroup label="28 Indian States" className="bg-[#070B14] text-white">
                      {ALL_INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {getTranslatedState(s, currentLang)}{currentLang !== 'en' && getTranslatedState(s, currentLang) !== s ? ` (${s})` : ''}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {filters.level !== 'state' && (
                    <optgroup label="8 Union Territories" className="bg-[#070B14] text-white">
                      {ALL_UNION_TERRITORIES.map((ut) => (
                        <option key={ut} value={ut}>
                          {getTranslatedState(ut, currentLang)}{currentLang !== 'en' && getTranslatedState(ut, currentLang) !== ut ? ` (${ut})` : ''}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              {/* Category filter */}
              <div>
                <label htmlFor="category-filter" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Service Category
                </label>
                <select
                  id="category-filter"
                  value={filters.category}
                  aria-label="Filter government directory by service category"
                  onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-700 bg-[#070B14] text-xs font-medium text-white focus:ring-2 focus:ring-sky-500 focus:outline-none truncate"
                >
                  <option value="all">{t('filter_category_select')}</option>
                  {SERVICE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {getTranslatedCategory(cat, currentLang)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department filter */}
              <div>
                <label htmlFor="dept-filter" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Department / Ministry
                </label>
                <select
                  id="dept-filter"
                  value={filters.department}
                  aria-label="Filter government directory by department or ministry"
                  onChange={(e) => onFilterChange({ ...filters, department: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-700 bg-[#070B14] text-xs font-medium text-white focus:ring-2 focus:ring-sky-500 focus:outline-none truncate"
                >
                  <option value="all">All Departments ({departments.length})</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Verification Status filter */}
              <div>
                <label htmlFor="status-filter" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Verification Status
                </label>
                <select
                  id="status-filter"
                  value={filters.verificationStatus}
                  aria-label="Filter government directory by verification status"
                  onChange={(e) => onFilterChange({ ...filters, verificationStatus: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-700 bg-[#070B14] text-xs font-medium text-white focus:ring-2 focus:ring-sky-500 focus:outline-none truncate"
                >
                  <option value="all">{t('filter_status_select')}</option>
                  <option value="verified">Verified Official Only</option>
                  <option value="pending">Pending Review</option>
                  <option value="needs_rechecking">Needs Rechecking</option>
                </select>
              </div>
            </div>

            {/* Active Filter Chips & Clear All */}
            {hasActiveFilters && (
              <div
                className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2"
                aria-label="Active directory filter criteria"
              >
                <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Active filters">
                  <span className="text-xs text-slate-400 mr-1">Active Filters:</span>

                  {filters.query && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-950/60 border border-sky-800 text-sky-300 text-xs font-medium">
                      <span>Query: "{filters.query}"</span>
                      <button
                        type="button"
                        onClick={() => onFilterChange({ ...filters, query: '' })}
                        aria-label={`Remove search query filter "${filters.query}"`}
                        className="hover:text-red-400 focus-visible:ring-1 focus-visible:ring-sky-400 rounded"
                      >
                        <X className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </span>
                  )}

                  {filters.level !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-950/60 border border-blue-800 text-blue-300 text-xs font-medium">
                      <span>Level: {filters.level === 'central' ? 'Central' : filters.level === 'state' ? 'State' : 'Union Territory'}</span>
                      <button
                        type="button"
                        onClick={() => onFilterChange({ ...filters, level: 'all' })}
                        aria-label={`Remove government level filter ${filters.level}`}
                        className="hover:text-red-400 focus-visible:ring-1 focus-visible:ring-blue-400 rounded"
                      >
                        <X className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </span>
                  )}

                  {filters.stateOrUT !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-medium">
                      <span>Region: {filters.stateOrUT}</span>
                      <button
                        type="button"
                        onClick={() => onFilterChange({ ...filters, stateOrUT: 'all' })}
                        aria-label={`Remove region filter ${filters.stateOrUT}`}
                        className="hover:text-red-400 focus-visible:ring-1 focus-visible:ring-emerald-400 rounded"
                      >
                        <X className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </span>
                  )}

                  {filters.category !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-white text-xs font-medium">
                      <span>Category: {filters.category}</span>
                      <button
                        type="button"
                        onClick={() => onFilterChange({ ...filters, category: 'all' })}
                        aria-label={`Remove category filter ${filters.category}`}
                        className="hover:text-red-400 focus-visible:ring-1 focus-visible:ring-slate-400 rounded"
                      >
                        <X className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </span>
                  )}

                  {filters.verificationStatus !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-medium">
                      <span>Status: {filters.verificationStatus}</span>
                      <button
                        type="button"
                        onClick={() => onFilterChange({ ...filters, verificationStatus: 'all' })}
                        aria-label={`Remove verification status filter ${filters.verificationStatus}`}
                        className="hover:text-red-400 focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
                      >
                        <X className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  aria-label="Reset all search filters"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 rounded-lg p-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t('filter_reset')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Results Header (Count) with screen reader announcement */}
          <div
            className="flex items-center justify-between mb-6"
            aria-live="polite"
            aria-atomic="true"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight" id="directory-results-heading">
              <span className="text-sky-400 font-mono tabular-nums">{links.length}</span> {t('results_count')}
            </h2>

            {filters.stateOrUT !== 'all' && (
              <span
                className="text-xs font-semibold px-3 py-1 bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 rounded-full"
                aria-label={`Showing ${filters.stateOrUT} Services`}
              >
                Showing {filters.stateOrUT} Services
              </span>
            )}
          </div>

          {/* Grid of Results with full list role and WCAG compliance */}
          {links.length > 0 ? (
            <div
              role="list"
              aria-labelledby="directory-results-heading"
              aria-label="Government links directory list"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {links.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onReportIssue={onReportIssue}
                  onLinkClick={onLinkClick}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div
              role="status"
              aria-live="polite"
              className="bg-[#0D1527] rounded-3xl p-12 text-center border border-slate-800 shadow-xl max-w-xl mx-auto my-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-slate-700">
                <SearchX className="w-8 h-8" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Matching Links</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                {t('results_empty')}
              </p>
              <button
                type="button"
                onClick={handleSwitchGovernmentLevel}
                aria-label="Switch Government Level to view portals"
                className="px-6 py-2.5 rounded-xl bg-[#2478FF] hover:bg-[#1b64db] text-white text-sm font-semibold shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
              >
                <span>Switch Government Level</span>
              </button>
            </div>
          )}
        </div>
    </section>
  );
};
