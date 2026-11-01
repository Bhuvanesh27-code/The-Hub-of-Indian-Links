import React, { useState } from 'react';
import { Plus, Check, Sparkles, AlertCircle } from 'lucide-react';
import { GovernmentLink } from '../types';
import { ALL_INDIAN_STATES, ALL_UNION_TERRITORIES, SERVICE_CATEGORIES } from '../data/seedLinks';
import { validateGovernmentLink } from '../utils/directory';

interface AddLinkBoxProps {
  onAddLink: (link: GovernmentLink) => Promise<void>;
}

export const AddLinkBox: React.FC<AddLinkBoxProps> = ({ onAddLink }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [level, setLevel] = useState<'central' | 'state' | 'ut'>('central');
  const [stateOrUT, setStateOrUT] = useState('');
  const [category, setCategory] = useState(SERVICE_CATEGORIES[0]);
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [uses, setUses] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    const newLinkCandidate: Partial<GovernmentLink> = {
      id: `gov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      url: finalUrl,
      governmentLevel: level,
      stateOrUT: level === 'central' ? undefined : stateOrUT || undefined,
      category,
      department: department.trim() || undefined,
      description: description.trim() || undefined,
      uses: uses
        .split(';')
        .map((u) => u.trim())
        .filter(Boolean),
      keywords: [name.toLowerCase(), category.toLowerCase()],
      clickCount: 0,
      verificationStatus: 'verified',
      lastVerified: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
    };

    const validation = validateGovernmentLink(newLinkCandidate);
    if (!validation.valid) {
      setErrorMessage(validation.errors.join(', '));
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddLink(newLinkCandidate as GovernmentLink);
      setSuccessMessage(`Successfully added "${name.trim()}" to the directory!`);
      // Reset form fields
      setName('');
      setUrl('');
      setDepartment('');
      setDescription('');
      setUses('');
      setStateOrUT('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to add link');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 my-8">
      <div className="bg-[#0D1527] rounded-3xl p-6 sm:p-8 border-2 border-sky-500/40 shadow-2xl relative overflow-hidden text-slate-100">
        {/* Accent Banner */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-[#FF9933] to-[#10B981]" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold border border-sky-500/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Add Official Government Link</h3>
              <p className="text-xs text-slate-400">
                Admin Action &bull; Link will appear in the directory immediately
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 text-xs font-semibold self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin Mode Active</span>
          </span>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-200 text-sm flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Portal Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., PM-Kisan Samman Nidhi"
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-700 bg-[#070B14] text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Official URL *
              </label>
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://pmkisan.gov.in"
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-700 bg-[#070B14] text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Government Level *
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-700 bg-[#070B14] text-sm text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="central">Central Government</option>
                <option value="state">State Government</option>
                <option value="ut">Union Territory</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                State or UT {level !== 'central' && '*'}
              </label>
              <select
                disabled={level === 'central'}
                value={stateOrUT}
                onChange={(e) => setStateOrUT(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-700 bg-[#070B14] text-sm text-white focus:ring-2 focus:ring-sky-500 focus:outline-none disabled:opacity-40"
              >
                <option value="">Select State or UT</option>
                <optgroup label="28 States" className="bg-[#070B14] text-white">
                  {ALL_INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="8 Union Territories" className="bg-[#070B14] text-white">
                  {ALL_UNION_TERRITORIES.map((ut) => (
                    <option key={ut} value={ut}>
                      {ut}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-700 bg-[#070B14] text-sm text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Ministry / Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Ministry of Agriculture"
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-700 bg-[#070B14] text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Key Uses (separated by semicolons ;)
              </label>
              <input
                type="text"
                value={uses}
                onChange={(e) => setUses(e.target.value)}
                placeholder="Check installment; e-KYC; Beneficiary status"
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-700 bg-[#070B14] text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of the services provided by this official portal..."
              className="w-full p-3 rounded-xl border border-slate-700 bg-[#070B14] text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-[#2478FF] hover:bg-[#1f66da] text-white text-sm font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Adding Link…' : 'Add Link to Directory'}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
