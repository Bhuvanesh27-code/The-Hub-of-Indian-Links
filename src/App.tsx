import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CautionBanner } from './components/CautionBanner';
import { CategoryCards } from './components/CategoryCards';
import { DirectorySection } from './components/DirectorySection';
import { ProverbSection } from './components/ProverbSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { ReportModal } from './components/ReportModal';
import { ImportModal } from './components/ImportModal';
import { AdminPanel } from './components/AdminPanel';
import { AddLinkBox } from './components/AddLinkBox';
import { VideoShowcase } from './components/VideoShowcase';
import { FilterOptions, GovernmentLink, Proverb, BrokenLinkReport } from './types';
import { INITIAL_GOVERNMENT_LINKS, ALL_UNION_TERRITORIES } from './data/seedLinks';
import { INITIAL_PROVERBS } from './data/proverbs';
import { searchLinks, isIgodLink } from './utils/directory';
import {
  db,
  handleFirestoreError,
  OperationType,
} from './services/firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

/**
 * Merges official government links with cloud-stored / admin-added links.
 * Guarantees that Central and all 36 States/UTs are ALWAYS present and never replaced,
 * while user-added links appear dynamically at the top of their respective lists.
 * Strictly filters out any links whose official link contains "igod".
 */
function mergeGovernmentLinks(
  baseList: GovernmentLink[],
  additionalList: GovernmentLink[]
): GovernmentLink[] {
  const map = new Map<string, GovernmentLink>();
  const linkKeyToId = new Map<string, string>();

  // Restore stored click counts from localStorage
  let storedClicks: Record<string, number> = {};
  try {
    const rawClicks = localStorage.getItem('hub_link_clicks');
    if (rawClicks) {
      storedClicks = JSON.parse(rawClicks);
    }
  } catch (e) {
    // ignore
  }

  const getDedupeKey = (l: Partial<GovernmentLink>) => {
    const u = (l.url || '').trim().toLowerCase().replace(/\/+$/, '');
    const n = (l.name || '').trim().toLowerCase();
    const s = (l.stateOrUT || '').trim().toLowerCase();
    return `${s}:::${u}:::${n}`;
  };

  // Exclude any link whose official URL contains "igod"
  const cleanBase = baseList.filter((l) => !isIgodLink(l));
  const cleanAdditional = additionalList.filter((l) => !isIgodLink(l));

  // 1. Index all clean base links
  cleanBase.forEach((link) => {
    const clicks = Math.max(link.clickCount || 0, storedClicks[link.id] || 0);
    map.set(link.id, { ...link, clickCount: clicks });
    linkKeyToId.set(getDedupeKey(link), link.id);
  });

  // 2. Merge additional / cloud / admin links
  const customNewLinks: GovernmentLink[] = [];
  cleanAdditional.forEach((link) => {
    if (!link || (!link.name && !link.url)) return;
    const dedupeKey = getDedupeKey(link);
    const existingIdByKey = linkKeyToId.get(dedupeKey);
    const targetId = map.has(link.id) ? link.id : existingIdByKey;

    const baseClicks = targetId ? (map.get(targetId)?.clickCount || 0) : 0;
    const clicks = Math.max(link.clickCount || 0, storedClicks[link.id] || 0, baseClicks);

    if (targetId) {
      // Merge with existing link (updates fields)
      map.set(targetId, { ...map.get(targetId)!, ...link, id: targetId, clickCount: clicks });
    } else {
      // Brand new link added by admin
      const newL = { ...link, clickCount: clicks };
      map.set(link.id, newL);
      linkKeyToId.set(dedupeKey, link.id);
      customNewLinks.push(newL);
    }
  });

  const baseResult = cleanBase.map((l) => map.get(l.id)!);
  return [...customNewLinks, ...baseResult];
}

