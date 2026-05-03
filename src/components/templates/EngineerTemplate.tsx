'use client';

import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { getTranslation } from '@/lib/i18n/translations';

export default function EngineerTemplate() {
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

  return (
    <div
      id="cv-print-area"
      className={`mx-auto bg-white text-slate-900 shadow-2xl ${language === 'ar' ? 'font-cairo' : 'font-mono'}`}
      style={{ width: '210mm', minHeight: '297mm' }}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <header className="border-b border-slate-300 px-10 py-8">
        <div className="flex items-end justify-between gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">{t.engineerTagline}</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">{fullName || t.fullName}</h1>
            <p className="mt-2 text-sm font-bold uppercase text-slate-600">{jobTitle || t.position}</p>
          </div>
          <div className="w-72 text-[10px] leading-relaxed text-slate-600">
            <p>{phone} {email ? ` | ${email}` : ''}</p>
            <p>{location}{postalCode ? `, ${postalCode}` : ''}{houseNumber ? ` ${houseNumber}` : ''}</p>
            {github && <p className="break-all">GitHub: {github}</p>}
            {linkedIn && <p className="break-all">LinkedIn: {linkedIn}</p>}
            {portfolio && <p className="break-all">Portfolio: {portfolio}</p>}
          </div>
        </div>
      </header>

      <main className="grid grid-cols-12 gap-6 px-10 py-8">
        <section className="col-span-8 space-y-6">
          {summary && (
            <div className="border-l-4 border-emerald-600 pl-4 rtl:border-r-4 rtl:border-l-0 rtl:pr-4 rtl:pl-0">
              <h2 className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-700">{t.summarySection}</h2>
              <p className="font-sans text-sm leading-relaxed text-slate-700">{summary}</p>
            </div>
          )}

          {experiences.some(e => e.company || e.position || e.description) && (
            <section>
              <h2 className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-emerald-700">{t.experienceSection}</h2>
              <div className="space-y-4">
                {experiences.filter(e => e.company || e.position || e.description).map(exp => (
                  <article key={exp.id} className="border border-slate-200 p-4">
                    <div className="flex justify-between gap-4">
                      <h3 className="font-sans text-lg font-black">{exp.position || t.position}</h3>
                      <span className="text-[10px] font-bold text-emerald-700 whitespace-nowrap" dir="ltr">
                        {exp.startDate}{exp.startDate && exp.endDate ? ' - ' : ''}{exp.endDate === '__present__' ? t.present : exp.endDate}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-bold text-slate-500">{exp.company || t.company}</p>
                    {exp.description && (
                      <ul className="mt-3 space-y-1.5 font-sans text-[13px] leading-relaxed text-slate-700">
                        {exp.description.split('\n').filter(Boolean).map((line, index) => <li key={index}><span className="font-mono text-emerald-700">{'>'}</span> {line}</li>)}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
        </section>

        <aside className="col-span-4 space-y-5">
          {skills.length > 0 && (
            <section className="bg-slate-950 p-5 text-white">
              <h2 className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">{t.skillsSection}</h2>
              <div className="mt-4 space-y-2">
                {skills.map((skill, index) => <p key={index} className="border-b border-white/10 pb-1 text-[11px]">{t.skillPrefix} {index + 1}: {skill}</p>)}
              </div>
            </section>
          )}

          {educations.some(e => e.degree || e.institution) && (
            <section className="border border-slate-200 p-5">
              <h2 className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">{t.educationSection}</h2>
              <div className="mt-3 space-y-3 text-[12px]">
                {educations.filter(e => e.degree || e.institution).map(edu => <p key={edu.id}><strong>{edu.degree || t.degree}</strong><br />{edu.institution || t.university}<br /><span className="text-emerald-700">{edu.year || t.year}</span></p>)}
              </div>
            </section>
          )}

          {spokenLanguages.some(l => l.name) && (
            <section className="border border-slate-200 p-5">
              <h2 className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">{t.spokenLanguages}</h2>
              <div className="mt-3 space-y-2 text-[12px]">
                {spokenLanguages.filter(l => l.name).map(lang => <p key={lang.id}>{lang.name}: {levels[lang.level] || lang.level}</p>)}
              </div>
            </section>
          )}
        </aside>
      </main>
    </div>
  );
}
