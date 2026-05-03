import { z } from 'zod';

export const ReviewSchema = z.object({
  score: z.coerce.number().min(1).max(10),
  strengths: z.array(z.string()).min(1),
  weaknesses: z.array(z.string()).min(1),
  suggestions: z.array(z.string()).min(1),
});

export const AutoFixSchema = z.object({
  summary: z.string().optional(),
  experiences: z.array(z.object({
    id: z.string(),
    company: z.string(),
    position: z.string(),
    description: z.string(),
  })).optional(),
  educations: z.array(z.object({
    id: z.string(),
    institution: z.string(),
    degree: z.string(),
    year: z.string(),
  })).optional(),
});

export const ATSMatchSchema = z.object({
  matchScore: z.coerce.number().min(0).max(100),
  missingKeywords: z.array(z.string()),
  suggestions: z.array(z.string()),
});

export const ImprovementSchema = z.object({
  options: z.array(z.object({
    tone: z.enum(['formal', 'strong', 'short', 'ats']),
    text: z.string(),
  })),
});

export const SkillsSchema = z.object({
  skills: z.array(z.string()),
});

export const PlaceholderSchema = z.object({
  company: z.string(),
  position: z.string(),
  experienceDescription: z.string(),
  summary: z.string(),
});

export const SuggestionSchema = z.object({
  suggestion: z.string(),
});
