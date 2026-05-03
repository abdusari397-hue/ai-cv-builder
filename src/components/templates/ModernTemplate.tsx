'use client';

import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, User, Globe, Languages } from 'lucide-react';
import { getTranslation } from '@/lib/i18n/translations';

export default function ModernTemplate() {
  const { fullName, jobTitle, email, phone, location, houseNumber, summary, experiences, educations, skills, language, profilePhoto, linkedIn, github, portfolio, spokenLanguages } = useResumeStore();
  const t = getTranslation(language);

  const LEVEL_LABELS: Record<string, string> = {
    beginner: t.levelBeginner,
    intermediate: t.levelIntermediate,
    advanced: t.levelAdvanced,
    native: t.levelNative,
  };

  return (
    <div id="cv-print-area" className={`bg-white shadow-2xl mx-auto flex flex-row ${language === 'ar' ? 'font-cairo' : 'font-inter'}`} style={{ width: '210mm', minHeight: '297mm' }} dir={language === 'ar' ? 'rtl' : 'ltr'}>

      {/* Sidebar */}
      <div className="w-[35%] bg-slate-800 text-white p-8 flex flex-col">
        {/* Profile Photo */}
        <div className="w-32 h-32 rounded-full bg-slate-600 border-4 border-slate-500 mx-auto mb-6 flex items-center justify-center overflow-hidden">
          {profilePhoto ? (
            <img src={profilePhoto} alt={fullName || 'Profile'} className="w-full h-full object-cover object-top" />
          ) : (
            <User size={64} className="text-slate-400" />
          )}
        </div>

        {/* Contact Info */}
        <div className="mb-8">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b-2 border-slate-600 pb-2 mb-4 text-slate-200">{t.contact}</h2>
          <div className="space-y-4 text-sm text-slate-300">
            {phone && (
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-indigo-400 shrink-0" />
                <span dir="ltr">{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-indigo-400 shrink-0" />
                <span className="break-all">{email}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-indigo-400 shrink-0" />
                <span>{location}{houseNumber ? ` ${houseNumber}` : ''}</span>
              </div>
            )}
            {linkedIn && (
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-indigo-400 shrink-0"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                <span className="break-all text-xs">{linkedIn}</span>
              </div>
            )}
            {github && (
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-indigo-400 shrink-0"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <span className="break-all text-xs">{github}</span>
              </div>
            )}
            {portfolio && (
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-indigo-400 shrink-0" />
                <span className="break-all text-xs">{portfolio}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold uppercase tracking-widest border-b-2 border-slate-600 pb-2 mb-4 text-slate-200">{t.skillsSection}</h2>
            <ul className="space-y-2 text-sm text-slate-300">
              {skills.map((skill, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Spoken Languages */}
        {spokenLanguages.length > 0 && spokenLanguages.some(l => l.name) && (
          <div className="mb-8">
            <h2 className="text-lg font-bold uppercase tracking-widest border-b-2 border-slate-600 pb-2 mb-4 text-slate-200">{t.spokenLanguages}</h2>
            <div className="space-y-3 text-sm text-slate-300">
              {spokenLanguages.filter(l => l.name).map((lang) => (
                <div key={lang.id} className="flex justify-between items-center">
                  <span>{lang.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-indigo-300 font-medium">
                    {LEVEL_LABELS[lang.level] || lang.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-[65%] bg-slate-50 p-10 flex flex-col">

        {/* Header */}
        <header className="mb-8 border-b-2 border-slate-200 pb-6">
          <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-wide">{fullName || t.fullName}</h1>
          <h2 className="text-xl font-medium text-indigo-600 uppercase tracking-widest">{jobTitle || t.position}</h2>
        </header>

        {/* Summary */}
        {summary && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <User size={20} className="text-slate-800" />
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wider">{t.summarySection}</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && experiences.some(e => e.company || e.position || e.description) && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase size={20} className="text-slate-800" />
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wider">{t.experienceSection}</h3>
            </div>
            <div className="space-y-6">
              {experiences.filter(e => e.company || e.position || e.description).map(exp => (
                <div key={exp.id} className={`relative ${language === 'ar' ? 'pl-4 pr-4 border-r-2' : 'pr-4 pl-4 border-l-2'} border-indigo-200`}>
                  <span className={`absolute ${language === 'ar' ? '-right-[9px]' : '-left-[9px]'} top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-4 border-slate-50`}></span>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-900 text-lg">{exp.position || t.position}</h4>
                    {(exp.startDate || exp.endDate) && (
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded whitespace-nowrap" dir="ltr">
                        {exp.startDate}{exp.startDate && exp.endDate ? ' — ' : ''}{exp.endDate === '__present__' ? t.present : exp.endDate}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-indigo-600 font-medium mb-2">{exp.company || t.company}</div>
                  {exp.description && (
                    <ul className="text-sm text-slate-700 leading-relaxed space-y-1">
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

        {/* Education */}
        {educations.length > 0 && educations.some(e => e.degree || e.institution) && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap size={20} className="text-slate-800" />
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wider">{t.educationSection}</h3>
            </div>
            <div className="space-y-5">
              {educations.filter(e => e.degree || e.institution).map(edu => (
                <div key={edu.id} className={`relative ${language === 'ar' ? 'pl-4 pr-4 border-r-2' : 'pr-4 pl-4 border-l-2'} border-slate-200`}>
                  <span className={`absolute ${language === 'ar' ? '-right-[9px]' : '-left-[9px]'} top-1.5 w-4 h-4 rounded-full bg-slate-400 border-4 border-slate-50`}></span>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-900">{edu.degree || t.degree}</h4>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{edu.year || t.year}</span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium">{edu.institution || t.university}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
