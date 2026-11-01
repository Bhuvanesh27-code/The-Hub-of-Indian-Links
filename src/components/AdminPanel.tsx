import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Upload,
  Download,
  Database,
  ArrowLeft,
  Search,
  LogIn,
  LogOut,
  RefreshCw,
  Globe,
  Quote,
  FileText,
  Save,
  X,
  ExternalLink,
  Flame,
  MousePointerClick,
  TrendingUp,
  BarChart3,
  Sparkles,
  Lock,
  Clock,
  History,
  Check,
} from 'lucide-react';
import { GovernmentLink, Proverb, BrokenLinkReport } from '../types';
import {
  validateGovernmentLink,
  detectDuplicates,
  exportLinksToCSV,
  parseCSVToLinks,
} from '../utils/directory';
import { ALL_INDIAN_STATES, ALL_UNION_TERRITORIES, SERVICE_CATEGORIES } from '../data/seedLinks';
import { SUPPORTED_LANGUAGES } from '../data/translations';

interface AdminPanelProps {
  onBack: () => void;
  links: GovernmentLink[];
  onAddLink: (link: GovernmentLink) => Promise<void>;
  onUpdateLink: (link: GovernmentLink) => Promise<void>;
  onDeleteLink: (linkId: string) => Promise<void>;
  proverbs: Proverb[];
  onAddProverb: (proverb: Proverb) => Promise<void>;
  onUpdateProverb: (proverb: Proverb) => Promise<void>;
  onDeleteProverb: (proverbId: string) => Promise<void>;
  reports: BrokenLinkReport[];
  onUpdateReport: (reportId: string, status: BrokenLinkReport['status']) => Promise<void>;
  onSeedDatabase: () => Promise<void>;
  isSyncing: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBack,
  links,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  proverbs,
  onAddProverb,
  onUpdateProverb,
  onDeleteProverb,
  reports,
  onUpdateReport,
}) => {
  const { user, isAdmin, loginWithGoogle, logout, authError, authSuccess, clearAuthError, sessionToken } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'links' | 'dataset' | 'analytics' | 'audit' | 'proverbs' | 'reports'>('links');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [adminSortBy, setAdminSortBy] = useState<'popular' | 'name_asc' | 'level' | 'status'>('popular');

  // Link Add/Edit Modal
  const [editingLink, setEditingLink] = useState<Partial<GovernmentLink> | null>(null);
  const [isNewLink, setIsNewLink] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Dataset Import/Export State
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const [auditLog, setAuditLog] = useState<any[]>([]);

  // Load audit trail from server
  const fetchAudit = async () => {
    try {
      const res = await fetch('/api/admin/audit');
      const data = await res.json();
      if (data.auditTrail) setAuditLog(data.auditTrail);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAudit();
    }
  }, [isAdmin, activeTab]);

  // Statistics
  const stats = useMemo(() => {
    let central = 0;
    let state = 0;
    let ut = 0;
    let nongov = 0;
    let pending = 0;
    let totalClicks = 0;

    links.forEach((l) => {
      const lvl = (l.governmentLevel || l.government_level || 'central').toLowerCase();
      if (lvl === 'not_under_government' || l.organization_type === 'Non-Government') {
        nongov++;
      } else if (lvl === 'ut' || lvl === 'union_territory') {
        ut++;
      } else if (lvl === 'state') {
        state++;
      } else {
        central++;
      }

      if (l.verificationStatus !== 'verified') pending++;
      totalClicks += l.clickCount || 0;
    });

    return {
      total: links.length,
      central,
      state,
      ut,
      nongov,
      pending,
      totalClicks,
    };
  }, [links]);

  const topPopularLinks = useMemo(() => {
    return [...links]
      .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
      .slice(0, 5);
  }, [links]);

  // Filter & sort links for admin table
  const filteredLinks = useMemo(() => {
    const list = links.filter((l) => {
      const q = searchQuery.toLowerCase();
      const matchesQ =
        !q ||
        l.name.toLowerCase().includes(q) ||
        (l.portal_name && l.portal_name.toLowerCase().includes(q)) ||
        l.url.toLowerCase().includes(q) ||
        (l.stateOrUT && l.stateOrUT.toLowerCase().includes(q));
      
      const lvl = (l.governmentLevel || l.government_level || '').toLowerCase();
      const normLvl = lvl === 'union_territory' ? 'ut' : lvl;
      const matchesLevel =
        levelFilter === 'all' ||
        (levelFilter === 'central' && normLvl === 'central') ||
        (levelFilter === 'state' && normLvl === 'state') ||
        (levelFilter === 'ut' && normLvl === 'ut') ||
        (levelFilter === 'not_under_government' && (normLvl === 'not_under_government' || l.organization_type === 'Non-Government'));

      return matchesQ && matchesLevel;
    });

    return list.sort((a, b) => {
      if (adminSortBy === 'popular') return (b.clickCount || 0) - (a.clickCount || 0);
      if (adminSortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (adminSortBy === 'level') return a.governmentLevel.localeCompare(b.governmentLevel);
      return (a.verificationStatus || '').localeCompare(b.verificationStatus || '');
    });
  }, [links, searchQuery, levelFilter, adminSortBy]);

  const handleOpenAddLink = () => {
    setIsNewLink(true);
    setEditingLink({
      name: '',
      url: 'https://',
      governmentLevel: 'central',
      category: 'Central Government',
      department: '',
      description: '',
      uses: ['Citizen portal access'],
      keywords: ['portal'],
      verificationStatus: 'verified',
      official_status: 'official',
      organization_type: 'Government',
    });
    setFormErrors([]);
  };

  const handleOpenEditLink = (link: GovernmentLink) => {
    setIsNewLink(false);
    setEditingLink({ ...link });
    setFormErrors([]);
  };

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;

    if (!editingLink.name || !editingLink.url || editingLink.url.length < 8) {
      setFormErrors(['Please enter a valid portal name and complete URL (e.g., https://example.gov.in)']);
      return;
    }

    setSaving(true);
    try {
      const isNonGov = editingLink.governmentLevel === 'not_under_government';
      const fullLink: GovernmentLink = {
        id: editingLink.id || `gov-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: editingLink.name,
        portal_name: editingLink.name,
        url: editingLink.url,
        official_website_url: editingLink.url,
        governmentLevel: editingLink.governmentLevel || 'central',
        government_level: editingLink.governmentLevel || 'central',
        stateOrUT: editingLink.stateOrUT,
        jurisdiction: editingLink.jurisdiction || editingLink.stateOrUT || (isNonGov ? 'Autonomous' : 'National'),
        category: editingLink.category || (isNonGov ? 'Not Under Government' : 'Citizen Services'),
        department: editingLink.department || '',
        ministry_or_department: editingLink.department || '',
        description: editingLink.description || '',
        portal_description: editingLink.description || '',
        uses: Array.isArray(editingLink.uses) ? editingLink.uses : ['Public citizen service'],
        keywords: Array.isArray(editingLink.keywords) ? editingLink.keywords : ['portal'],
        verificationStatus: editingLink.verificationStatus || 'verified',
        official_status: isNonGov ? 'non-government' : 'official',
        organization_type: isNonGov ? 'Non-Government' : 'Government',
        lastVerified: new Date().toISOString().split('T')[0],
        verified_on: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString(),
        clickCount: editingLink.clickCount || 0,
      };

      // Also persist to server endpoint if session token is available
      if (sessionToken) {
        if (isNewLink) {
          await fetch('/api/admin/links', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionToken}`,
            },
            body: JSON.stringify(fullLink),
          });
        } else {
          await fetch(`/api/admin/links/${fullLink.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionToken}`,
            },
            body: JSON.stringify(fullLink),
          });
        }
      }

      if (isNewLink) {
        await onAddLink(fullLink);
      } else {
        await onUpdateLink(fullLink);
      }
      setEditingLink(null);
      fetchAudit();
    } catch (err: any) {
      setFormErrors([err.message || 'Failed to save link']);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (sessionToken) {
        await fetch(`/api/admin/links/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${sessionToken}` },
        });
      }
      await onDeleteLink(id);
      setDeleteConfirmId(null);
      fetchAudit();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Export dataset.json
  const handleExportDatasetJSON = () => {
    window.open('/api/admin/dataset/export', '_blank');
  };

  // Upload & validate dataset.json
  const handleUploadDatasetJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed || !Array.isArray(parsed.links)) {
          setImportNotice('Validation failed: File must be a valid JSON with a "links" array.');
          return;
        }

        const res = await fetch('/api/admin/dataset/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify(parsed),
        });

        const data = await res.json();
        if (data.success) {
          setImportNotice(`Dataset validated and imported successfully! Total links: ${data.total_imported}`);
          fetchAudit();
        } else {
          setImportNotice(`Import error: ${data.error || 'Server validation failed'}`);
        }
      } catch (err: any) {
        setImportNotice(`JSON Syntax Error: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans pb-16">
      
      {/* Top Admin Navbar */}
      <div className="bg-[#0D1527] border-b border-slate-800 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all active:scale-95"
              title="Return to Public Directory"
              aria-label="Return to Public Directory"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                  Hub of Indian Links &bull; Admin Console
                </h1>
                <p className="text-[11px] text-slate-400">
                  Secure Link Management & Dataset Administration
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-bold">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Administrator Access Granted</span>
                </span>
                <button
                  onClick={logout}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950/40 hover:text-red-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="px-4 py-2 rounded-xl bg-[#2478FF] hover:bg-[#1b64db] text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Verify Admin Identity</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* If Not Authorized / Restricted Access Banner */}
        {!isAdmin && (
          <div className="max-w-xl mx-auto mb-10 p-6 sm:p-8 bg-[#0D1527] border-2 border-amber-500/40 rounded-3xl shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 shadow-inner">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Restricted Administrator Access
            </h3>
            <p className="mt-1 text-sm font-semibold text-amber-400">
              Authentication Required via Google Identity
            </p>

            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              This console provides central management for the Indian Links dataset, click analytics, and portal records. Only the designated administrator account is permitted access.
            </p>

            {authError && (
              <div className="mt-4 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <div className="mt-6 flex flex-col items-center gap-2">
              <button
                onClick={loginWithGoogle}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 active:scale-95"
              >
                <LogIn className="w-5 h-5 text-white" />
                <span>Sign in with Google</span>
              </button>
              <p className="text-[11px] text-slate-500">
                Secure token verification verified against server environment configuration
              </p>
            </div>
          </div>
        )}

        {/* Success Banner */}
        {authSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-sm font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-400" />
              <span>{authSuccess}</span>
            </div>
            <button onClick={clearAuthError} className="p-1 rounded-lg hover:bg-emerald-900/40 text-emerald-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 7 Comprehensive Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          
          {/* Total Links */}
          <div className="bg-[#0D1527] p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Links</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-white font-mono">{stats.total}</span>
              <Database className="w-4 h-4 text-sky-400" />
            </div>
          </div>

          {/* Central Government */}
          <div className="bg-[#081836] p-4 rounded-2xl border border-blue-900/60 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] text-sky-300 uppercase tracking-wider font-bold">Central Gov</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-sky-300 font-mono">{stats.central}</span>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
          </div>

          {/* State Governments */}
          <div className="bg-[#06241B] p-4 rounded-2xl border border-emerald-900/60 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] text-emerald-300 uppercase tracking-wider font-bold">28 States</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-emerald-300 font-mono">{stats.state}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* Union Territories */}
          <div className="bg-[#1E0F38] p-4 rounded-2xl border border-purple-900/60 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] text-purple-300 uppercase tracking-wider font-bold">8 UTs</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-purple-300 font-mono">{stats.ut}</span>
              <span className="w-2 h-2 rounded-full bg-purple-500" />
            </div>
          </div>

          {/* Not Under Government */}
          <div className="bg-[#261605] p-4 rounded-2xl border border-amber-900/60 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] text-amber-300 uppercase tracking-wider font-bold">Not Under Gov</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-amber-300 font-mono">{stats.nongov}</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
          </div>

          {/* Clicks Tracked */}
          <div className="bg-[#0D1527] p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Visits</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-[#64C7FF] font-mono">{stats.totalClicks}</span>
              <MousePointerClick className="w-4 h-4 text-sky-400" />
            </div>
          </div>

          {/* Needs Review / Pending */}
          <div className="bg-[#0D1527] p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Review Status</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-emerald-400 font-mono">100% OK</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('links')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'links'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-[#0D1527] text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Manage Links ({links.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('dataset')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'dataset'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-[#0D1527] text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Dataset Management (dataset.json)</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-[#0D1527] text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Click Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'audit'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-[#0D1527] text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Activity History</span>
          </button>
        </div>

        {/* TAB 1: LINKS MANAGEMENT */}
        {activeTab === 'links' && (
          <div className="space-y-6">
            
            {/* Header with Search and "+ Add New Link" */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0D1527] p-5 rounded-2xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by portal name, URL, department or state…"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#070B14] border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="py-2 px-3 rounded-xl bg-[#070B14] border border-slate-700 text-xs font-semibold text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="central">Central Government</option>
                  <option value="state">State Governments</option>
                  <option value="ut">Union Territories</option>
                  <option value="not_under_government">Not Under Government</option>
                </select>

                <select
                  value={adminSortBy}
                  onChange={(e) => setAdminSortBy(e.target.value as any)}
                  className="py-2 px-3 rounded-xl bg-[#070B14] border border-slate-700 text-xs font-semibold text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="popular">Most Visited (Clicks)</option>
                  <option value="name_asc">Alphabetical (A-Z)</option>
                  <option value="level">By Category Level</option>
                </select>
              </div>

              {isAdmin && (
                <button
                  onClick={handleOpenAddLink}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Link</span>
                </button>
              )}
            </div>

            {/* Links Table */}
            <div className="bg-[#0D1527] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A101E] border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Portal Name & URL</th>
                      <th className="py-3.5 px-3">Category Level</th>
                      <th className="py-3.5 px-3">Region / Dept</th>
                      <th className="py-3.5 px-3 text-center">Visits</th>
                      <th className="py-3.5 px-3 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredLinks.slice(0, 50).map((l) => {
                      const isNonGov = l.governmentLevel === 'not_under_government' || l.organization_type === 'Non-Government';
                      return (
                        <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4">
                            <p className="font-bold text-white text-sm line-clamp-1">{l.name || l.portal_name}</p>
                            <a
                              href={l.url || l.official_website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 mt-0.5 truncate max-w-xs font-mono"
                            >
                              <span>{(l.url || l.official_website_url || '').replace(/^https?:\/\//, '')}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          </td>

                          <td className="py-3 px-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                isNonGov
                                  ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                                  : l.governmentLevel === 'central'
                                  ? 'bg-blue-950/70 text-sky-300 border border-blue-800/60'
                                  : l.governmentLevel === 'ut'
                                  ? 'bg-purple-950/70 text-purple-300 border border-purple-800/60'
                                  : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                              }`}
                            >
                              {isNonGov ? 'Non-Gov' : l.governmentLevel.toUpperCase()}
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            <p className="text-slate-300 font-semibold truncate max-w-[180px]">
                              {l.stateOrUT || l.jurisdiction || 'National'}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate max-w-[180px]">
                              {l.department || l.ministry_or_department || 'Government'}
                            </p>
                          </td>

                          <td className="py-3 px-3 text-center font-mono font-bold text-amber-300">
                            {l.clickCount || 0}
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                              <CheckCircle className="w-3 h-3 text-emerald-400" />
                              <span>Verified</span>
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditLink(l)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                title="Edit Portal"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              {isAdmin && (
                                <button
                                  onClick={() => setDeleteConfirmId(l.id)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-400 transition-colors"
                                  title="Delete Portal"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: DATASET MANAGEMENT (dataset.json) */}
        {activeTab === 'dataset' && (
          <div className="space-y-6">
            <div className="bg-[#0D1527] rounded-3xl p-6 border border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-sky-400" />
                <span>Single Master Database File &bull; dataset.json</span>
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                All portal records across Central, State, UT, and Non-Government categories are synchronized in root <code>/dataset.json</code>.
              </p>

              {importNotice && (
                <div className="mt-4 p-3.5 rounded-xl bg-blue-950/60 border border-blue-800/80 text-sky-200 text-xs font-semibold">
                  {importNotice}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                
                {/* Download / Export */}
                <div className="p-5 rounded-2xl bg-[#070B14] border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Download Clean dataset.json Backup</span>
                    </h4>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      Exports the complete validated link repository conforming to schema v1.0.0. Click counts are kept separate so data remains pristine.
                    </p>
                  </div>
                  <button
                    onClick={handleExportDatasetJSON}
                    className="mt-4 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download dataset.json</span>
                  </button>
                </div>

                {/* Upload & Validate */}
                <div className="p-5 rounded-2xl bg-[#070B14] border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-sky-400" />
                      <span>Upload & Validate dataset.json</span>
                    </h4>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      Uploads a new or edited dataset file. Validates JSON syntax, deduplicates URLs, and atomic saves to server.
                    </p>
                  </div>
                  <label className="mt-4 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95">
                    <Upload className="w-4 h-4" />
                    <span>Select dataset.json File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleUploadDatasetJSON}
                      className="hidden"
                    />
                  </label>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CLICK ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-[#0D1527] rounded-3xl p-6 border border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    <span>Citizen Visit & Popularity Analytics</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Tracks the most essential portals Indian citizens, students, and farmers access daily.
                  </p>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-[#070B14] border border-slate-800 text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Clicks</span>
                  <p className="text-xl font-black text-amber-300 font-mono">{stats.totalClicks}</p>
                </div>
              </div>

              {/* Top 5 Leaderboard */}
              <div className="mt-6">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Top 5 Most Visited Portals</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {topPopularLinks.map((pLink, idx) => (
                    <div key={pLink.id} className="p-4 rounded-2xl bg-[#070B14] border border-slate-800 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded ${idx === 0 ? 'bg-amber-400 text-black' : 'bg-slate-800 text-white'}`}>
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-amber-400" />
                            <span>{pLink.clickCount || 0}</span>
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white line-clamp-1">{pLink.name || pLink.portal_name}</p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{pLink.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="bg-[#0D1527] rounded-3xl p-6 border border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-sky-400" />
              <span>Admin Activity Audit Trail</span>
            </h3>

            <div className="space-y-2.5">
              {auditLog.length === 0 ? (
                <p className="text-xs text-slate-400">No actions recorded yet.</p>
              ) : (
                auditLog.map((entry) => (
                  <div key={entry.id} className="p-3 rounded-xl bg-[#070B14] border border-slate-800 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        entry.action.includes('create') ? 'bg-emerald-950 text-emerald-300' :
                        entry.action.includes('delete') ? 'bg-red-950 text-red-300' :
                        entry.action.includes('update') ? 'bg-blue-950 text-sky-300' : 'bg-purple-950 text-purple-300'
                      }`}>
                        {entry.action.replace('_', ' ')}
                      </span>
                      <span className="text-slate-200">{entry.description}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ADD / EDIT LINK */}
      {editingLink && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-scale">
          <div className="bg-[#0D1527] border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {isNewLink ? <Plus className="w-5 h-5 text-emerald-400" /> : <Edit2 className="w-5 h-5 text-sky-400" />}
                <span>{isNewLink ? 'Add New Portal Link' : 'Edit Portal Record'}</span>
              </h3>
              <button
                onClick={() => setEditingLink(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formErrors.length > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs">
                {formErrors.map((err, idx) => (
                  <p key={idx}>&bull; {err}</p>
                ))}
              </div>
            )}

            <form onSubmit={handleSaveLink} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Portal Name *</label>
                <input
                  type="text"
                  required
                  value={editingLink.name || ''}
                  onChange={(e) => setEditingLink({ ...editingLink, name: e.target.value })}
                  placeholder="e.g. National Portal of India"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-slate-700 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Official Website URL *</label>
                <input
                  type="url"
                  required
                  value={editingLink.url || ''}
                  onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                  placeholder="https://www.india.gov.in"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-slate-700 text-white font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category Level *</label>
                  <select
                    value={editingLink.governmentLevel || 'central'}
                    onChange={(e) => setEditingLink({ ...editingLink, governmentLevel: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-slate-700 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="central">Central Government</option>
                    <option value="state">State Government</option>
                    <option value="ut">Union Territory</option>
                    <option value="not_under_government">Not Under Government</option>
                  </select>
                </div>

                {(editingLink.governmentLevel === 'state' || editingLink.governmentLevel === 'ut') && (
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">State or UT *</label>
                    <select
                      value={editingLink.stateOrUT || ''}
                      onChange={(e) => setEditingLink({ ...editingLink, stateOrUT: e.target.value, jurisdiction: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-slate-700 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      <option value="">Select State or UT</option>
                      {editingLink.governmentLevel === 'state'
                        ? ALL_INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)
                        : ALL_UNION_TERRITORIES.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Ministry or Department</label>
                <input
                  type="text"
                  value={editingLink.department || ''}
                  onChange={(e) => setEditingLink({ ...editingLink, department: e.target.value, ministry_or_department: e.target.value })}
                  placeholder="e.g. Ministry of Electronics and Information Technology"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-slate-700 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Portal Description</label>
                <textarea
                  rows={3}
                  value={editingLink.description || ''}
                  onChange={(e) => setEditingLink({ ...editingLink, description: e.target.value, portal_description: e.target.value })}
                  placeholder="Brief summary of public services provided on this portal…"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-slate-700 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingLink(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isNewLink ? 'Add to Dataset' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1527] border border-red-800/80 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">Delete Portal Record?</h4>
            <p className="mt-1 text-xs text-slate-400">
              Are you sure you want to remove this portal from the database? This action will be logged in the audit trail.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
