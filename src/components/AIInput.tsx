'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { getTranslation } from '@/lib/i18n/translations';

interface AIInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  fieldType: string; // e.g. "Company Name" or "University"
  type?: string;
  dir?: 'rtl' | 'ltr';
  context?: string; // Additional context for the AI
}

export default function AIInput({ value, onChange, placeholder, fieldType, type = 'text', dir, context = '' }: AIInputProps) {
  const { jobTitle, language } = useResumeStore();
  const t = getTranslation(language);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSuggest = async () => {
    if (!jobTitle) {
      alert(t.aiFillMissingContext);
      return;
    }

    setIsSuggesting(true);
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, fieldType, context, language }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.suggestion) {
          onChange(data.suggestion);
        }
      }
    } catch (error) {
      console.error('Error fetching suggestion:', error);
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="relative flex items-center">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${language === 'ar' ? 'pl-10 pr-3' : 'pr-10 pl-3'} py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 bg-white font-medium`}
        dir={dir || (language === 'ar' ? 'rtl' : 'ltr')}
      />
      <button
        type="button"
        onClick={handleSuggest}
        disabled={isSuggesting}
        className={`absolute ${language === 'ar' ? 'left-2' : 'right-2'} p-1.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors disabled:opacity-50`}
        title={t.aiMagicFillTitle}
      >
        {isSuggesting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
      </button>
    </div>
  );
}
