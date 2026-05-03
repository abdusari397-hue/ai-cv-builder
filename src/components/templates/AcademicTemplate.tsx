'use client';

import React from 'react';
import { Mail, MapPin, Phone, Globe } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { getTranslation } from '@/lib/i18n/translations';

export default function AcademicTemplate() {
  const {
    fullName, jobTitle, email, phone, location, houseNumber, postalCode,
    summary, experiences, educations, skills, language, linkedIn, github,
    portfolio, spokenLanguages,
  } = useResumeStore();
  const t = getTranslation(language);

  const levelLabels: Record<string, string> = {
    beginner: t.levelBeginner,
    intermediate: t.levelIntermediate,
    advanced: t.levelAdvanced,
    native: t.levelNative,
  };

  return (
    <div
      id="cv-print-area"
      className={`bg-[#fbfaf7] text-stone-900 mx-auto shadow-2xl p-12 ${language === 'ar' ? 'font-cairo' : 'font-serif'}`}
      style={{ width: '210mm', minHeight: '297mm' }}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <header className="border-b-2 border-stone-900 pb-6">
        <p className="text-xs tracking-[0.35em] uppercase text-stone-500 mb-3">{jobTitle || t.position}</p>
        <h1 className="text-4xl font-semibold tracking-wide uppercase">{fullName || t.fullName}</h1>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-5 text-[12px] text-stone-600">
          {phone && <span className="flex gap-2 items-center" dir="ltr"><Phone size={12} />{phone}</span>}
          {email && <span className="flex gap-2 items-center"><Mail size={12} />{email}</span>}
          {location && <span className="flex gap-2 items-center"><MapPin size={12} />{location}{postalCode ? `, ${postalCode}` : ''}{houseNumber ? ` ${houseNumber}` : ''}</span>}
          {portfolio && <span className="flex gap-2 items-center"><Globe size={12} />{portfolio}</span>}
          {linkedIn && <span className="break-all">LinkedIn: {linkedIn}</span>}
          {github && <span className="break-all">GitHub: {github}</span>}
        </div>
      </header>

      <main className="mt-8 grid grid-cols-12 gap-10">
        <div className="col-span-8 space-y-8">
          {summary && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-stone-700 mb-3">{t.summarySection}</h2>
              <p className="text-[13px] leading-relaxed text-stone-700 text-justify">{summary}</p>
            </section>
          )}

          {experiences.some(e => e.company || e.position || e.description) && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-stone-700 mb-4">{t.experienceSection}</h2>
              <div className="space-y-6">
                {experiences.filter(e => e.company || e.position || e.description).map(exp => (
                  <article key={exp.id}>
                    <div className="flex justify-between gap-4">
                      <h3 className="font-bold text-[15px]">{exp.position || t.position}</h3>
                      <span className="text-[11px] text-stone-500 whitespace-nowrap" dir="ltr">
                        {exp.startDate}{exp.startDate && exp.endDate ? ' - ' : ''}{exp.endDate === '__present__' ? t.present : exp.endDate}
                      </span>
                    </div>
                    <p className="text-[13px] italic text-stone-600 mt-1">{exp.company || t.company}</p>
                    {exp.description && (
                      <ul className="list-disc ps-5 mt-2 text-[13px] leading-relaxed text-stone-700 space-y-1">
                        {exp.description.split('\n').filter(Boolean).map((line, index) => <li key={index}>{line}</li>)}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="col-span-4 space-y-8 border-s border-stone-300 ps-6">
          {educations.some(e => e.degree || e.institution) && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-700 mb-4">{t.educationSection}</h2>
              <div className="space-y-4">
                {educations.filter(e => e.degree || e.institution).map(edu => (
                  <div key={edu.id}>
                    <h3 className="text-[13px] font-bold">{edu.degree || t.degree}</h3>
                    <p className="text-[12px] italic text-stone-600">{edu.institution || t.university}</p>
                    <p className="text-[11px] text-stone-500 mt-1">{edu.year || t.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-700 mb-4">{t.skillsSection}</h2>
              <ul className="space-y-1.5 text-[12px] text-stone-700">
                {skills.map((skill, index) => <li key={index} className="border-b border-stone-200 pb-1">{skill}</li>)}
              </ul>
            </section>
          )}

          {spokenLanguages.some(l => l.name) && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-700 mb-4">{t.spokenLanguages}</h2>
              <div className="space-y-2 text-[12px]">
                {spokenLanguages.filter(l => l.name).map(lang => (
                  <p key={lang.id}><strong>{lang.name}</strong> <span className="text-stone-500">({levelLabels[lang.level] || lang.level})</span></p>
                ))}
              </div>
            </section>
          )}
        </aside>
      </main>
    </div>
  );
}
