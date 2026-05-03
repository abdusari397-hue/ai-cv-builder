'use client';

import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { getTranslation } from '@/lib/i18n/translations';

export default function ExecutiveTemplate() {
  const { fullName, jobTitle, email, phone, location, houseNumber, summary, experiences, educations, skills, language, linkedIn, github, portfolio, spokenLanguages, profilePhoto, postalCode } = useResumeStore();
  const t = getTranslation(language);

  const LEVEL_LABELS: Record<string, string> = {
    beginner: t.levelBeginner,
    intermediate: t.levelIntermediate,
    advanced: t.levelAdvanced,
    native: t.levelNative,
  };

  return (
    <div id="cv-print-area" className={`bg-white shadow-2xl mx-auto flex flex-col ${language === 'ar' ? 'font-cairo' : 'font-serif'}`} style={{ width: '210mm', minHeight: '297mm' }} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Header - Executive Navy Blue */}
      <header className="bg-slate-900 text-white p-12 flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-4xl font-light tracking-widest uppercase mb-2 text-slate-100">{fullName || t.fullName}</h1>
          <h2 className="text-xl font-medium tracking-wider text-slate-400 uppercase">{jobTitle || t.position}</h2>
        </div>
        {profilePhoto && (
          <div className="w-28 h-28 rounded-full overflow-hidden shrink-0 border-2 border-slate-500 shadow-xl ml-8 rtl:mr-8 rtl:ml-0">
            <img src={profilePhoto} alt={fullName} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
          </div>
        )}
      </header>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12">
        
        {/* Left Column (Main Content) */}
        <div className="col-span-8 p-10 space-y-8 bg-white border-r border-slate-100 rtl:border-l rtl:border-r-0">
          
          {/* Summary */}
          {summary && (
            <section>
              <h3 className="text-lg font-semibold uppercase tracking-widest text-slate-800 border-b-2 border-slate-800 pb-2 mb-4">{t.summarySection}</h3>
              <p className="text-sm text-slate-700 leading-relaxed text-justify font-sans">{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experiences.length > 0 && experiences.some(e => e.company || e.position || e.description) && (
            <section>
              <h3 className="text-lg font-semibold uppercase tracking-widest text-slate-800 border-b-2 border-slate-800 pb-2 mb-4">{t.experienceSection}</h3>
              <div className="space-y-6">
                {experiences.filter(e => e.company || e.position || e.description).map(exp => (
                  <div key={exp.id} className="relative">
                    <div className="flex justify-between items-end mb-1">
                      <h4 className="font-bold text-slate-900 text-base">{exp.position || t.position}</h4>
                      <span className="text-xs font-semibold text-slate-500 tracking-wider" dir="ltr">
                        {exp.startDate}{exp.startDate && exp.endDate ? ' - ' : ''}{exp.endDate === '__present__' ? t.present : exp.endDate}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-600 mb-2 uppercase tracking-wide">{exp.company || t.company}</div>
                    {exp.description && (
                      <ul className="text-sm text-slate-700 space-y-1.5 font-sans list-disc list-outside ml-4 rtl:mr-4 rtl:ml-0">
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
              <h3 className="text-lg font-semibold uppercase tracking-widest text-slate-800 border-b-2 border-slate-800 pb-2 mb-4">{t.educationSection}</h3>
              <div className="space-y-4">
                {educations.filter(e => e.degree || e.institution).map(edu => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{edu.degree || t.degree}</h4>
                      <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">{edu.institution || t.university}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 tracking-wider">{edu.year || t.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (Sidebar) */}
        <div className="col-span-4 bg-slate-50 p-8 space-y-8">
          
          {/* Contact Details */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 mb-4">{t.contact}</h3>
            <div className="space-y-3 text-xs text-slate-700 font-sans">
              {phone && (
                <div className="flex items-center gap-3">
                  <Phone size={14} className="text-slate-500 shrink-0" />
                  <span dir="ltr">{phone}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-3">
                  <Mail size={14} className="text-slate-500 shrink-0" />
                  <span className="break-all">{email}</span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-3">
                  <MapPin size={14} className="text-slate-500 shrink-0" />
                  <span>{location}{postalCode ? `, ${postalCode}` : ''}{houseNumber ? ` ${houseNumber}` : ''}</span>
                </div>
              )}
              {linkedIn && (
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-slate-500 shrink-0"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  <span className="break-all">{linkedIn}</span>
                </div>
              )}
              {github && (
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-slate-500 shrink-0"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  <span className="break-all">{github}</span>
                </div>
              )}
              {portfolio && (
                <div className="flex items-center gap-3">
                  <Globe size={14} className="text-slate-500 shrink-0" />
                  <span className="break-all">{portfolio}</span>
                </div>
              )}
            </div>
          </section>

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 mb-4">{t.skillsSection}</h3>
              <div className="flex flex-col gap-2 font-sans">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-slate-700">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-none shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {spokenLanguages.length > 0 && spokenLanguages.some(l => l.name) && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 mb-4">{t.spokenLanguages}</h3>
              <div className="space-y-3 font-sans">
                {spokenLanguages.filter(l => l.name).map((lang) => (
                  <div key={lang.id} className="flex justify-between items-baseline border-b border-slate-200 pb-1">
                    <span className="text-xs font-semibold text-slate-800">{lang.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                      {LEVEL_LABELS[lang.level] || lang.level}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
