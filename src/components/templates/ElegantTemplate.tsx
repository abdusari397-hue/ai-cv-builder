'use client';

import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { getTranslation } from '@/lib/i18n/translations';

export default function ElegantTemplate() {
  const { fullName, jobTitle, email, phone, location, houseNumber, summary, experiences, educations, skills, language, linkedIn, github, portfolio, spokenLanguages, profilePhoto, postalCode } = useResumeStore();
  const t = getTranslation(language);

  const LEVEL_LABELS: Record<string, string> = {
    beginner: t.levelBeginner,
    intermediate: t.levelIntermediate,
    advanced: t.levelAdvanced,
    native: t.levelNative,
  };

  return (
    <div id="cv-print-area" className={`bg-[#faf9f6] text-slate-800 shadow-2xl mx-auto flex flex-col p-12 ${language === 'ar' ? 'font-cairo' : 'font-serif'}`} style={{ width: '210mm', minHeight: '297mm' }} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <header className="flex flex-col items-center text-center mb-10">
        {profilePhoto && (
          <div className="w-24 h-24 shrink-0 rounded-full overflow-hidden mb-6 border border-slate-200 shadow-sm">
            <img src={profilePhoto} alt={fullName} className="w-full h-full object-cover grayscale" />
          </div>
        )}
        <h1 className="text-4xl font-normal tracking-widest uppercase text-slate-900 mb-2">{fullName || t.fullName}</h1>
        <h2 className="text-sm tracking-[0.2em] text-amber-700 uppercase mb-4">{jobTitle || t.position}</h2>
        
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-xs text-slate-500 max-w-2xl mx-auto">
          {phone && <span dir="ltr" className="flex items-center gap-1.5"><Phone size={12}/>{phone}</span>}
          {email && <span className="flex items-center gap-1.5"><Mail size={12}/>{email}</span>}
          {location && <span className="flex items-center gap-1.5"><MapPin size={12}/>{location}{postalCode ? `, ${postalCode}` : ''}{houseNumber ? ` ${houseNumber}` : ''}</span>}
          {linkedIn && (
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              {linkedIn}
            </span>
          )}
          {github && (
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              {github}
            </span>
          )}
          {portfolio && <span className="flex items-center gap-1.5"><Globe size={12}/>{portfolio}</span>}
        </div>
        
        {/* Elegant separator */}
        <div className="w-24 h-[1px] bg-amber-700 mt-6 opacity-30"></div>
      </header>

      {/* Two Column Layout Below Header */}
      <div className="grid grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="col-span-8 space-y-8">
          
          {/* Summary */}
          {summary && (
            <section>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-slate-800 mb-4">{t.summarySection}</h3>
              <p className="text-[13px] leading-relaxed text-slate-600 text-justify font-serif">{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experiences.length > 0 && experiences.some(e => e.company || e.position || e.description) && (
            <section>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-slate-800 mb-5">{t.experienceSection}</h3>
              <div className="space-y-6">
                {experiences.filter(e => e.company || e.position || e.description).map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-semibold text-slate-900 text-sm tracking-wide">{exp.position || t.position}</h4>
                      <span className="text-[11px] text-amber-700 italic" dir="ltr">
                        {exp.startDate}{exp.startDate && exp.endDate ? ' — ' : ''}{exp.endDate === '__present__' ? t.present : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[13px] text-slate-500 mb-3">{exp.company || t.company}</div>
                    {exp.description && (
                      <ul className="text-[13px] text-slate-600 space-y-1.5 leading-relaxed font-serif list-none">
                        {exp.description.split('\n').filter(s => s.trim()).map((line, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-amber-700/50 mt-1 shrink-0 text-[10px]">❖</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-span-4 space-y-8">
          
          {/* Education */}
          {educations.length > 0 && educations.some(e => e.degree || e.institution) && (
            <section>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-slate-800 mb-4">{t.educationSection}</h3>
              <div className="space-y-4">
                {educations.filter(e => e.degree || e.institution).map(edu => (
                  <div key={edu.id}>
                    <h4 className="font-semibold text-slate-900 text-sm tracking-wide mb-1">{edu.degree || t.degree}</h4>
                    <p className="text-[12px] text-slate-500 italic mb-1">{edu.institution || t.university}</p>
                    <span className="text-[11px] text-amber-700">{edu.year || t.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-slate-800 mb-4">{t.skillsSection}</h3>
              <ul className="space-y-1.5">
                {skills.map((skill, index) => (
                  <li key={index} className="text-[13px] text-slate-600 font-serif border-b border-slate-200/50 pb-1.5">
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Languages */}
          {spokenLanguages.length > 0 && spokenLanguages.some(l => l.name) && (
            <section>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-slate-800 mb-4">{t.spokenLanguages}</h3>
              <ul className="space-y-2">
                {spokenLanguages.filter(l => l.name).map((lang) => (
                  <li key={lang.id} className="flex flex-col text-[13px] text-slate-600 font-serif">
                    <span className="font-semibold text-slate-800">{lang.name}</span>
                    <span className="text-[11px] text-amber-700 italic">{LEVEL_LABELS[lang.level] || lang.level}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
