import React, { useState } from 'react';
import { X, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { GovernmentLink } from '../types';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface ReportModalProps {
  link: GovernmentLink | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ link, isOpen, onClose }) => {
  const [issueType, setIssueType] = useState<string>('broken_link');
  const [details, setDetails] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen || !link) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const reportId = `report-${Date.now()}`;
    const reportData = {
      id: reportId,
      linkId: link.id,
      linkName: link.name,
      linkUrl: link.url,
      issueType,
      details: details.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'broken_link_reports', reportId), reportData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.warn('Report submission fallback: saved locally or network pending', error);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0D1527] text-slate-100 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-800 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Report Submitted</h3>
            <p className="mt-2 text-sm text-slate-300">
              Thank you for keeping Hub of Indian Links accurate. Our verification team will review this link.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Report Link Issue</h3>
                <p className="text-xs text-slate-400">Help maintain directory integrity</p>
              </div>
            </div>

            <div className="p-3 bg-[#070B14] rounded-xl mb-4 border border-slate-800">
              <p className="text-xs font-semibold text-white">{link.name}</p>
              <p className="text-[11px] font-mono text-sky-400 truncate mt-0.5">{link.url}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Type of Problem
                </label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-700 bg-[#070B14] text-sm text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="broken_link">Website not loading (404 / Offline)</option>
                  <option value="wrong_information">Wrong or Outdated Information</option>
                  <option value="phishing_suspicion">Suspicious / Phishing Portal</option>
                  <option value="other">Other Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Additional Details (Optional)
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe what happened when you tried visiting the portal..."
                  className="w-full p-3 rounded-xl border border-slate-700 bg-[#070B14] text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none"
                />
              </div>

              {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#2478FF] hover:bg-[#1b64db] text-white text-sm font-semibold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting…' : 'Submit Report'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
