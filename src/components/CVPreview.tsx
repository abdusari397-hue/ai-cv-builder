'use client';

import React, { useState } from 'react';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import StartupTemplate from './templates/StartupTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import ATSCompactTemplate from './templates/ATSCompactTemplate';
import AcademicTemplate from './templates/AcademicTemplate';
import TechGridTemplate from './templates/TechGridTemplate';
import DutchCleanTemplate from './templates/DutchCleanTemplate';
import ConsultantTemplate from './templates/ConsultantTemplate';
import PortfolioTemplate from './templates/PortfolioTemplate';
import EngineerTemplate from './templates/EngineerTemplate';
import { AlertTriangle, Download, Eye, Loader2 } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { getTranslation } from '@/lib/i18n/translations';

export default function CVPreview() {
  const { language, fullName, templateId, setTemplateId, isCompactMode, setIsCompactMode } = useResumeStore();
  const t = getTranslation(language);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [pageWarning, setPageWarning] = useState<{ pages: number; scale: number } | null>(null);
  const templates = [
    { id: 'modern', label: t.templateModern, category: 'modern' },
    { id: 'classic', label: t.templateClassic, category: 'ats' },
    { id: 'minimal', label: t.templateMinimal, category: 'modern' },
    { id: 'executive', label: t.templateExecutive, category: 'formal' },
    { id: 'creative', label: t.templateCreative, category: 'creative' },
    { id: 'startup', label: t.templateStartup, category: 'tech' },
    { id: 'elegant', label: t.templateElegant, category: 'formal' },
    { id: 'atsCompact', label: t.templateATSCompact, category: 'ats' },
    { id: 'academic', label: t.templateAcademic, category: 'formal' },
    { id: 'techGrid', label: t.templateTechGrid, category: 'tech' },
    { id: 'dutchClean', label: t.templateDutchClean, category: 'ats' },
    { id: 'consultant', label: t.templateConsultant, category: 'formal' },
    { id: 'portfolio', label: t.templatePortfolio, category: 'creative' },
    { id: 'engineer', label: t.templateEngineer, category: 'tech' },
  ];
  const categories = [
    { id: 'all', label: t.templateCategoryAll },
    { id: 'ats', label: t.templateCategoryATS },
    { id: 'modern', label: t.templateCategoryModern },
    { id: 'formal', label: t.templateCategoryFormal },
    { id: 'tech', label: t.templateCategoryTech },
    { id: 'creative', label: t.templateCategoryCreative },
  ];
  const visibleTemplates = activeCategory === 'all'
    ? templates
    : templates.filter((template) => template.category === activeCategory);

  const preparePrintClone = () => {
    const element = document.getElementById('cv-print-area');
    if (!element) return null;

    const existingClone = document.getElementById('cv-print-clone');
    existingClone?.remove();

    const clone = element.cloneNode(true) as HTMLElement;
    clone.id = 'cv-print-clone';
    clone.classList.toggle('cv-compact-print', isCompactMode);
    clone.style.display = 'flex';
    clone.style.position = 'fixed';
    clone.style.left = '-10000px';
    clone.style.top = '0';
    clone.style.width = '210mm';
    clone.style.minHeight = '297mm';
    clone.style.visibility = 'hidden';
    clone.style.transform = 'none';
    document.body.appendChild(clone);

    const a4Probe = document.createElement('div');
    a4Probe.style.position = 'fixed';
    a4Probe.style.width = '210mm';
    a4Probe.style.height = '297mm';
    a4Probe.style.pointerEvents = 'none';
    a4Probe.style.opacity = '0';
    document.body.appendChild(a4Probe);

    const rawPages = Math.max(1, Math.ceil(clone.scrollHeight / a4Probe.offsetHeight));
    const widthScale = a4Probe.offsetWidth / clone.scrollWidth;
    const heightScale = a4Probe.offsetHeight / clone.scrollHeight;
    const printScale = Math.min(1, widthScale, heightScale) * 0.94;
    clone.style.setProperty('--print-scale', String(Math.max(0.58, printScale)));
    clone.style.removeProperty('display');
    clone.style.removeProperty('position');
    clone.style.removeProperty('left');
    clone.style.removeProperty('top');
    clone.style.removeProperty('visibility');
    a4Probe.remove();

    return { clone, rawPages, scale: printScale };
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const prepared = preparePrintClone();
      if (!prepared) return;

      const { clone, rawPages, scale } = prepared;
      if (rawPages > 1 && !isCompactMode) {
        clone.remove();
        setPageWarning({ pages: rawPages, scale });
        return;
      }

      // Set document.title temporarily so the PDF filename matches the language
      const cvLabel = language === 'nl' ? 'CV' : 'السيرة الذاتية';
      const originalTitle = document.title;
      document.title = fullName ? `${fullName} - ${cvLabel}` : cvLabel;

      const cleanup = () => {
        document.title = originalTitle;
        clone.remove();
        window.removeEventListener('afterprint', cleanup);
      };

      window.addEventListener('afterprint', cleanup);
      window.print();
    } catch (error) {
      console.error('PDF Generation Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar relative">
      <div className="sticky top-0 z-40 flex flex-col gap-4 mb-8 bg-slate-100/90 lg:bg-white/90 backdrop-blur-md px-6 py-4 border-b border-slate-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Eye size={20} className="text-indigo-600" />
          {t.livePreview}
        </h2>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-col gap-1.5 w-full max-w-[240px]">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.changeTemplate || 'Change Template'}</label>
              <div className="relative">
                <select
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 pr-8 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm cursor-pointer appearance-none transition-all"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                  {categories.filter(c => c.id !== 'all').map(category => (
                    <optgroup key={category.id} label={category.label}>
                      {templates.filter(temp => temp.category === category.id).map(template => (
                        <option key={template.id} value={template.id}>
                          {template.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <div className={`absolute inset-y-0 ${language === 'ar' ? 'left-0 pl-2' : 'right-0 pr-2'} flex items-center pointer-events-none`}>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2">
            <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm">
              <span>{t.compactMode}</span>
              <input
                type="checkbox"
                checked={isCompactMode}
                onChange={(event) => setIsCompactMode(event.target.checked)}
                className="h-4 w-4 accent-indigo-600"
              />
            </label>
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-black transition-all shadow-md disabled:opacity-70 active:scale-95"
            >
              {isGenerating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              {t.downloadPDF}
            </button>
          </div>
        </div>
        {pageWarning && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-bold">{t.printPageWarningTitle}</p>
              <p className="mt-1 text-xs leading-relaxed">
                {t.printPageWarningBody.replace('{pages}', String(pageWarning.pages))}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setIsCompactMode(true);
                    setPageWarning(null);
                  }}
                  className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700"
                >
                  {t.enableCompactMode}
                </button>
                <button
                  onClick={() => setPageWarning(null)}
                  className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100"
                >
                  {t.dismissWarning}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Zoomed out wrapper for better fit */}
      <div className="w-full flex justify-center pb-24 px-6 pt-2">
        <div className={`w-[210mm] min-h-[297mm] transform scale-[0.40] sm:scale-[0.7] md:scale-[0.9] lg:scale-[0.55] xl:scale-[0.75] 2xl:scale-[0.9] origin-top shadow-2xl transition-all duration-500 rounded-lg overflow-hidden border border-slate-200 bg-white flex-shrink-0 ${isCompactMode ? 'cv-compact-preview' : ''}`}>
          {templateId === 'modern' && <ModernTemplate />}
          {templateId === 'classic' && <ClassicTemplate />}
          {templateId === 'minimal' && <MinimalTemplate />}
          {templateId === 'executive' && <ExecutiveTemplate />}
          {templateId === 'creative' && <CreativeTemplate />}
          {templateId === 'startup' && <StartupTemplate />}
          {templateId === 'elegant' && <ElegantTemplate />}
          {templateId === 'atsCompact' && <ATSCompactTemplate />}
          {templateId === 'academic' && <AcademicTemplate />}
          {templateId === 'techGrid' && <TechGridTemplate />}
          {templateId === 'dutchClean' && <DutchCleanTemplate />}
          {templateId === 'consultant' && <ConsultantTemplate />}
          {templateId === 'portfolio' && <PortfolioTemplate />}
          {templateId === 'engineer' && <EngineerTemplate />}
        </div>
      </div>
    </div>
  );
}
