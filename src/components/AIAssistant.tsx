'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, Check, Plus } from 'lucide-react';
import { ToneType } from '@/lib/ai/prompts';
import { useResumeStore } from '@/store/useResumeStore';
import { getTranslation } from '@/lib/i18n/translations';

interface AIAssistantProps {
  currentText: string;
  section: 'experience' | 'summary';
  jobTitle: string;
  onSelect: (text: string) => void;
}

interface AIOption {
  tone: ToneType;
  text: string;
}

export default function AIAssistant({ currentText, section, jobTitle, onSelect }: AIAssistantProps) {
  const { language } = useResumeStore();
  const t = getTranslation(language);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<AIOption[]>([]);
  const [error, setError] = useState('');

  const TONE_LABELS: Record<ToneType, string> = {
    formal: t.formalTone,
    strong: t.strongTone,
    short: t.shortTone,
    ats: t.atsTone,
  };

  const handleImprove = async () => {
    if (!currentText.trim()) return;

    setIsOpen(true);
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: currentText,
          section,
          jobTitle,
          language: language // Fixed to use actual selected language
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || t.aiConnectFailed);
      }

      const data = await res.json();
      setOptions(data.options || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.unexpectedError);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleImprove}
        disabled={!currentText.trim()}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        <Sparkles size={16} />
        {t.aiImprove}
      </button>
    );
  }

  return (
    <div className="mt-4 p-4 border border-indigo-100 bg-indigo-50/50 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-600" />
          {t.aiSuggestions}
        </h4>
        <button onClick={() => setIsOpen(false)} className="text-xs text-slate-500 hover:text-slate-700">{t.close}</button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8 text-indigo-600">
          <Loader2 className="animate-spin mb-2" size={24} />
          <p className="text-sm">{t.draftingOptions}</p>
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg border border-red-100">{error}</div>
      ) : (
        <div className="space-y-4">
          {options.map((opt, i) => {
            const lines = opt.text.split('\n').map(l => l.replace(/^[-•·]\s*/, '').trim()).filter(Boolean);
            return (
              <div key={i} className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-md">
                    {TONE_LABELS[opt.tone] || opt.tone}
                  </span>
                  <button
                    onClick={() => {
                      onSelect(section === 'summary' ? opt.text : lines.join('\n'));
                      setIsOpen(false);
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {t.useThisText}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lines.map((line, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (section === 'summary') {
                          onSelect(opt.text);
                          setIsOpen(false);
                        } else {
                          const current = currentText.trim();
                          const updated = current ? current + '\n' + line : line;
                          onSelect(updated);
                        }
                      }}
                      className="group flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer text-start"
                    >
                      <Plus size={14} className="text-indigo-400 group-hover:text-indigo-600 shrink-0" />
                      <span>{line}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
