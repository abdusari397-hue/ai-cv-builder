'use client';

import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { getTranslation } from '@/lib/i18n/translations';
import { FileSearch } from 'lucide-react';

export default function JobDescriptionField() {
  const { jobDescription, setJobDescription, language } = useResumeStore();
  const t = getTranslation(language);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <FileSearch className="text-slate-500" size={20} />
        <label className="text-sm font-bold text-slate-900">
          {t.jobDescriptionLabel}
        </label>
      </div>
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder={t.jobDescriptionPlaceholder}
        className="w-full h-40 px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium resize-none text-sm"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      />
    </div>
  );
}
