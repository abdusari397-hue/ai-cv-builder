'use client';

import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import AIInput from './AIInput';
import { Trash2 } from 'lucide-react';
import { getTranslation } from '@/lib/i18n/translations';

export default function EducationField() {
  const { educations, addEducation, updateEducation, removeEducation, language } = useResumeStore();
  const t = getTranslation(language);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900">{t.education}</h3>
        <button 
          onClick={addEducation}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          {t.addEducation}
        </button>
      </div>

      {educations.map((edu) => (
        <div key={edu.id} className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm relative">
          <button 
            onClick={() => removeEducation(edu.id)}
            className="absolute top-4 left-4 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">{t.degree}</label>
              <AIInput
                value={edu.degree}
                onChange={(val) => updateEducation(edu.id, 'degree', val)}
                placeholder={t.degreePlaceholder}
                fieldType={t.degree}
                context={edu.institution ? `${t.contextUniversity} ${edu.institution}` : ''}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">{t.university}</label>
              <AIInput
                value={edu.institution}
                onChange={(val) => updateEducation(edu.id, 'institution', val)}
                placeholder={t.universityPlaceholder}
                fieldType={t.university}
                context={edu.degree ? `${t.contextDegree} ${edu.degree}` : ''}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-900 mb-1">{t.year}</label>
              <input
                type="text"
                value={edu.year}
                onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                placeholder={t.yearPlaceholder}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 bg-white"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
