'use client';

import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { getTranslation } from '@/lib/i18n/translations';

export default function CreativeTemplate() {
  const { fullName, jobTitle, email, phone, location, houseNumber, summary, experiences, educations, skills, language, linkedIn, github, portfolio, spokenLanguages, profilePhoto, postalCode } = useResumeStore();
  const t = getTranslation(language);

  const LEVEL_LABELS: Record<string, string> = {
    beginner: t.levelBeginner,
    intermediate: t.levelIntermediate,
    advanced: t.levelAdvanced,
    native: t.levelNative,
  };

  const getLevelPercentage = (level: string) => {
    switch (level) {
      case 'beginner': return '30%';
      case 'intermediate': return '60%';
      case 'advanced': return '85%';
      case 'native': return '100%';
      default: return '50%';
    }
  };

  return (
    <div id="cv-print-area" className={`bg-slate-50 shadow-2xl mx-auto flex flex-col ${language === 'ar' ? 'font-cairo' : 'font-inter'}`} style={{ width: '210mm', minHeight: '297mm' }} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Dynamic Header */}
      <header className="relative bg-gradient-to-r from-violet-600 to-fuchsia-600 p-10 overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10 flex items-center gap-8">
          {profilePhoto && (
            <div className="w-32 h-32 rounded-3xl overflow-hidden shrink-0 border-4 border-white/20 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-300">
              <img src={profilePhoto} alt={fullName} className="w-full h-full object-cover object-top" />
            </div>
          )}
          <div className="text-white flex-1">
            <h1 className="text-5xl font-black tracking-tight mb-2 drop-shadow-md">{fullName || t.fullName}</h1>
            <h2 className="text-xl font-bold tracking-wide text-violet-100 uppercase">{jobTitle || t.position}</h2>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-8 p-10">
        
        {/* Left Column (Main Content) */}
        <div className="col-span-7 space-y-10">
          
          {/* Summary */}
          {summary && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-black uppercase text-violet-600 mb-3 flex items-center gap-2">
                <span className="w-8 h-1 bg-violet-600 rounded-full"></span>
                {t.summarySection}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experiences.length > 0 && experiences.some(e => e.company || e.position || e.description) && (
            <section>
              <h3 className="text-lg font-black uppercase text-violet-600 mb-6 flex items-center gap-2">
                <span className="w-8 h-1 bg-violet-600 rounded-full"></span>
                {t.experienceSection}
              </h3>
              <div className="space-y-6">
                {experiences.filter(e => e.company || e.position || e.description).map((exp, idx) => (
                  <div key={exp.id} className="relative pl-6 rtl:pr-6 rtl:pl-0 border-l-2 rtl:border-r-2 rtl:border-l-0 border-violet-200">
                    <div className="absolute top-0 -left-[9px] rtl:-right-[9px] w-4 h-4 rounded-full bg-white border-4 border-violet-500 shadow-sm"></div>
                    <div className="bg-white p-5 rounded-2xl rounded-tl-none rtl:rounded-tr-none rtl:rounded-tl-2xl shadow-sm border border-slate-100 transition-shadow hover:shadow-md">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-900 text-lg">{exp.position || t.position}</h4>
                        <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-1 rounded-full whitespace-nowrap" dir="ltr">
                          {exp.startDate}{exp.startDate && exp.endDate ? ' - ' : ''}{exp.endDate === '__present__' ? t.present : exp.endDate}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-fuchsia-600 mb-3">{exp.company || t.company}</div>
                      {exp.description && (
                        <ul className="text-sm text-slate-600 space-y-2">
                          {exp.description.split('\n').filter(s => s.trim()).map((line, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-fuchsia-400 mt-1 shrink-0">✦</span>
                              <span className="font-medium">{line}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (Sidebar) */}
        <div className="col-span-5 space-y-8">
          
          {/* Contact Details */}
          <section className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg transform hover:-translate-y-1 transition-transform">
            <h3 className="text-sm font-black uppercase text-fuchsia-400 mb-4 tracking-wider">{t.contact}</h3>
            <div className="space-y-4 text-xs font-medium">
              {phone && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <Phone size={14} className="text-violet-300" />
                  </div>
                  <span dir="ltr">{phone}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <Mail size={14} className="text-violet-300" />
                  </div>
                  <span className="break-all">{email}</span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <MapPin size={14} className="text-violet-300" />
                  </div>
                  <span>{location}{postalCode ? `, ${postalCode}` : ''}{houseNumber ? ` ${houseNumber}` : ''}</span>
                </div>
              )}
              {linkedIn && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-violet-300"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </div>
                  <span className="break-all">{linkedIn}</span>
                </div>
              )}
              {github && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-violet-300"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </div>
                  <span className="break-all">{github}</span>
                </div>
              )}
              {portfolio && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <Globe size={14} className="text-violet-300" />
                  </div>
                  <span className="break-all">{portfolio}</span>
                </div>
              )}
            </div>
          </section>

          {/* Education */}
          {educations.length > 0 && educations.some(e => e.degree || e.institution) && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-black uppercase text-violet-600 mb-4 tracking-wider">{t.educationSection}</h3>
              <div className="space-y-4">
                {educations.filter(e => e.degree || e.institution).map(edu => (
                  <div key={edu.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 text-sm">{edu.degree || t.degree}</h4>
                    <p className="text-xs font-semibold text-slate-500 mt-1">{edu.institution || t.university}</p>
                    <div className="inline-block mt-2 text-[10px] font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-0.5 rounded-full">{edu.year || t.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills (Tags with random creative colors) */}
          {skills.length > 0 && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-black uppercase text-violet-600 mb-4 tracking-wider">{t.skillsSection}</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1.5 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 rounded-lg text-xs font-bold shadow-sm border border-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Languages (Visual Bars) */}
          {spokenLanguages.length > 0 && spokenLanguages.some(l => l.name) && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-black uppercase text-violet-600 mb-4 tracking-wider">{t.spokenLanguages}</h3>
              <div className="space-y-4">
                {spokenLanguages.filter(l => l.name).map((lang) => (
                  <div key={lang.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-800">{lang.name}</span>
                      <span className="text-[10px] font-black text-fuchsia-500">{LEVEL_LABELS[lang.level] || lang.level}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1.5 rounded-full" style={{ width: getLevelPercentage(lang.level) }}></div>
                    </div>
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
