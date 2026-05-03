'use client';

import React from 'react';
import { X, CheckCircle2, Target, AlertCircle, Lightbulb } from 'lucide-react';
import { getTranslation, Language } from '@/lib/i18n/translations';

interface ATSAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  results: {
    matchScore: number;
    missingKeywords: string[];
    suggestions: string[];
  } | null;
}

export default function ATSAnalysisModal({ isOpen, onClose, language, results }: ATSAnalysisModalProps) {
  if (!isOpen) return null;

  const t = getTranslation(language);
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto" dir={dir}>
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Target size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{t.analyzeJD}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
          {results ? (
            <>
              {/* Score */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <p className="text-sm font-medium text-slate-500 mb-2">{t.matchScore}</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-6xl font-extrabold ${
                    results.matchScore >= 80 ? 'text-green-500' :
                    results.matchScore >= 50 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {results.matchScore}%
                  </span>
                </div>
                {/* Score bar */}
                <div className="w-full mt-4 bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      results.matchScore >= 80 ? 'bg-green-500' :
                      results.matchScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${results.matchScore}%` }}
                  />
                </div>
              </div>

              {/* Missing Keywords */}
              {results.missingKeywords?.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                    <AlertCircle className="text-red-500" size={20} />
                    {t.missingKeywords}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {results.missingKeywords.map((keyword, idx) => (
                      <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-lg text-sm font-medium">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {results.suggestions?.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                    <Lightbulb className="text-indigo-500" size={20} />
                    {t.matchingSuggestions}
                  </h3>
                  <ul className="space-y-3">
                    {results.suggestions.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-700 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <span className="text-indigo-500 font-bold mt-0.5">→</span>
                        <span className="text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-center items-center py-10">
              <p className="text-slate-500">{t.reviewFailed}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
}
