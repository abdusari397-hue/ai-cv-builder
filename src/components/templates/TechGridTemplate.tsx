'use client';

import React from 'react';
import { Mail, MapPin, Phone, Globe } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { getTranslation } from '@/lib/i18n/translations';

export default function TechGridTemplate() {
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
      className={`bg-white text-slate-950 mx-auto shadow-2xl flex flex-col ${language === 'ar' ? 'font-cairo' : 'font-inter'}`}
      style={{ width: '210mm', minHeight: '297mm' }}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <header className="p-10 bg-slate-950 text-white">
        <div className="flex justify-between gap-8">
          <div>
            <p className="text-cyan-300 text-xs font-bold tracking-[0.3em] uppercase mb-3">{jobTitle || t.position}</p>
            <h1 className="text-5xl font-black tracking-tight leading-none">{fullName || t.fullName}</h1>
          </div>
          <div className="w-64 text-[11px] text-slate-300 space-y-2">
            {phone && <p className="flex gap-2 items-center" dir="ltr"><Phone size={12} />{phone}</p>}
            {email && <p className="flex gap-2 items-center break-all"><Mail size={12} />{email}</p>}
            {location && <p className="flex gap-2 items-center"><MapPin size={12} />{location}{postalCode ? `, ${postalCode}` : ''}{houseNumber ? ` ${houseNumber}` : ''}</p>}
            {portfolio && <p className="flex gap-2 items-center break-all"><Globe size={12} />{portfolio}</p>}
          </div>
        </div>
      </header>

      <main className="grid grid-cols-12 gap-8 p-10">
        <section className="col-span-7 space-y-8">
          {summary && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.25em] text-cyan-700 mb-3">{t.summarySection}</h2>
              <p className="text-sm leading-relaxed text-slate-700">{summary}</p>
            </div>
          )}

          {experiences.some(e => e.company || e.position || e.description) && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.25em] text-cyan-700 mb-5">{t.experienceSection}</h2>
              <div className="space-y-5">
                {experiences.filter(e => e.company || e.position || e.description).map(exp => (
                  <article key={exp.id} className="border border-slate-200 p-5">
                    <div className="flex justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-black text-lg">{exp.position || t.position}</h3>
                        <p className="text-sm font-bold text-cyan-700">{exp.company || t.company}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap" dir="ltr">
                        {exp.startDate}{exp.startDate && exp.endDate ? ' - ' : ''}{exp.endDate === '__present__' ? t.present : exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <ul className="space-y-1.5 text-[13px] text-slate-700 leading-relaxed">
                        {exp.description.split('\n').filter(Boolean).map((line, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="text-cyan-600 font-black">/</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="col-span-5 space-y-6">
          {skills.length > 0 && (
            <section className="bg-slate-50 border border-slate-200 p-5">
              <h2 className="text-xs font-black uppercase tracking-[0.25em] text-cyan-700 mb-4">{t.skillsSection}</h2>
              <div className="grid grid-cols-2 gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="bg-white border border-slate-200 px-3 py-2 text-[11px] font-bold text-slate-700">{skill}</span>
                ))}
              </div>
            </section>
          )}

          {educations.some(e => e.degree || e.institution) && (
            <section className="bg-slate-50 border border-slate-200 p-5">
              <h2 className="text-xs font-black uppercase tracking-[0.25em] text-cyan-700 mb-4">{t.educationSection}</h2>
              <div className="space-y-4">
                {educations.filter(e => e.degree || e.institution).map(edu => (
                  <div key={edu.id}>
                    <h3 className="text-sm font-black">{edu.degree || t.degree}</h3>
                    <p className="text-xs text-slate-600">{edu.institution || t.university}</p>
                    <p className="text-[11px] font-bold text-cyan-700 mt-1">{edu.year || t.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(linkedIn || github || spokenLanguages.some(l => l.name)) && (
            <section className="bg-slate-950 text-white p-5">
              <h2 className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300 mb-4">{t.linksSection} / {t.spokenLanguages}</h2>
              <div className="space-y-2 text-[11px] text-slate-300 break-all">
                {linkedIn && <p>LinkedIn: {linkedIn}</p>}
                {github && <p>GitHub: {github}</p>}
                {spokenLanguages.filter(l => l.name).map(lang => (
                  <p key={lang.id}>{lang.name}: {levelLabels[lang.level] || lang.level}</p>
                ))}
              </div>
            </section>
          )}
        </aside>
      </main>
    </div>
  );
}
