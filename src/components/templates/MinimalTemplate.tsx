'use client';

import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, User, Globe } from 'lucide-react';
import { getTranslation } from '@/lib/i18n/translations';

export default function MinimalTemplate() {
  const { fullName, jobTitle, email, phone, location, houseNumber, summary, experiences, educations, skills, language, linkedIn, github, portfolio, spokenLanguages, profilePhoto } = useResumeStore();
  const t = getTranslation(language);

  const LEVEL_LABELS: Record<string, string> = {
    beginner: t.levelBeginner,
    intermediate: t.levelIntermediate,
    advanced: t.levelAdvanced,
    native: t.levelNative,
  };

  return (
    <div id="cv-print-area" className={`bg-white shadow-2xl mx-auto p-12 flex flex-col gap-10 ${language === 'ar' ? 'font-cairo' : 'font-inter'}`} style={{ width: '210mm', minHeight: '297mm' }} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Header with optional photo */}
      <header className="flex items-center gap-8 border-b-4 border-indigo-600 pb-8">
        {profilePhoto && (
          <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-lg">
            <img src={profilePhoto} alt={fullName} className="w-full h-full object-cover object-top" />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-4xl font-black text-slate-900 mb-1">{fullName || t.fullName}</h1>
          <p className="text-xl font-medium text-indigo-600 tracking-wide uppercase">{jobTitle || t.position}</p>
        </div>
        <div className="text-right text-sm text-slate-500 space-y-1">
          {phone && <p dir="ltr">{phone}</p>}
          {email && <p>{email}</p>}
          {location && <p>{location}</p>}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        {/* Left Column (Main) */}
        <div className="col-span-8 space-y-10">
          {/* Summary */}
          {summary && (
            <section>
              <h3 className="text-lg font-black text-slate-900 uppercase border-b-2 border-slate-100 mb-4 pb-1">{t.summarySection}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experiences.length > 0 && experiences.some(e => e.company || e.position || e.description) && (
            <section>
              <h3 className="text-lg font-black text-slate-900 uppercase border-b-2 border-slate-100 mb-4 pb-1">{t.experienceSection}</h3>
              <div className="space-y-8">
                {experiences.filter(e => e.company || e.position || e.description).map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-900">{exp.position || t.position}</h4>
                      <span className="text-xs font-bold text-slate-400" dir="ltr">
                        {exp.startDate} — {exp.endDate === '__present__' ? t.present : exp.endDate}
                      </span>
                    </div>
                    <div className="text-sm text-indigo-600 font-semibold mb-3">{exp.company || t.company}</div>
                    {exp.description && (
                      <ul className="text-sm text-slate-600 space-y-2">
                        {exp.description.split('\n').filter(s => s.trim()).map((line, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-indigo-400 mt-1 shrink-0">•</span>
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

        {/* Right Column (Sidebar) */}
        <div className="col-span-4 space-y-10">
          {/* Education */}
          {educations.length > 0 && educations.some(e => e.degree || e.institution) && (
            <section>
              <h3 className="text-sm font-black text-slate-900 uppercase mb-4">{t.educationSection}</h3>
              <div className="space-y-4">
                {educations.filter(e => e.degree || e.institution).map(edu => (
                  <div key={edu.id}>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{edu.degree || t.degree}</h4>
                    <p className="text-[10px] text-slate-500">{edu.institution || t.university}</p>
                    <p className="text-[10px] font-bold text-indigo-600">{edu.year || t.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h3 className="text-sm font-black text-slate-900 uppercase mb-4">{t.skillsSection}</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-[10px] font-medium uppercase tracking-tighter">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Links */}
          {(linkedIn || github || portfolio) && (
            <section>
              <h3 className="text-sm font-black text-slate-900 uppercase mb-4">{t.linksSection}</h3>
              <div className="space-y-2 text-[10px] text-slate-500 break-all font-medium">
                {linkedIn && <p>LinkedIn: {linkedIn}</p>}
                {github && <p>GitHub: {github}</p>}
                {portfolio && <p>Portfolio: {portfolio}</p>}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
