'use client';

import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { getTranslation } from '@/lib/i18n/translations';

export default function ConsultantTemplate() {
  const {
    fullName, jobTitle, email, phone, location, postalCode, houseNumber,
    summary, experiences, educations, skills, language, linkedIn, github,
    portfolio, spokenLanguages,
  } = useResumeStore();
  const t = getTranslation(language);

  const levels: Record<string, string> = {
    beginner: t.levelBeginner,
    intermediate: t.levelIntermediate,
    advanced: t.levelAdvanced,
    native: t.levelNative,
  };

  const contact = [phone, email, [location, postalCode, houseNumber].filter(Boolean).join(', '), linkedIn, github, portfolio].filter(Boolean);

  return (
    <div
      id="cv-print-area"
      className={`mx-auto bg-white text-zinc-950 shadow-2xl ${language === 'ar' ? 'font-cairo' : 'font-sans'}`}
      style={{ width: '210mm', minHeight: '297mm' }}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <header className="px-12 py-10">
        <div className="border-b-4 border-zinc-950 pb-6">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.35em] text-zinc-500">{jobTitle || t.position}</p>
          <h1 className="text-5xl font-black uppercase tracking-tight">{fullName || t.fullName}</h1>
          <p className="mt-4 text-[11px] leading-relaxed text-zinc-600">{contact.join(' / ')}</p>
        </div>
      </header>

      <main className="px-12 pb-12">
        {summary && (
          <section className="grid grid-cols-12 gap-8 border-b border-zinc-200 py-5">
            <h2 className="col-span-3 text-xs font-black uppercase tracking-[0.2em]">{t.summarySection}</h2>
            <p className="col-span-9 text-sm leading-relaxed text-zinc-700">{summary}</p>
          </section>
        )}

        {experiences.some(e => e.company || e.position || e.description) && (
          <section className="grid grid-cols-12 gap-8 border-b border-zinc-200 py-5">
            <h2 className="col-span-3 text-xs font-black uppercase tracking-[0.2em]">{t.experienceSection}</h2>
            <div className="col-span-9 space-y-5">
              {experiences.filter(e => e.company || e.position || e.description).map(exp => (
                <article key={exp.id}>
                  <div className="flex justify-between gap-4">
                    <h3 className="font-black">{exp.position || t.position}</h3>
                    <span className="text-[11px] font-bold text-zinc-500 whitespace-nowrap" dir="ltr">
                      {exp.startDate}{exp.startDate && exp.endDate ? ' - ' : ''}{exp.endDate === '__present__' ? t.present : exp.endDate}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-zinc-600">{exp.company || t.company}</p>
                  {exp.description && (
                    <ul className="mt-2 space-y-1 text-[13px] leading-relaxed text-zinc-700">
                      {exp.description.split('\n').filter(Boolean).map((line, index) => <li key={index}>- {line}</li>)}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="grid grid-cols-12 gap-8 py-5">
          <h2 className="col-span-3 text-xs font-black uppercase tracking-[0.2em]">{t.skillsSection}</h2>
          <div className="col-span-9 grid grid-cols-2 gap-6">
            {skills.length > 0 && <p className="text-[13px] leading-relaxed">{skills.join(', ')}</p>}
            {educations.some(e => e.degree || e.institution) && (
              <div className="space-y-3 text-[13px]">
                {educations.filter(e => e.degree || e.institution).map(edu => (
                  <p key={edu.id}><strong>{edu.degree || t.degree}</strong><br />{edu.institution || t.university} · {edu.year || t.year}</p>
                ))}
              </div>
            )}
            {spokenLanguages.some(l => l.name) && (
              <p className="text-[13px] leading-relaxed">
                {spokenLanguages.filter(l => l.name).map(l => `${l.name} (${levels[l.level] || l.level})`).join(', ')}
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
