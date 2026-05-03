'use client';

import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { getTranslation } from '@/lib/i18n/translations';

export default function ATSCompactTemplate() {
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

  const contact = [
    phone,
    email,
    [location, postalCode, houseNumber].filter(Boolean).join(', '),
    linkedIn && `LinkedIn: ${linkedIn}`,
    github && `GitHub: ${github}`,
    portfolio && `Portfolio: ${portfolio}`,
  ].filter(Boolean);

  return (
    <div
      id="cv-print-area"
      className={`bg-white text-black mx-auto shadow-2xl p-10 ${language === 'ar' ? 'font-cairo' : 'font-serif'}`}
      style={{ width: '210mm', minHeight: '297mm' }}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <header className="text-center pb-4 border-b border-black">
        <h1 className="text-3xl font-bold uppercase tracking-wide">{fullName || t.fullName}</h1>
        <p className="text-sm mt-1 uppercase tracking-[0.18em]">{jobTitle || t.position}</p>
        <p className="text-[11px] mt-3 leading-relaxed">{contact.join(' | ')}</p>
      </header>

      <main className="mt-6 space-y-5 text-[12px] leading-snug">
        {summary && (
          <section>
            <h2 className="text-[13px] font-bold uppercase border-b border-black mb-2">{t.summarySection}</h2>
            <p>{summary}</p>
          </section>
        )}

        {experiences.some(e => e.company || e.position || e.description) && (
          <section>
            <h2 className="text-[13px] font-bold uppercase border-b border-black mb-2">{t.experienceSection}</h2>
            <div className="space-y-4">
              {experiences.filter(e => e.company || e.position || e.description).map(exp => (
                <article key={exp.id}>
                  <div className="flex justify-between gap-4 font-bold">
                    <span>{exp.position || t.position}, {exp.company || t.company}</span>
                    <span className="whitespace-nowrap" dir="ltr">
                      {exp.startDate}{exp.startDate && exp.endDate ? ' - ' : ''}{exp.endDate === '__present__' ? t.present : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <ul className="list-disc ps-5 mt-1 space-y-1">
                      {exp.description.split('\n').filter(Boolean).map((line, index) => (
                        <li key={index}>{line}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {educations.some(e => e.degree || e.institution) && (
          <section>
            <h2 className="text-[13px] font-bold uppercase border-b border-black mb-2">{t.educationSection}</h2>
            <div className="space-y-2">
              {educations.filter(e => e.degree || e.institution).map(edu => (
                <div key={edu.id} className="flex justify-between gap-4">
                  <span><strong>{edu.degree || t.degree}</strong>, {edu.institution || t.university}</span>
                  <span className="whitespace-nowrap">{edu.year || t.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="text-[13px] font-bold uppercase border-b border-black mb-2">{t.skillsSection}</h2>
            <p>{skills.join(' | ')}</p>
          </section>
        )}

        {spokenLanguages.some(l => l.name) && (
          <section>
            <h2 className="text-[13px] font-bold uppercase border-b border-black mb-2">{t.spokenLanguages}</h2>
            <p>{spokenLanguages.filter(l => l.name).map(l => `${l.name} (${levelLabels[l.level] || l.level})`).join(' | ')}</p>
          </section>
        )}
      </main>
    </div>
  );
}
