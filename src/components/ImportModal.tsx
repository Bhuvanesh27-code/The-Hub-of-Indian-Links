import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Database,
  ArrowRight,
  Filter,
  ShieldCheck,
  Globe2,
} from 'lucide-react';
import { GovernmentLink } from '../types';
import {
  parseCSVToLinks,
  normalizeIncomingDataset,
  detectDuplicates,
  validateGovernmentLink,
  isIgodLink,
} from '../utils/directory';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingLinks: GovernmentLink[];
  onImportSuccess: (newLinks: GovernmentLink[]) => Promise<number> | number;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  existingLinks,
  onImportSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rawParsedCount, setRawParsedCount] = useState<number>(0);
  const [validLinks, setValidLinks] = useState<GovernmentLink[]>([]);
  const [duplicateCount, setDuplicateCount] = useState<number>(0);
  const [igodSkippedCount, setIgodSkippedCount] = useState<number>(0);
  const [invalidCount, setInvalidCount] = useState<number>(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'analyzed' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const resetState = () => {
    setFile(null);
    setRawParsedCount(0);
    setValidLinks([]);
    setDuplicateCount(0);
    setIgodSkippedCount(0);
    setInvalidCount(0);
    setImportStatus('idle');
    setStatusMessage('');
    setShowPreview(false);
  };

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    setStatusMessage('');

    try {
      const text = await selectedFile.text();
      let candidates: Partial<GovernmentLink>[] = [];

      if (selectedFile.name.endsWith('.json') || selectedFile.type === 'application/json') {
        const parsed = JSON.parse(text);
        candidates = normalizeIncomingDataset(parsed);
      } else {
        // Parse CSV
        candidates = parseCSVToLinks(text);
      }

      setRawParsedCount(candidates.length);

      if (candidates.length === 0) {
        setImportStatus('error');
        setStatusMessage('No valid link rows found in file. Please check file formatting.');
        setIsProcessing(false);
        return;
      }

      // 1. Exclude any link whose URL contains "igod"
      let igodCount = 0;
      const nonIgod = candidates.filter((item) => {
        if (isIgodLink(item)) {
          igodCount++;
          return false;
        }
        return true;
      });
      setIgodSkippedCount(igodCount);

      // 2. Validate links
      let invalid = 0;
      const validCandidateList: Partial<GovernmentLink>[] = [];
      for (const item of nonIgod) {
        const val = validateGovernmentLink(item);
        if (val.valid) {
          validCandidateList.push(item);
        } else {
          invalid++;
        }
      }
      setInvalidCount(invalid);

      // 3. Deduplicate against existing live links
      const { duplicates, unique } = detectDuplicates(validCandidateList, existingLinks);
      setDuplicateCount(duplicates.length);

      // Prepare final verified links
      const finalPrepared: GovernmentLink[] = unique.map((u, idx) => ({
        id: u.id || `gov-import-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        name: u.name!,
        url: u.url!,
        governmentLevel: u.governmentLevel || 'central',
        stateOrUT: u.stateOrUT,
        department: u.department,
        category: u.category || 'Citizen Services',
        description: u.description || '',
        uses: u.uses || [],
        keywords: u.keywords || [],
        clickCount: u.clickCount || 0,
        verificationStatus: 'verified',
        lastVerified: u.lastVerified || new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString(),
      }));

      setValidLinks(finalPrepared);
      setImportStatus('analyzed');
    } catch (err: any) {
      setImportStatus('error');
      setStatusMessage(err?.message || 'Failed to read file. Please ensure it is valid JSON or CSV.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleImportToLiveDataset = async () => {
    if (validLinks.length === 0) return;
    setIsProcessing(true);
    try {
      await onImportSuccess(validLinks);
      setImportStatus('success');
      setStatusMessage(
        `Success! ${validLinks.length} new government portals were successfully incorporated into the live directory dataset.`
      );
    } catch (err: any) {
      setImportStatus('error');
      setStatusMessage(err?.message || 'Failed to merge dataset.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Sample templates download
  const handleDownloadSampleJSON = () => {
    const sample = [
      {
        name: "National Scholarship Portal",
        url: "https://scholarships.gov.in",
        governmentLevel: "central",
        category: "Education and Scholarships",
        department: "Ministry of Electronics & IT",
        description: "One-stop platform for Central and State government educational scholarships.",
        uses: ["Apply for Pre-Matric & Post-Matric scholarships", "Track application status"]
      },
      {
        name: "Tamil Nadu e-Sevai Portal",
        url: "https://www.tnesevai.tn.gov.in",
        governmentLevel: "state",
        stateOrUT: "Tamil Nadu",
        category: "Citizen Services",
        department: "Tamil Nadu e-Governance Agency",
        description: "Official portal providing citizen certificates and municipal services online.",
        uses: ["Income certificate", "Community certificate", "Birth and Death certificates"]
      }
    ];
    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "sample_government_links_template.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSampleCSV = () => {
    const csvContent =
`name,url,governmentLevel,stateOrUT,category,department,description,uses
"National Scholarship Portal","https://scholarships.gov.in","central","","Education and Scholarships","Ministry of Electronics & IT","One-stop portal for all government scholarships","Apply online; Track disbursement"
"Tamil Nadu e-Sevai","https://www.tnesevai.tn.gov.in","state","Tamil Nadu","Citizen Services","TNeGA","State citizen services portal","Community certificate; Income certificate"
"Chandigarh Administration e-Services","https://chandigarh.gov.in","ut","Chandigarh","Citizen Services","Department of IT","Official UT e-governance service directory","Public utility payments; Grievance redressal"`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "sample_government_links_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0D1527] text-slate-100 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-800 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            resetState();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#2478FF]/20 border border-[#2478FF]/40 text-[#64C7FF] flex items-center justify-center shadow-inner">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Import Government Dataset
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Upload JSON or CSV files to instantly incorporate new links into the website dataset.
            </p>
          </div>
        </div>

        {importStatus === 'success' ? (
          <div className="py-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">Dataset Included Successfully</h3>
            <p className="mt-2 text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              {statusMessage}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  resetState();
                  onClose();
                  const el = document.getElementById('directory-results');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-[#2478FF] hover:bg-[#1f66da] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>View Live Directory</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={resetState}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors"
              >
                Import Another File
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#2478FF] bg-[#2478FF]/10 scale-[1.01]'
                  : 'border-slate-700 hover:border-slate-500 bg-[#070B14]/60 hover:bg-[#070B14]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    processFile(e.target.files[0]);
                  }
                }}
              />

              <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Upload className="w-6 h-6 text-[#64C7FF]" />
              </div>

              <p className="text-sm font-bold text-white">
                {file ? file.name : 'Click to select or drag & drop JSON / CSV file'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports standard portal schemas with name, URL, governmentLevel, stateOrUT, category
              </p>

              {file && (
                <span className="mt-3 inline-block text-xs font-mono text-[#64C7FF] bg-[#2478FF]/20 px-3 py-1 rounded-full border border-[#2478FF]/30">
                  {(file.size / 1024).toFixed(1)} KB &bull; {file.name.endsWith('.json') ? 'JSON Dataset' : 'CSV Dataset'}
                </span>
              )}
            </div>

            {/* Analysis Report */}
            {importStatus === 'analyzed' && (
              <div className="bg-[#070B14] rounded-2xl p-5 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Dataset Ingestion Analysis</span>
                  <span className="text-[#64C7FF] font-mono text-xs">{rawParsedCount} Total Records Detected</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-center">
                    <p className="text-xs text-emerald-400 font-medium">Ready to Add</p>
                    <p className="text-xl font-extrabold text-emerald-300 mt-0.5">{validLinks.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-center">
                    <p className="text-xs text-amber-400 font-medium">Duplicate Skipped</p>
                    <p className="text-xl font-extrabold text-amber-300 mt-0.5">{duplicateCount}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/60 text-center">
                    <p className="text-xs text-purple-400 font-medium">Filtered (igod)</p>
                    <p className="text-xl font-extrabold text-purple-300 mt-0.5">{igodSkippedCount}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <p className="text-xs text-slate-400 font-medium">Invalid URL</p>
                    <p className="text-xl font-extrabold text-slate-300 mt-0.5">{invalidCount}</p>
                  </div>
                </div>

                {validLinks.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mt-3 text-xs">
                      <span className="text-slate-300">
                        {validLinks.length} new unique verified links ready to include in the live dataset.
                      </span>
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="text-[#64C7FF] hover:underline font-semibold"
                      >
                        {showPreview ? 'Hide Preview' : 'Preview Records'}
                      </button>
                    </div>

                    {showPreview && (
                      <div className="mt-3 max-h-48 overflow-y-auto rounded-xl border border-slate-800 divide-y divide-slate-800 bg-[#0B132B]">
                        {validLinks.slice(0, 8).map((link, i) => (
                          <div key={i} className="p-2.5 text-xs flex items-center justify-between gap-2">
                            <div className="truncate flex-1">
                              <p className="font-semibold text-white truncate">{link.name}</p>
                              <p className="font-mono text-[11px] text-slate-400 truncate">{link.url}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 uppercase shrink-0">
                              {link.stateOrUT || link.governmentLevel}
                            </span>
                          </div>
                        ))}
                        {validLinks.length > 8 && (
                          <p className="p-2 text-center text-[11px] text-slate-400 font-mono">
                            + {validLinks.length - 8} more records
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-amber-400 font-medium">
                    All links in this file already exist in the website dataset or were skipped as duplicates. No new links to add.
                  </p>
                )}
              </div>
            )}

            {/* Error Message */}
            {importStatus === 'error' && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
              {/* Sample Download Links */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Templates:</span>
                <button
                  type="button"
                  onClick={handleDownloadSampleJSON}
                  className="text-[#64C7FF] hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <Download className="w-3 h-3" />
                  JSON
                </button>
                <span>&bull;</span>
                <button
                  type="button"
                  onClick={handleDownloadSampleCSV}
                  className="text-[#64C7FF] hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <Download className="w-3 h-3" />
                  CSV
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    resetState();
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isProcessing || validLinks.length === 0}
                  onClick={handleImportToLiveDataset}
                  className="px-5 py-2.5 rounded-xl bg-[#2478FF] hover:bg-[#1f66da] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Database className="w-4 h-4" />
                  <span>
                    {isProcessing
                      ? 'Processing…'
                      : validLinks.length > 0
                      ? `Include ${validLinks.length} Links in Dataset`
                      : 'Include in Website Dataset'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