function MainApp() {
  const { isRtl } = useLanguage();
  const { isAdmin } = useAuth();

  // App View ('directory' | 'admin')
  const [currentView, setCurrentView] = useState<'directory' | 'admin'>('directory');

  // Landing page view mode ('overview' | 'choose_state' | 'central' | 'state_selected')
  const [landingMode, setLandingMode] = useState<
    'overview' | 'choose_state' | 'central' | 'state_selected'
  >('overview');

  // Directory Data: Preserved with all verified official links (with all IGOD links removed)
  const [links, setLinks] = useState<GovernmentLink[]>(() => {
    try {
      // Purge any old cache that might contain igod links or outdated format
      const oldCache = localStorage.getItem('bright_indian_cached_links');
      if (oldCache) {
        localStorage.removeItem('bright_indian_cached_links');
      }

      const customSaved = localStorage.getItem('hub_admin_added_links');
      if (customSaved) {
        const parsed = JSON.parse(customSaved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleanCustom = parsed.filter((l: GovernmentLink) => !isIgodLink(l));
          localStorage.setItem('hub_admin_added_links', JSON.stringify(cleanCustom));
          return mergeGovernmentLinks(INITIAL_GOVERNMENT_LINKS, cleanCustom);
        }
      }
    } catch (e) {
      // ignore
    }
    return INITIAL_GOVERNMENT_LINKS.filter((l) => !isIgodLink(l));
  });

  const [proverbs, setProverbs] = useState<Proverb[]>(INITIAL_PROVERBS);
  const [reports, setReports] = useState<BrokenLinkReport[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Active section for header indicator
  const [activeSection, setActiveSection] = useState<string>('home');

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    query: '',
    level: 'all',
    stateOrUT: 'all',
    category: 'all',
    department: 'all',
    verificationStatus: 'all',
    sortBy: 'relevance',
  });

  // Report Modal
  const [reportModalLink, setReportModalLink] = useState<GovernmentLink | null>(null);

  // Import JSON / CSV Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  // Sync / Listen to Firestore data in real-time
  useEffect(() => {
    let unsubLinks: (() => void) | undefined;
    let unsubProverbs: (() => void) | undefined;
    let unsubReports: (() => void) | undefined;

    try {
      // 1. Government Links listener: merge cloud links into INITIAL_GOVERNMENT_LINKS
      unsubLinks = onSnapshot(
        collection(db, 'government_links'),
        (snapshot) => {
          if (!snapshot.empty) {
            const cloudLinks: GovernmentLink[] = [];
            snapshot.forEach((d) => {
              const data = d.data() as GovernmentLink;
              if (data && (data.name || data.url) && !isIgodLink(data)) {
                cloudLinks.push({ ...data, id: data.id || d.id });
              }
            });
            // Merge with base links (excluding any igod links)
            setLinks(() => mergeGovernmentLinks(INITIAL_GOVERNMENT_LINKS, cloudLinks));
            try {
              localStorage.setItem('hub_admin_added_links', JSON.stringify(cloudLinks));
            } catch (e) {}
          }
        },
        (error) => {
          console.warn('Firestore links listener: operating in local cached mode', error);
        }
      );

      // 2. Proverbs listener
      unsubProverbs = onSnapshot(
        collection(db, 'proverbs'),
        (snapshot) => {
          if (!snapshot.empty) {
            const cloudProverbs: Proverb[] = [];
            snapshot.forEach((d) => {
              cloudProverbs.push(d.data() as Proverb);
            });
            cloudProverbs.sort((a, b) => (a.order || 0) - (b.order || 0));
            setProverbs(cloudProverbs);
          }
        },
        (error) => {
          console.warn('Firestore proverbs listener fallback');
        }
      );

      // 3. Citizen reports listener (only loads if authorized admin)
      if (isAdmin) {
        unsubReports = onSnapshot(
          collection(db, 'broken_link_reports'),
          (snapshot) => {
            const list: BrokenLinkReport[] = [];
            snapshot.forEach((d) => {
              list.push(d.data() as BrokenLinkReport);
            });
            setReports(list);
          },
          (error) => {
            console.warn('Firestore reports listener fallback');
          }
        );
      }
    } catch (err) {
      console.warn('Firebase initialization note: using seed dataset');
    }

    return () => {
      unsubLinks?.();
      unsubProverbs?.();
      unsubReports?.();
    };
  }, [isAdmin]);

  // Initial fetch from dataset.json via server API
  useEffect(() => {
    fetch('/api/links')
      .then((r) => r.json())
      .then((d) => {
        if (d && Array.isArray(d.links) && d.links.length > 0) {
          setLinks(mergeGovernmentLinks(INITIAL_GOVERNMENT_LINKS, d.links));
        }
      })
      .catch(() => {});
  }, []);

  // Discreet Admin keyboard shortcut (Ctrl+Alt+A or Cmd+Alt+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setCurrentView((prev) => (prev === 'admin' ? 'directory' : 'admin'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Derived filtered & searched links
  const filteredLinks = useMemo(() => {
    return searchLinks(links, filters);
  }, [links, filters]);

  // Central links
  const centralLinks = useMemo(() => {
    return links.filter((l) => l.governmentLevel === 'central');
  }, [links]);

  // Unique departments for filter dropdown
  const allDepartments = useMemo(() => {
    const set = new Set<string>();
    links.forEach((l) => {
      if (l.department && l.department.trim()) {
        set.add(l.department.trim());
      }
    });
    return Array.from(set).sort();
  }, [links]);

  // Navigation handlers
  const handleNavigate = (section: string) => {
    setCurrentView('directory');
    setActiveSection(section);

    if (section === 'home') {
      setLandingMode('overview');
      setFilters((prev) => ({ ...prev, query: '', level: 'all', stateOrUT: 'all' }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'central') {
      setLandingMode('central');
      setFilters((prev) => ({ ...prev, level: 'central', stateOrUT: 'all' }));
      const el = document.getElementById('directory-results');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'states') {
      setLandingMode('choose_state');
      setFilters((prev) => ({ ...prev, level: 'state', stateOrUT: 'all' }));
      const el = document.getElementById('state-selector-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'ut') {
      setLandingMode('state_selected');
      setFilters((prev) => ({ ...prev, level: 'ut', stateOrUT: 'all' }));
      const el = document.getElementById('directory-results');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'nongov') {
      handleSelectNonGov();
    } else if (section === 'proverbs') {
      const el = document.getElementById('proverbs');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'video') {
      const el = document.getElementById('portal-video-tour');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'about') {
      const el = document.getElementById('about');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCentral = () => {
    setActiveSection('central');
    setLandingMode('central');
    setFilters((prev) => ({ ...prev, level: 'central', stateOrUT: 'all' }));
    setTimeout(() => {
      const resultsEl = document.getElementById('directory-results');
      resultsEl?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleOpenStateSelector = () => {
    setActiveSection('states');
    setLandingMode('choose_state');
    setTimeout(() => {
      const selectorEl = document.getElementById('state-selector-section');
      selectorEl?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleSelectState = (stateOrUT: string) => {
    setActiveSection('states');
    setLandingMode('state_selected');
    const isUT = (ALL_UNION_TERRITORIES as readonly string[]).includes(stateOrUT);
    setFilters((prev) => ({
      ...prev,
      level: isUT ? 'ut' : 'state',
      stateOrUT,
    }));
    setTimeout(() => {
      const resultsEl = document.getElementById('directory-results');
      resultsEl?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleSelectUTs = () => {
    setActiveSection('ut');
    setLandingMode('state_selected');
    setFilters((prev) => ({ ...prev, level: 'ut', stateOrUT: 'all' }));
    setTimeout(() => {
      const resultsEl = document.getElementById('directory-results');
      resultsEl?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleSelectNonGov = () => {
    setActiveSection('nongov');
    setLandingMode('state_selected');
    setFilters((prev) => ({ ...prev, level: 'not_under_government', stateOrUT: 'all' }));
    setTimeout(() => {
      const resultsEl = document.getElementById('directory-results');
      resultsEl?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleSelectProverb = () => {
    setActiveSection('proverbs');
    const el = document.getElementById('proverbs');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBackToOverview = () => {
    setActiveSection('home');
    setLandingMode('overview');
    setFilters((prev) => ({ ...prev, query: '', level: 'all', stateOrUT: 'all' }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToStates = () => {
    setLandingMode('choose_state');
    setFilters((prev) => ({ ...prev, stateOrUT: 'all' }));
    const el = document.getElementById('state-selector-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectCategory = (category: string) => {
    setLandingMode('central');
    setFilters((prev) => ({ ...prev, category, level: 'central' }));
    setTimeout(() => {
      const resultsEl = document.getElementById('directory-results');
      resultsEl?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleOpenSearch = () => {
    setCurrentView('directory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
    input?.focus();
  };

  // Admin CRUD actions with Firestore sync and dynamic website visualization
  const handleAddLink = async (newLink: GovernmentLink) => {
    if (isIgodLink(newLink)) {
      throw new Error('Links containing "igod" in the official URL cannot be added.');
    }

    // 1. Immediately update state so it appears in the website in real time
    setLinks((prev) => [
      newLink,
      ...prev.filter((l) => l.id !== newLink.id && l.url !== newLink.url),
    ]);

    // 2. Persist to local storage
    try {
      const customSaved = localStorage.getItem('hub_admin_added_links');
      const existing: GovernmentLink[] = customSaved ? JSON.parse(customSaved) : [];
      const updatedCustom = [
        newLink,
        ...existing.filter((l) => l.id !== newLink.id && l.url !== newLink.url),
      ];
      localStorage.setItem('hub_admin_added_links', JSON.stringify(updatedCustom));
    } catch (e) {
      console.warn('Local storage write warning', e);
    }

    // 3. Persist to Firestore
    try {
      await setDoc(doc(db, 'government_links', newLink.id), newLink);
    } catch (error) {
      console.warn('Cloud write fallback: saved locally', error);
    }
  };

  // Immediate Bulk Import of JSON / CSV dataset into live website dataset
  const handleBulkImport = async (newLinks: GovernmentLink[]): Promise<number> => {
    const clean = newLinks.filter((l) => !isIgodLink(l));
    if (clean.length === 0) return 0;

    // 1. Immediately update local state so the live website dataset reflects new links
    setLinks((prev) => mergeGovernmentLinks(prev, clean));

    // 2. Persist to local storage
    try {
      const customSaved = localStorage.getItem('hub_admin_added_links');
      const existing: GovernmentLink[] = customSaved ? JSON.parse(customSaved) : [];
      const updatedCustom = mergeGovernmentLinks(clean, existing);
      localStorage.setItem('hub_admin_added_links', JSON.stringify(updatedCustom));
    } catch (e) {
      console.warn('Local storage write warning', e);
    }

    // 3. Batch sync to Firestore in chunks if connected
    try {
      for (const link of clean) {
        await setDoc(doc(db, 'government_links', link.id), link);
      }
    } catch (cloudErr) {
      console.warn('Cloud sync fallback: saved locally', cloudErr);
    }

    return clean.length;
  };

  const handleUpdateLink = async (updatedLink: GovernmentLink) => {
    setLinks((prev) => prev.map((l) => (l.id === updatedLink.id ? updatedLink : l)));
    try {
      const customSaved = localStorage.getItem('hub_admin_added_links');
      const existing: GovernmentLink[] = customSaved ? JSON.parse(customSaved) : [];
      const updatedCustom = existing.map((l) => (l.id === updatedLink.id ? updatedLink : l));
      localStorage.setItem('hub_admin_added_links', JSON.stringify(updatedCustom));
    } catch (e) {}

    try {
      await setDoc(doc(db, 'government_links', updatedLink.id), updatedLink);
    } catch (error) {
      console.warn('Cloud update fallback: saved locally', error);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== linkId));
    try {
      const customSaved = localStorage.getItem('hub_admin_added_links');
      const existing: GovernmentLink[] = customSaved ? JSON.parse(customSaved) : [];
      const updatedCustom = existing.filter((l) => l.id !== linkId);
      localStorage.setItem('hub_admin_added_links', JSON.stringify(updatedCustom));
    } catch (e) {}

    try {
      await deleteDoc(doc(db, 'government_links', linkId));
    } catch (error) {
      console.warn('Cloud delete fallback: saved locally', error);
    }
  };

  // Click-counter tracking for government links
  const handleTrackLinkClick = async (clickedLink: GovernmentLink) => {
    if (!clickedLink || !clickedLink.id) return;
    const currentClicks = clickedLink.clickCount || 0;
    const nextClicks = currentClicks + 1;

    // 1. Immediate optimistic UI update
    setLinks((prev) =>
      prev.map((l) => (l.id === clickedLink.id ? { ...l, clickCount: nextClicks } : l))
    );

    // Call server click tracking endpoint
    fetch(`/api/links/click/${clickedLink.id}`, { method: 'POST' }).catch(() => {});

    // 2. Persist in localStorage for instant offline & visitor caching
    try {
      const rawStored = localStorage.getItem('hub_link_clicks');
      const clicksMap: Record<string, number> = rawStored ? JSON.parse(rawStored) : {};
      clicksMap[clickedLink.id] = (clicksMap[clickedLink.id] || currentClicks) + 1;
      localStorage.setItem('hub_link_clicks', JSON.stringify(clicksMap));
    } catch (e) {}

    // 3. Sync to Firestore
    try {
      const linkRef = doc(db, 'government_links', clickedLink.id);
      await setDoc(
        linkRef,
        {
          clickCount: nextClicks,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      // Non-blocking
    }
  };

  const handleAddProverb = async (newP: Proverb) => {
    setProverbs((prev) => [...prev, newP]);
    try {
      await setDoc(doc(db, 'proverbs', newP.id), newP);
    } catch (error) {
      console.warn('Cloud proverb add fallback');
    }
  };

  const handleUpdateProverb = async (updatedP: Proverb) => {
    setProverbs((prev) => prev.map((p) => (p.id === updatedP.id ? updatedP : p)));
    try {
      await setDoc(doc(db, 'proverbs', updatedP.id), updatedP);
    } catch (error) {
      console.warn('Cloud proverb update fallback');
    }
  };

  const handleDeleteProverb = async (pId: string) => {
    setProverbs((prev) => prev.filter((p) => p.id !== pId));
    try {
      await deleteDoc(doc(db, 'proverbs', pId));
    } catch (error) {
      console.warn('Cloud proverb delete fallback');
    }
  };

  const handleUpdateReport = async (reportId: string, status: BrokenLinkReport['status']) => {
    setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status } : r)));
    try {
      await setDoc(
        doc(db, 'broken_link_reports', reportId),
        { status },
        { merge: true }
      );
    } catch (error) {
      console.warn('Cloud report update fallback');
    }
  };

  // Seed / Sync Firestore with complete seed records
  const handleSeedDatabase = async () => {
    setIsSyncing(true);
    try {
      for (const link of INITIAL_GOVERNMENT_LINKS) {
        await setDoc(doc(db, 'government_links', link.id), link);
      }
      for (const proverb of INITIAL_PROVERBS) {
        await setDoc(doc(db, 'proverbs', proverb.id), proverb);
      }
      console.log('Successfully synchronized built-in directory links to Firestore cloud storage!');
    } catch (error: any) {
      console.error('Failed to seed database:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Directory Section is always rendered so all links are immediately visible in preview!
  const showDirectorySection = true;

  return (
    <div className={`min-h-screen bg-[#070B14] text-slate-100 flex flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Sticky Header */}
      <Header
        onNavigate={handleNavigate}
        activeSection={activeSection}
        onOpenSearch={handleOpenSearch}
        onOpenAdmin={() => setCurrentView('admin')}
        onOpenImport={() => setIsImportModalOpen(true)}
        onQuickSearch={(query) => {
          setFilters((prev) => ({ ...prev, query }));
          setTimeout(() => {
            const resultsEl = document.getElementById('directory-results');
            resultsEl?.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }}
      />

      {currentView === 'admin' ? (
        <AdminPanel
          onBack={() => setCurrentView('directory')}
          links={links}
          onAddLink={handleAddLink}
          onUpdateLink={handleUpdateLink}
          onDeleteLink={handleDeleteLink}
          proverbs={proverbs}
          onAddProverb={handleAddProverb}
          onUpdateProverb={handleUpdateProverb}
          onDeleteProverb={handleDeleteProverb}
          reports={reports}
          onUpdateReport={handleUpdateReport}
          onSeedDatabase={handleSeedDatabase}
          isSyncing={isSyncing}
        />
      ) : (
        <main className="flex-grow">
          {/* 1. Hero Section with Live Search, Waving Flag, India Gate, and Caution Banner */}
          <HeroSection
            query={filters.query}
            onQueryChange={(query) => {
              setFilters((prev) => ({ ...prev, query }));
            }}
            onSelectSuggestion={(selectedLink) => {
              handleTrackLinkClick(selectedLink);
              setFilters((prev) => ({
                ...prev,
                query: selectedLink.name,
                level: 'all',
                stateOrUT: 'all',
              }));
              setTimeout(() => {
                const resultsEl = document.getElementById('directory-results');
                resultsEl?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            onSelectCategory={handleSelectCategory}
            onSelectLevel={(level) => {
              if (level === 'central') {
                handleSelectCentral();
              } else if (level === 'ut') {
                handleSelectUTs();
              } else {
                handleOpenStateSelector();
              }
            }}
            allLinks={links}
            onOpenImport={() => setIsImportModalOpen(true)}
          />

          {/* 2. When Admin is authenticated: show add links section */}
          {isAdmin && (
            <div id="admin-add-link-section">
              <AddLinkBox onAddLink={handleAddLink} />
            </div>
          )}

          {/* 3. The 4 Categories: Central Government, State Government, Union Territories, Not Under Government */}
          <CategoryCards
            onSelectCentral={handleSelectCentral}
            onOpenStateSelector={handleOpenStateSelector}
            onSelectState={handleSelectState}
            onSelectUTs={handleSelectUTs}
            onSelectNonGov={handleSelectNonGov}
            onSelectProverb={handleSelectProverb}
            isStateSelectorOpen={landingMode === 'choose_state'}
            onCloseStateSelector={handleBackToOverview}
            centralCount={centralLinks.length}
          />

          {/* 4. Official Video Walkthrough & Portal Showcase */}
          <VideoShowcase />

          {/* 5. Directory Results Section: Displayed with full WCAG accessibility */}
          {showDirectorySection && (
            <DirectorySection
              links={filteredLinks}
              filters={filters}
              onFilterChange={setFilters}
              onReportIssue={(link) => setReportModalLink(link)}
              onLinkClick={handleTrackLinkClick}
              departments={allDepartments}
              onBackToOverview={handleBackToOverview}
              onBackToStates={handleOpenStateSelector}
              onSelectCentral={handleSelectCentral}
              onSelectState={handleSelectState}
              onSelectUTs={handleSelectUTs}
              currentMode={landingMode}
            />
          )}

          {/* 5. Proverb Section (The 6 verbatim proverbs in rotating card) */}
          <ProverbSection proverbs={proverbs} />

          {/* 6. About Bright Indian Section (With S Bhuvanesh Grade 9 credit, purpose & disclaimer) */}
          <AboutSection onOpenReportModal={() => setReportModalLink(links[0] || null)} />
        </main>
      )}

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdmin={() => setCurrentView('admin')}
      />

      {/* Report Issue Modal */}
      <ReportModal
        link={reportModalLink}
        isOpen={!!reportModalLink}
        onClose={() => setReportModalLink(null)}
      />

      {/* Import Dataset (JSON / CSV) Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        existingLinks={links}
        onImportSuccess={handleBulkImport}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </AuthProvider>
  );
}
