'use client';

import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import AIAssistant from './AIAssistant';
import AIInput from './AIInput';
import { Trash2 } from 'lucide-react';
import { getTranslation } from '@/lib/i18n/translations';

export default function ExperienceField() {
  const { experiences, updateExperience, removeExperience, addExperience, jobTitle, placeholders, language } = useResumeStore();
  const t = getTranslation(language);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">{t.experience}</h3>
        <button
          onClick={addExperience}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          {t.addExperience}
        </button>
      </div>

      {experiences.map((exp, index) => (
        <div key={exp.id} className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm relative">
          <button
            onClick={() => removeExperience(exp.id)}
            className="absolute top-4 left-4 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.position}</label>
              <AIInput
                value={exp.position}
                onChange={(val) => updateExperience(exp.id, 'position', val)}
                placeholder={placeholders.position}
                fieldType={t.position}
                context={exp.company ? `${t.contextCompany} ${exp.company}` : ''}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.company}</label>
              <AIInput
                value={exp.company}
                onChange={(val) => updateExperience(exp.id, 'company', val)}
                placeholder={placeholders.company}
                fieldType={t.company}
                context={exp.position ? `${t.contextPosition} ${exp.position}` : ''}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.startDate}</label>
              <input
                type="text"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                placeholder={t.datePlaceholder}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 bg-white"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.endDate}</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={exp.endDate === '__present__' ? '' : exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  placeholder={t.datePlaceholder}
                  disabled={exp.endDate === '__present__'}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                  dir="ltr"
                />
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 cursor-pointer whitespace-nowrap select-none">
                  <input
                    type="checkbox"
                    checked={exp.endDate === '__present__'}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.checked ? '__present__' : '')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  {t.present}
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.description}</label>
            <textarea
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
              placeholder={placeholders.experienceDescription}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-32 resize-none text-slate-900 bg-white placeholder:text-slate-400"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />

            <div className="mt-3">
              <AIAssistant
                currentText={exp.description}
                section="experience"
                jobTitle={jobTitle}
                onSelect={(newText) => updateExperience(exp.id, 'description', newText)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
