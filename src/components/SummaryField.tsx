'use client';

import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import AIAssistant from './AIAssistant';
import { getTranslation } from '@/lib/i18n/translations';

export default function SummaryField() {
  const { summary, setSummary, jobTitle, placeholders, language } = useResumeStore();
  const t = getTranslation(language);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t.summary}</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder={placeholders.summary}
          rows={5}
          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none text-slate-900 leading-relaxed"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />

        <div className="mt-3">
          <AIAssistant
            currentText={summary}
            section="summary"
            jobTitle={jobTitle}
            onSelect={(newText) => setSummary(newText)}
          />
        </div>
      </div>
    </div>
  );
}
