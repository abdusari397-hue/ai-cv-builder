'use client';

import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { getTranslation } from '@/lib/i18n/translations';

export default function PortfolioTemplate() {
  const {
    fullName, jobTitle, email, phone, location, houseNumber, postalCode,
    summary, experiences, educations, skills, language, linkedIn, github,
    portfolio, spokenLanguages, profilePhoto,
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
      className={`mx-auto flex bg-[#f7f7fb] text-slate-900 shadow-2xl ${language === 'ar' ? 'font-cairo' : 'font-inter'}`}
      style={{ width: '210mm', minHeight: '297mm' }}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <aside className="w-[32%] bg-[#22223b] p-8 text-white">
        {profilePhoto && (
          <div className="mb-7 h-32 w-32 overflow-hidden rounded-full border-4 border-white/15">
            <img src={profilePhoto} alt={fullName} className="h-full w-full object-cover" />
          </div>
        )}
        <h1 className="text-3xl font-black leading-tight">{fullName || t.fullName}</h1>
        <p className="mt-3 text-sm font-bold uppercase tracking-[0.2em] text-[#f2cc8f]">{jobTitle || t.position}</p>

        <div className="mt-8 space-y-3 text-xs text-white/80">
          {phone && <p className="flex items-center gap-2" dir="ltr"><Phone size={13} />{phone}</p>}
          {email && <p className="flex items-center gap-2 break-all"><Mail size={13} />{email}</p>}
          {location && <p className="flex items-center gap-2"><MapPin size={13} />{location}{postalCode ? `, ${postalCode}` : ''}{houseNumber ? ` ${houseNumber}` : ''}</p>}
          {portfolio && <p className="break-all">Portfolio: {portfolio}</p>}
          {linkedIn && <p className="break-all">LinkedIn: {linkedIn}</p>}
          {github && <p className="break-all">GitHub: {github}</p>}
        </div>

        {skills.length > 0 && (
          <section className="mt-9">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#f2cc8f]">{t.skillsSection}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill, index) => <span key={index} className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold">{skill}</span>)}
            </div>
          </section>
        )}
      </aside>

      <main className="flex-1 p-10">
        {summary && (
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#4a4e69]">{t.summarySection}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{summary}</p>
          </section>
        )}

        {experiences.some(e => e.company || e.position || e.description) && (
          <section className="mt-7">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#4a4e69]">{t.experienceSection}</h2>
            <div className="mt-4 space-y-4">
              {experiences.filter(e => e.company || e.position || e.description).map(exp => (
                <article key={exp.id} className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex justify-between gap-4">
                    <h3 className="text-lg font-black">{exp.position || t.position}</h3>
                    <span className="text-[11px] font-bold text-[#9a8c98] whitespace-nowrap" dir="ltr">
                      {exp.startDate}{exp.startDate && exp.endDate ? ' - ' : ''}{exp.endDate === '__present__' ? t.present : exp.endDate}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-[#c26a5a]">{exp.company || t.company}</p>
                  {exp.description && (
                    <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed text-slate-700">
                      {exp.description.split('\n').filter(Boolean).map((line, index) => <li key={index}>• {line}</li>)}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="mt-7 grid grid-cols-2 gap-5">
          {educations.some(e => e.degree || e.institution) && (
            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#4a4e69]">{t.educationSection}</h2>
              <div className="mt-3 space-y-3 text-[12px]">
                {educations.filter(e => e.degree || e.institution).map(edu => <p key={edu.id}><strong>{edu.degree || t.degree}</strong><br />{edu.institution || t.university}<br /><span className="text-[#c26a5a]">{edu.year || t.year}</span></p>)}
              </div>
            </section>
          )}

          {spokenLanguages.some(l => l.name) && (
            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#4a4e69]">{t.spokenLanguages}</h2>
              <div className="mt-3 space-y-2 text-[12px]">
                {spokenLanguages.filter(l => l.name).map(lang => <p key={lang.id}><strong>{lang.name}</strong> · {levels[lang.level] || lang.level}</p>)}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
