'use client';

import React from 'react';
import { Mail, MapPin, Phone, Globe } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { getTranslation } from '@/lib/i18n/translations';

export default function DutchCleanTemplate() {
  const {
    fullName, jobTitle, email, phone, location, houseNumber, postalCode,
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
      className={`mx-auto flex flex-col bg-white text-slate-900 shadow-2xl ${language === 'ar' ? 'font-cairo' : 'font-inter'}`}
      style={{ width: '210mm', minHeight: '297mm' }}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <header className="border-t-[14px] border-sky-700 px-12 py-9">
        <div className="flex justify-between gap-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight">{fullName || t.fullName}</h1>
            <p className="mt-2 text-lg font-semibold text-sky-700">{jobTitle || t.position}</p>
          </div>
          <div className="w-72 space-y-1.5 text-[11px] text-slate-600">
            {phone && <p className="flex items-center gap-2" dir="ltr"><Phone size={12} />{phone}</p>}
            {email && <p className="flex items-center gap-2 break-all"><Mail size={12} />{email}</p>}
            {location && <p className="flex items-center gap-2"><MapPin size={12} />{location}{postalCode ? `, ${postalCode}` : ''}{houseNumber ? ` ${houseNumber}` : ''}</p>}
            {portfolio && <p className="flex items-center gap-2 break-all"><Globe size={12} />{portfolio}</p>}
          </div>
        </div>
      </header>

      <main className="grid grid-cols-12 gap-8 px-12 pb-12">
        <section className="col-span-8 space-y-7">
          {summary && (
            <div>
              <h2 className="border-b border-sky-200 pb-2 text-sm font-black uppercase tracking-[0.16em] text-sky-800">{t.summarySection}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{summary}</p>
            </div>
          )}

          {experiences.some(e => e.company || e.position || e.description) && (
            <div>
              <h2 className="border-b border-sky-200 pb-2 text-sm font-black uppercase tracking-[0.16em] text-sky-800">{t.experienceSection}</h2>
              <div className="mt-4 space-y-5">
                {experiences.filter(e => e.company || e.position || e.description).map(exp => (
                  <article key={exp.id}>
                    <div className="flex justify-between gap-4">
                      <h3 className="font-black">{exp.position || t.position}</h3>
                      <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap" dir="ltr">
                        {exp.startDate}{exp.startDate && exp.endDate ? ' - ' : ''}{exp.endDate === '__present__' ? t.present : exp.endDate}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-sky-700">{exp.company || t.company}</p>
                    {exp.description && (
                      <ul className="mt-2 list-disc space-y-1 ps-5 text-[13px] leading-relaxed text-slate-700">
                        {exp.description.split('\n').filter(Boolean).map((line, index) => <li key={index}>{line}</li>)}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="col-span-4 space-y-7 rounded-sm bg-slate-50 p-6">
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.16em] text-sky-800">{t.skillsSection}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill, index) => <span key={index} className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700">{skill}</span>)}
              </div>
            </section>
          )}

          {educations.some(e => e.degree || e.institution) && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.16em] text-sky-800">{t.educationSection}</h2>
              <div className="mt-3 space-y-4">
                {educations.filter(e => e.degree || e.institution).map(edu => (
                  <div key={edu.id}>
                    <h3 className="text-sm font-black">{edu.degree || t.degree}</h3>
                    <p className="text-xs text-slate-600">{edu.institution || t.university}</p>
                    <p className="mt-1 text-[11px] font-bold text-sky-700">{edu.year || t.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(linkedIn || github || spokenLanguages.some(l => l.name)) && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.16em] text-sky-800">{t.linksSection} / {t.spokenLanguages}</h2>
              <div className="mt-3 space-y-2 break-all text-[11px] text-slate-600">
                {linkedIn && <p>LinkedIn: {linkedIn}</p>}
                {github && <p>GitHub: {github}</p>}
                {spokenLanguages.filter(l => l.name).map(lang => <p key={lang.id}>{lang.name}: {levels[lang.level] || lang.level}</p>)}
              </div>
            </section>
          )}
        </aside>
      </main>
    </div>
  );
}
