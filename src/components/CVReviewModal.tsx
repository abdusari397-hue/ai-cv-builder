'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Lightbulb, Star, Pencil, Wand2, Loader2 } from 'lucide-react';
import { getTranslation, Language } from '@/lib/i18n/translations';
interface CVReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onAutoFix: () => Promise<void>;
  language: Language;
  results: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  } | null;
}

export default function CVReviewModal({ isOpen, onClose, onEdit, onAutoFix, language, results }: CVReviewModalProps) {
  const [isAutoFixing, setIsAutoFixing] = useState(false);
  const [autoFixDone, setAutoFixDone] = useState(false);

  if (!isOpen) return null;

  const t = getTranslation(language);
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const handleAutoFix = async () => {
    setIsAutoFixing(true);
    try {
      await onAutoFix();
      setAutoFixDone(true);
    } catch {
      // Error handled in parent
    } finally {
      setIsAutoFixing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto" dir={dir}>
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Star size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{t.reviewResultsTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 max-h-[60vh] overflow-y-auto">
          {results ? (
            <>
              {/* Score */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-sm font-medium text-slate-500 mb-2">{t.reviewScore}</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-6xl font-extrabold ${
                    results.score >= 8 ? 'text-green-500' :
                    results.score >= 5 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {results.score}
                  </span>
                  <span className="text-2xl text-slate-400 font-medium">/10</span>
                </div>
                {/* Score bar */}
                <div className="w-full mt-4 bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      results.score >= 8 ? 'bg-green-500' :
                      results.score >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(results.score / 10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Strengths */}
              {results.strengths?.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-3">
                    <CheckCircle2 className="text-green-500" size={20} />
                    {t.reviewStrengths}
                  </h3>
                  <ul className="space-y-2">
                    {results.strengths.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-700 bg-green-50 p-3 rounded-lg border border-green-100">
                        <span className="text-green-500 font-bold mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {results.weaknesses?.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-3">
                    <AlertTriangle className="text-yellow-500" size={20} />
                    {t.reviewWeaknesses}
                  </h3>
                  <ul className="space-y-2">
                    {results.weaknesses.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-700 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                        <span className="text-yellow-500 font-bold mt-0.5">!</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {results.suggestions?.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-3">
                    <Lightbulb className="text-indigo-500" size={20} />
                    {t.reviewSuggestions}
                  </h3>
                  <ul className="space-y-2">
                    {results.suggestions.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-700 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                        <span className="text-indigo-500 font-bold mt-0.5">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Auto-fix success banner */}
              {autoFixDone && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-green-600 shrink-0" />
                  {t.autoFixSuccess}
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-center items-center py-10">
              <p className="text-slate-500">{t.reviewFailed}</p>
            </div>
          )}
        </div>

        {/* Footer — three buttons */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-indigo-400 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors"
            >
              <Pencil size={16} />
              {t.editCV}
            </button>
            {results && !autoFixDone && (
              <button
                onClick={handleAutoFix}
                disabled={isAutoFixing}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-sm disabled:opacity-70"
              >
                {isAutoFixing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {t.autoFixing}
                  </>
                ) : (
                  <>
                    <Wand2 size={16} />
                    {t.autoFixBtn}
                  </>
                )}
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
          >
            {t.closeReview}
          </button>
        </div>

      </div>
    </div>
  );
}
