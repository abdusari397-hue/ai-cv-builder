'use client';

import React, { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { useDynamicPlaceholders } from '@/hooks/useDynamicPlaceholders';
import { useCVCompletion } from '@/hooks/useCVCompletion';
import ExperienceField from '@/components/ExperienceField';
import SummaryField from '@/components/SummaryField';
import EducationField from '@/components/EducationField';
import SkillsField from '@/components/SkillsField';
import PersonalInfoField from '@/components/PersonalInfoField';
import CVPreview from '@/components/CVPreview';
import CVReviewModal from '@/components/CVReviewModal';
import LanguagesField from '@/components/LanguagesField';
import JobDescriptionField from '@/components/JobDescriptionField';
import ATSAnalysisModal from '@/components/ATSAnalysisModal';
import { Sparkles, FileText, Briefcase, UserCircle, GraduationCap, Wrench, User, Globe, Loader2, ShieldCheck, Target, Trash2 } from 'lucide-react';
import { getTranslation, Language } from '@/lib/i18n/translations';

export default function Home() {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [hasHydrated, setHasHydrated] = React.useState(false);

  React.useEffect(() => {
    setHasHydrated(true);
  }, []);

  const {
    jobTitle, setJobTitle, language, setLanguage, fullName,
    summary, setSummary, experiences, educations, skills,
    updateExperience, updateEducation, jobDescription, resetData
  } = useResumeStore();
  const { percentage } = useCVCompletion();
  const t = getTranslation(language);

  const [isATSModalOpen, setIsATSModalOpen] = useState(false);
  const [isAnalyzingJD, setIsAnalyzingJD] = useState(false);
  const [atsResults, setAtsResults] = useState<{
    matchScore: number;
    missingKeywords: string[];
    suggestions: string[];
  } | null>(null);

  const [reviewResults, setReviewResults] = useState<{
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  } | null>(null);

  const handleReviewCV = async () => {
    setIsReviewing(true);
    setReviewResults(null);
    try {
      const cvData = {
        jobTitle,
        summary,
        experiences,
        educations,
        skills
      };

      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData, language })
      });

      if (res.ok) {
        const data = await res.json();
        setReviewResults(data);
        setIsReviewModalOpen(true);
      } else {
        alert(t.reviewFailed);
      }
    } catch (e) {
      console.error(e);
      alert(t.reviewFailed);
    } finally {
      setIsReviewing(false);
    }
  };

  const handleAutoFix = async () => {
    if (!reviewResults) return;

    const cvData = { jobTitle, summary, experiences, educations, skills };
    const reviewFeedback = {
      weaknesses: reviewResults.weaknesses,
      suggestions: reviewResults.suggestions,
    };

    const res = await fetch('/api/autofix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cvData, reviewFeedback, language })
    });

    if (!res.ok) {
      alert(t.autoFixFailed);
      throw new Error('Auto-fix failed');
    }

    const fixed = await res.json();

    // Apply fixes to the store
    if (fixed.summary) {
      setSummary(fixed.summary);
    }
    if (fixed.experiences) {
      for (const exp of fixed.experiences) {
        if (exp.id && exp.description) {
          updateExperience(exp.id, 'description', exp.description);
        }
      }
    }
    if (fixed.educations) {
      for (const edu of fixed.educations) {
        if (edu.id && edu.degree) {
          updateEducation(edu.id, 'degree', edu.degree);
        }
      }
    }
  };

  const handleAnalyzeJD = async () => {
    if (!jobDescription) {
      alert(t.jobDescriptionPlaceholder);
      return;
    }
    setIsAnalyzingJD(true);
    setAtsResults(null);
    try {
      const cvData = { jobTitle, summary, experiences, educations, skills };
      const res = await fetch('/api/ats-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData, jobDescription, language })
      });

      if (res.ok) {
        const data = await res.json();
        setAtsResults(data);
        setIsATSModalOpen(true);
      } else {
        alert(t.reviewFailed);
      }
    } catch (e) {
      console.error(e);
      alert(t.reviewFailed);
    } finally {
      setIsAnalyzingJD(false);
    }
  };

  const handleStartOver = () => {
    if (window.confirm(t.startOverConfirm)) {
      resetData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // تفعيل الاستماع لتغيرات المسمى الوظيفي وجلب الأمثلة الديناميكية
  useDynamicPlaceholders();

  React.useEffect(() => {
    document.title = fullName ? `${fullName} - ${t.appTitle}` : t.appTitle;
  }, [fullName, t.appTitle]);

  if (!hasHydrated) return null;

  return (
    <main className={`flex h-[100dvh] bg-slate-50 w-full overflow-hidden print:h-auto print:overflow-visible ${language === 'ar' ? 'font-cairo' : 'font-inter'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden print:block print:h-auto print:overflow-visible">
        
        {/* Left Form Area */}
        <div id="form-area" className="w-full shrink-0 snap-center lg:w-1/2 h-full relative print:hidden">
          {/* Mobile Swipe Indicator */}
          <div className="lg:hidden absolute bottom-10 z-50 flex justify-center pointer-events-none w-full">
            <a href="#preview-area" className="pointer-events-auto bg-slate-900/90 backdrop-blur text-white px-6 py-3.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-2xl hover:bg-slate-800 transition-all animate-bounce cursor-pointer border border-slate-700/50 shadow-slate-900/20">
              <span>{language === 'ar' ? 'انقر للمعاينة' : 'Click to preview'}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={language === 'ar' ? 'rotate-180' : ''}><path d="m9 18 6-6-6-6"/></svg>
            </a>
          </div>

          <div className="w-full h-full overflow-y-auto p-6 md:p-10 lg:px-10 pb-24 custom-scrollbar">

          <header className={`mb-10 text-center ${language === 'ar' ? 'lg:text-right' : 'lg:text-left'}`}>
          <div className="flex justify-between items-start mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full">
              <Sparkles className="text-indigo-600" size={32} />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Start Over Button */}
              <button
                onClick={handleStartOver}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors shadow-sm border border-red-100"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">{t.startOver}</span>
              </button>

              {/* Language Switcher */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                <Globe size={16} className="text-slate-400 mx-2" />
                <button
                  onClick={() => setLanguage('ar')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${language === 'ar' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  العربية
                </button>
                <button
                  onClick={() => setLanguage('nl')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${language === 'nl' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  Nederlands
                </button>
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            {t.appTitle}
          </h1>
          <p className="text-slate-700 text-lg max-w-2xl">
            {t.appSubtitle}
          </p>
        </header>

        {/* Completion Progress — Sticky */}
        <div className="sticky top-0 z-30 py-4 bg-slate-50/80 backdrop-blur-md -mx-4 px-4 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.completionPercentage}</span>
            <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{percentage}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-700 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-8 pb-20">
          {/* Basic Info Section (Job Title) */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
              <Briefcase className="text-slate-500" size={24} />
              <h2 className="text-xl font-bold text-slate-900">{t.basicInfo}</h2>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">{t.jobTitle}</label>
              <p className="text-xs text-slate-600 mb-3 font-medium">{t.jobTitleHint}</p>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder={t.jobTitlePlaceholder}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </section>

          {/* Personal Info Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <User className="text-slate-500" size={24} />
              <h2 className="text-xl font-bold text-slate-900">{t.personalInfo}</h2>
            </div>
            <PersonalInfoField />
          </section>

          {/* Summary Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <UserCircle className="text-slate-500" size={24} />
              <h2 className="text-xl font-bold text-slate-900">{t.summary}</h2>
            </div>
            <SummaryField />
          </section>

          {/* Experience Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <FileText className="text-slate-500" size={24} />
              <h2 className="text-xl font-bold text-slate-900">{t.experience}</h2>
            </div>
            <ExperienceField />
          </section>

          {/* Education Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <GraduationCap className="text-slate-500" size={24} />
              <h2 className="text-xl font-bold text-slate-900">{t.education}</h2>
            </div>
            <EducationField />
          </section>

          {/* Skills Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <Wrench className="text-slate-500" size={24} />
              <h2 className="text-xl font-bold text-slate-900">{t.skills}</h2>
            </div>
            <SkillsField />
          </section>

          {/* Languages Section */}
          <LanguagesField />

          {/* Job Description & ATS Analysis Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <Target className="text-slate-500" size={24} />
              <h2 className="text-xl font-bold text-slate-900">{t.analyzeJD}</h2>
            </div>
            <JobDescriptionField />
            <div className="mt-6 flex flex-col items-center">
              <button
                onClick={handleAnalyzeJD}
                disabled={isAnalyzingJD || !jobDescription}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md disabled:opacity-50"
              >
                {isAnalyzingJD ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>{t.analyzingJD}</span>
                  </>
                ) : (
                  <>
                    <Target size={20} />
                    <span>{t.analyzeJD}</span>
                  </>
                )}
              </button>
              <p className="mt-3 text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck size={12} />
                {t.reviewCVDisclaimer}
              </p>
            </div>
          </section>

          {/* AI Review Section */}
          <section className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-2xl shadow-xl text-white text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full -ml-12 -mb-12 blur-xl" />
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-3">{t.reviewCVBtn}</h2>
              <p className="text-indigo-100 mb-8 max-w-lg mx-auto leading-relaxed">
                {t.appSubtitle}
              </p>
              <button
                onClick={handleReviewCV}
                disabled={isReviewing}
                className="inline-flex items-center gap-3 px-10 py-4 bg-white text-indigo-700 font-extrabold rounded-2xl hover:bg-indigo-50 transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isReviewing ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    <span>{t.reviewingCV}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={22} />
                    <span>{t.reviewCVBtn}</span>
                  </>
                )}
              </button>
              <div className="mt-4 flex items-center justify-center gap-2 text-indigo-200 text-xs">
                <ShieldCheck size={14} />
                <span>{t.reviewCVDisclaimer}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-500 pb-8 border-t border-slate-200 pt-8">
          <p>جميع الحقوق محفوظة لـ abdulbaki alsari &copy; {new Date().getFullYear()}</p>
        </footer>
        </div>
      </div>

      {/* Right Preview Area */}
      <div id="preview-area" className="w-full shrink-0 snap-center lg:w-1/2 h-full bg-slate-200 lg:bg-white border-s border-slate-200 relative print:w-full print:border-none print:bg-white print:block print:h-auto print:overflow-visible">
          {/* Mobile Swipe Indicator (Back) */}
          <div className="lg:hidden absolute bottom-10 z-50 flex justify-center pointer-events-none w-full print:hidden">
            <a href="#form-area" className="pointer-events-auto bg-indigo-600/90 hover:bg-indigo-700 backdrop-blur text-white px-6 py-3.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-2xl cursor-pointer transition-all border border-indigo-500/50 shadow-indigo-900/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={language === 'ar' ? '' : 'rotate-180'}><path d="m15 18-6-6 6-6"/></svg>
              <span>{language === 'ar' ? 'انقر للتعديل' : 'Click to edit'}</span>
            </a>
          </div>

        <div className="w-full h-full overflow-y-auto pb-32 lg:pb-10 custom-scrollbar print:pb-0 print:h-auto print:overflow-visible">
          <CVPreview />
        </div>
      </div>
    </div>

      {/* Modal */}
      <CVReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onEdit={() => {
          setIsReviewModalOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onAutoFix={handleAutoFix}
        language={language}
        results={reviewResults}
      />

      <ATSAnalysisModal
        isOpen={isATSModalOpen}
        onClose={() => setIsATSModalOpen(false)}
        language={language}
        results={atsResults}
      />
    </main>
  );
}
