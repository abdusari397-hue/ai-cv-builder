'use client';

import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { getTranslation } from '@/lib/i18n/translations';

export default function ClassicTemplate() {
  const { fullName, jobTitle, email, phone, location, houseNumber, summary, experiences, educations, skills, language, linkedIn, github, portfolio, spokenLanguages, postalCode } = useResumeStore();
  const t = getTranslation(language);

  const LEVEL_LABELS: Record<string, string> = {
    beginner: t.levelBeginner,
    intermediate: t.levelIntermediate,
    advanced: t.levelAdvanced,
    native: t.levelNative,
  };

  return (
    <div id="cv-print-area" className={`bg-white shadow-2xl mx-auto p-12 flex flex-col gap-8 ${language === 'ar' ? 'font-cairo' : 'font-serif'}`} style={{ width: '210mm', minHeight: '297mm', color: '#000' }} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <header className="text-center border-b-2 border-black pb-4">
        <h1 className="text-3xl font-bold uppercase mb-1">{fullName || t.fullName}</h1>
        <p className="text-lg font-medium text-slate-800 mb-3">{jobTitle || t.position}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-slate-700">
          {phone && <span dir="ltr" className="flex items-center gap-1"><Phone size={12}/>{phone}</span>}
          {email && <span className="flex items-center gap-1"><Mail size={12}/>{email}</span>}
          {location && <span className="flex items-center gap-1"><MapPin size={12}/>{location}{postalCode ? `, ${postalCode}` : ''}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 mt-1 text-xs text-slate-600">
          {linkedIn && <span>LinkedIn: {linkedIn}</span>}
          {github && <span>GitHub: {github}</span>}
          {portfolio && <span>Web: {portfolio}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section>
          <h3 className="text-sm font-bold uppercase border-b border-black mb-2">{t.summarySection}</h3>
          <p className="text-sm leading-relaxed text-justify">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && experiences.some(e => e.company || e.position || e.description) && (
        <section>
          <h3 className="text-sm font-bold uppercase border-b border-black mb-3">{t.experienceSection}</h3>
          <div className="space-y-4">
            {experiences.filter(e => e.company || e.position || e.description).map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-bold text-sm">{exp.position || t.position}</h4>
                  <span className="text-xs font-medium" dir="ltr">
                    {exp.startDate}{exp.startDate && exp.endDate ? ' - ' : ''}{exp.endDate === '__present__' ? t.present : exp.endDate}
                  </span>
                </div>
                <div className="text-sm italic mb-1.5">{exp.company || t.company}</div>
                {exp.description && (
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    {exp.description.split('\n').filter(s => s.trim()).map((line, i) => (
                      <li key={i} className="leading-snug">{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {educations.length > 0 && educations.some(e => e.degree || e.institution) && (
        <section>
          <h3 className="text-sm font-bold uppercase border-b border-black mb-3">{t.educationSection}</h3>
          <div className="space-y-3">
            {educations.filter(e => e.degree || e.institution).map(edu => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h4 className="font-bold text-sm">{edu.degree || t.degree}</h4>
                  <p className="text-sm italic">{edu.institution || t.university}</p>
                </div>
                <span className="text-xs font-medium">{edu.year || t.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <h3 className="text-sm font-bold uppercase border-b border-black mb-2">{t.skillsSection}</h3>
          <p className="text-sm leading-relaxed">
            {skills.join(' • ')}
          </p>
        </section>
      )}

      {/* Languages */}
      {spokenLanguages.length > 0 && spokenLanguages.some(l => l.name) && (
        <section>
          <h3 className="text-sm font-bold uppercase border-b border-black mb-2">{t.spokenLanguages}</h3>
          <p className="text-sm">
            {spokenLanguages.filter(l => l.name).map(l => `${l.name} (${LEVEL_LABELS[l.level] || l.level})`).join(', ')}
          </p>
        </section>
      )}
    </div>
  );
}
