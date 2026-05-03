'use client';

import React, { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Sparkles, X, Plus, Loader2 } from 'lucide-react';
import { getTranslation } from '@/lib/i18n/translations';

export default function SkillsField() {
  const { skills, addSkill, removeSkill, jobTitle, language } = useResumeStore();
  const t = getTranslation(language);
  const [newSkill, setNewSkill] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  const handleSuggestSkills = async () => {
    if (!jobTitle.trim()) {
      setError(t.suggestSkillsError);
      return;
    }

    setIsSuggesting(true);
    setError('');
    
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, language }),
      });

      if (!res.ok) throw new Error(t.fetchSkillsFailed);
      
      const data = await res.json();
      setSuggestions(data.options || data.skills || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.unexpectedError);
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="space-y-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900">{t.skills}</h3>
        <button 
          onClick={handleSuggestSkills}
          disabled={isSuggesting}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {isSuggesting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {t.suggestSkillsAI}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {suggestions.length > 0 && (
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
          <p className="text-sm text-indigo-800 font-medium mb-3">{t.aiSuggestionsFor} ({jobTitle}):</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug, i) => {
              const isAdded = skills.includes(sug);
              return (
                <button
                  key={i}
                  disabled={isAdded}
                  onClick={() => addSkill(sug)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-full transition-colors ${isAdded ? 'bg-indigo-200 text-indigo-400 cursor-not-allowed' : 'bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100'}`}
                >
                  <Plus size={14} />
                  {sug}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <form onSubmit={handleAddSkill} className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder={t.addSkillPlaceholder}
          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 bg-white"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />
        <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors text-sm font-medium">
          {t.addBtn}
        </button>
      </form>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-800 rounded-lg text-sm font-medium border border-slate-200">
              {skill}
              <button onClick={() => removeSkill(skill)} className="text-slate-400 hover:text-red-500 transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
