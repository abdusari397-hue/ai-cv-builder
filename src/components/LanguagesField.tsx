'use client';

import React from 'react';
import { useResumeStore, SpokenLanguage } from '@/store/useResumeStore';
import { Languages, Trash2 } from 'lucide-react';
import { getTranslation } from '@/lib/i18n/translations';

export default function LanguagesField() {
  const { spokenLanguages, addSpokenLanguage, updateSpokenLanguage, removeSpokenLanguage, language } = useResumeStore();
  const t = getTranslation(language);

  const LEVEL_LABELS: Record<SpokenLanguage['level'], string> = {
    beginner: t.levelBeginner,
    intermediate: t.levelIntermediate,
    advanced: t.levelAdvanced,
    native: t.levelNative,
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <Languages className="text-slate-500" size={24} />
        <h2 className="text-xl font-bold text-slate-900">{t.spokenLanguages}</h2>
      </div>

      <div className="space-y-3">
        {spokenLanguages.map((lang) => (
          <div key={lang.id} className="flex items-center gap-3">
            <input
              type="text"
              value={lang.name}
              onChange={(e) => updateSpokenLanguage(lang.id, 'name', e.target.value)}
              placeholder={t.languageName}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 bg-white text-sm"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
            <select
              value={lang.level}
              onChange={(e) => updateSpokenLanguage(lang.id, 'level', e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 bg-white text-sm"
            >
              {(Object.keys(LEVEL_LABELS) as SpokenLanguage['level'][]).map((key) => (
                <option key={key} value={key}>{LEVEL_LABELS[key]}</option>
              ))}
            </select>
            <button
              onClick={() => removeSpokenLanguage(lang.id)}
              className="text-slate-400 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        <button
          onClick={addSpokenLanguage}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          {t.addLanguage}
        </button>
      </div>
    </section>
  );
}
