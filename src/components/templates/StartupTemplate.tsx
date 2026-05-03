'use client';

import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { getTranslation } from '@/lib/i18n/translations';

export default function StartupTemplate() {
  const { fullName, jobTitle, email, phone, location, houseNumber, summary, experiences, educations, skills, language, linkedIn, github, portfolio, spokenLanguages, profilePhoto, postalCode } = useResumeStore();
  const t = getTranslation(language);

  const LEVEL_LABELS: Record<string, string> = {
    beginner: t.levelBeginner,
    intermediate: t.levelIntermediate,
    advanced: t.levelAdvanced,
    native: t.levelNative,
  };

  return (
    <div id="cv-print-area" className={`bg-neutral-950 text-neutral-300 shadow-2xl mx-auto flex flex-col ${language === 'ar' ? 'font-cairo' : 'font-mono'}`} style={{ width: '210mm', minHeight: '297mm' }} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Header - Terminal Style */}
      <header className="p-10 border-b border-neutral-800 bg-neutral-900/50 flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-cyan-500"></div>
        <div className="flex-1">
          <div className="text-emerald-400 font-bold mb-2 flex items-center gap-2 text-sm tracking-widest uppercase">
            <span className="text-cyan-500">{'>'}</span> {t.position}: {jobTitle || t.position}
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">{fullName || t.fullName}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-neutral-400">
            {phone && <span dir="ltr" className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors"><Phone size={12}/>{phone}</span>}
            {email && <span className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors"><Mail size={12}/>{email}</span>}
            {location && <span className="flex items-center gap-1.5"><MapPin size={12}/>{location}{postalCode ? `, ${postalCode}` : ''}{houseNumber ? ` ${houseNumber}` : ''}</span>}
          </div>
        </div>
        {profilePhoto && (
          <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-neutral-700 ml-6 rtl:mr-6 rtl:ml-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <img src={profilePhoto} alt={fullName} className="w-full h-full object-cover object-top" />
          </div>
        )}
      </header>

      <div className="flex-1 grid grid-cols-12">
        {/* Left Column */}
        <div className="col-span-8 p-10 border-r border-neutral-800 rtl:border-l rtl:border-r-0 space-y-10">
          
          {/* Summary */}
          {summary && (
            <section>
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span>[</span> {t.summarySection} <span>]</span>
              </h3>
              <p className="text-sm leading-relaxed text-neutral-300 font-sans">{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experiences.length > 0 && experiences.some(e => e.company || e.position || e.description) && (
            <section>
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span>[</span> {t.experienceSection} <span>]</span>
              </h3>
              <div className="space-y-8">
                {experiences.filter(e => e.company || e.position || e.description).map(exp => (
                  <div key={exp.id} className="relative pl-4 rtl:pr-4 rtl:pl-0 border-l border-neutral-800 rtl:border-r rtl:border-l-0">
                    <span className="absolute top-1.5 -left-[4.5px] rtl:-right-[4.5px] w-2 h-2 bg-emerald-500 rounded-sm"></span>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-white text-base font-sans">{exp.position || t.position}</h4>
                      <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded" dir="ltr">
                        {exp.startDate} - {exp.endDate === '__present__' ? t.present : exp.endDate}
                      </span>
                    </div>
                    <div className="text-sm text-cyan-500 mb-3">{exp.company || t.company}</div>
                    {exp.description && (
                      <ul className="text-sm text-neutral-400 space-y-2 font-sans">
                        {exp.description.split('\n').filter(s => s.trim()).map((line, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-neutral-600 mt-0.5">{'>'}</span>
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

        {/* Right Column */}
        <div className="col-span-4 p-8 space-y-10 bg-neutral-900/30">
          
          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span>[</span> {t.skillsSection} <span>]</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-neutral-800 text-emerald-300 text-[10px] uppercase border border-neutral-700">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {educations.length > 0 && educations.some(e => e.degree || e.institution) && (
            <section>
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span>[</span> {t.educationSection} <span>]</span>
              </h3>
              <div className="space-y-4">
                {educations.filter(e => e.degree || e.institution).map(edu => (
                  <div key={edu.id} className="border border-neutral-800 p-3 bg-neutral-900/50">
                    <h4 className="font-bold text-white text-xs mb-1 font-sans">{edu.degree || t.degree}</h4>
                    <p className="text-[10px] text-neutral-400 mb-2">{edu.institution || t.university}</p>
                    <span className="text-[10px] text-emerald-500">{edu.year || t.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Links */}
          {(linkedIn || github || portfolio) && (
            <section>
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span>[</span> {t.linksSection} <span>]</span>
              </h3>
              <div className="space-y-3 text-xs">
                {linkedIn && (
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-neutral-500"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    <span className="break-all text-neutral-400 hover:text-emerald-300">{linkedIn}</span>
                  </div>
                )}
                {github && (
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-neutral-500"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    <span className="break-all text-neutral-400 hover:text-emerald-300">{github}</span>
                  </div>
                )}
                {portfolio && (
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-neutral-500 shrink-0" />
                    <span className="break-all text-neutral-400 hover:text-emerald-300">{portfolio}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Languages */}
          {spokenLanguages.length > 0 && spokenLanguages.some(l => l.name) && (
            <section>
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span>[</span> {t.spokenLanguages} <span>]</span>
              </h3>
              <div className="space-y-2">
                {spokenLanguages.filter(l => l.name).map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center text-xs">
                    <span className="text-neutral-300 font-bold">{lang.name}</span>
                    <span className="text-neutral-500">[{LEVEL_LABELS[lang.level] || lang.level}]</span>
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
