// src/hooks/useDynamicPlaceholders.ts

import { useEffect, useRef } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { getTranslation } from '@/lib/i18n/translations';

export function useDynamicPlaceholders() {
  const { jobTitle, language, setPlaceholders } = useResumeStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const t = getTranslation(language);

    if (!jobTitle || jobTitle.trim().length < 3) {
      // Revert to default translated placeholders if job title is cleared
      setPlaceholders({
        company: t.defaultCompanyPlaceholder,
        position: t.defaultPositionPlaceholder,
        experienceDescription: t.defaultExpDescPlaceholder,
        summary: t.defaultSummaryPlaceholder,
      });
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/placeholders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobTitle, language }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.company && data.position) {
            setPlaceholders({
              company: data.company,
              position: data.position,
              experienceDescription: data.experienceDescription,
              summary: data.summary,
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch placeholders:', error);
      }
    }, 1000); // 1-second debounce

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [jobTitle, language, setPlaceholders]);
}
