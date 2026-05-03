// src/store/useResumeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

export interface SpokenLanguage {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'native';
}

export interface DynamicPlaceholders {
  company: string;
  position: string;
  experienceDescription: string;
  summary: string;
}

import { Language, getTranslation } from '@/lib/i18n/translations';

interface ResumeState {
  language: Language;
  setLanguage: (lang: Language) => void;

  fullName: string;
  setFullName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  location: string;
  setLocation: (location: string) => void;
  houseNumber: string;
  setHouseNumber: (num: string) => void;

  // Profile photo (base64)
  profilePhoto: string;
  setProfilePhoto: (photo: string) => void;

  // Professional links
  linkedIn: string;
  setLinkedIn: (url: string) => void;
  github: string;
  setGithub: (url: string) => void;
  portfolio: string;
  setPortfolio: (url: string) => void;

  jobTitle: string;
  setJobTitle: (title: string) => void;
  summary: string;
  setSummary: (summary: string) => void;

  postalCode: string;
  setPostalCode: (code: string) => void;

  experiences: Experience[];
  addExperience: () => void;
  updateExperience: (id: string, field: keyof Experience, value: string) => void;
  removeExperience: (id: string) => void;
  
  educations: Education[];
  addEducation: () => void;
  updateEducation: (id: string, field: keyof Education, value: string) => void;
  removeEducation: (id: string) => void;

  skills: string[];
  setSkills: (skills: string[]) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;

  // Spoken languages
  spokenLanguages: SpokenLanguage[];
  addSpokenLanguage: () => void;
  updateSpokenLanguage: (id: string, field: keyof SpokenLanguage, value: string) => void;
  removeSpokenLanguage: (id: string) => void;

  placeholders: DynamicPlaceholders;
  setPlaceholders: (placeholders: DynamicPlaceholders) => void;

  jobDescription: string;
  setJobDescription: (jd: string) => void;

  templateId: string;
  setTemplateId: (id: string) => void;

  isCompactMode: boolean;
  setIsCompactMode: (enabled: boolean) => void;

  resetData: () => void;
}


export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      language: 'nl',
      setLanguage: (lang) => {
        const t = getTranslation(lang);
        set({ 
          language: lang,
          placeholders: {
            company: t.defaultCompanyPlaceholder,
            position: t.defaultPositionPlaceholder,
            experienceDescription: t.defaultExpDescPlaceholder,
            summary: t.defaultSummaryPlaceholder,
          }
        });
      },

      fullName: '',
      setFullName: (name) => set({ fullName: name }),
      email: '',
      setEmail: (email) => set({ email }),
      phone: '',
      setPhone: (phone) => set({ phone }),
      location: '',
      setLocation: (location) => set({ location }),
      houseNumber: '',
      setHouseNumber: (houseNumber) => set({ houseNumber }),

      profilePhoto: '',
      setProfilePhoto: (photo) => set({ profilePhoto: photo }),

      linkedIn: '',
      setLinkedIn: (url) => set({ linkedIn: url }),
      github: '',
      setGithub: (url) => set({ github: url }),
      portfolio: '',
      setPortfolio: (url) => set({ portfolio: url }),

      jobTitle: '',
      setJobTitle: (title) => set({ jobTitle: title }),
      
      summary: '',
      setSummary: (summary) => set({ summary }),

      postalCode: '',
      setPostalCode: (code) => set({ postalCode: code }),

      experiences: [
        { id: '1', company: '', position: '', startDate: '', endDate: '', description: '' }
      ],
      addExperience: () => set((state) => ({
        experiences: [...state.experiences, { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', description: '' }]
      })),
      updateExperience: (id, field, value) => set((state) => ({
        experiences: state.experiences.map((exp) => 
          exp.id === id ? { ...exp, [field]: value } : exp
        )
      })),
      removeExperience: (id) => set((state) => ({
        experiences: state.experiences.filter((exp) => exp.id !== id)
      })),

      educations: [
        { id: '1', institution: '', degree: '', year: '' }
      ],
      addEducation: () => set((state) => ({
        educations: [...state.educations, { id: Date.now().toString(), institution: '', degree: '', year: '' }]
      })),
      updateEducation: (id, field, value) => set((state) => ({
        educations: state.educations.map((edu) => 
          edu.id === id ? { ...edu, [field]: value } : edu
        )
      })),
      removeEducation: (id) => set((state) => ({
        educations: state.educations.filter((edu) => edu.id !== id)
      })),

      skills: [],
      setSkills: (skills) => set({ skills }),
      addSkill: (skill) => set((state) => ({
        skills: state.skills.includes(skill) ? state.skills : [...state.skills, skill]
      })),
      removeSkill: (skill) => set((state) => ({
        skills: state.skills.filter((s) => s !== skill)
      })),

      spokenLanguages: [],
      addSpokenLanguage: () => set((state) => ({
        spokenLanguages: [...state.spokenLanguages, { id: Date.now().toString(), name: '', level: 'intermediate' }]
      })),
      updateSpokenLanguage: (id, field, value) => set((state) => ({
        spokenLanguages: state.spokenLanguages.map((lang) =>
          lang.id === id ? { ...lang, [field]: value } : lang
        )
      })),
      removeSpokenLanguage: (id) => set((state) => ({
        spokenLanguages: state.spokenLanguages.filter((lang) => lang.id !== id)
      })),

      placeholders: {
        company: 'Bijv: Google',
        position: 'Bijv: Software Engineer',
        experienceDescription: 'Beschrijf kort wat je hebt gedaan, en de AI zal het professioneel formuleren...',
        summary: 'Schrijf een korte introductie over je ambities en ervaring...'
      },
      setPlaceholders: (placeholders) => set({ placeholders }),

      jobDescription: '',
      setJobDescription: (jobDescription) => set({ jobDescription }),

      templateId: 'modern',
      setTemplateId: (templateId) => set({ templateId }),

      isCompactMode: false,
      setIsCompactMode: (isCompactMode) => set({ isCompactMode }),

      resetData: () => {
        set({
          fullName: '',
          email: '',
          phone: '',
          location: '',
          houseNumber: '',
          profilePhoto: '',
          linkedIn: '',
          github: '',
          portfolio: '',
          jobTitle: '',
          summary: '',
          postalCode: '',
          experiences: [{ id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', description: '' }],
          educations: [{ id: Date.now().toString(), institution: '', degree: '', year: '' }],
          skills: [],
          spokenLanguages: [],
          jobDescription: '',
        });
      },
    }),
    {
      name: 'cv-builder-storage',
      partialize: (state) => ({
        // Persist everything except placeholders, functions, and heavy images
        language: state.language,
        fullName: state.fullName,
        email: state.email,
        phone: state.phone,
        location: state.location,
        houseNumber: state.houseNumber,
        // profilePhoto EXCLUDED to avoid localStorage limit
        linkedIn: state.linkedIn,
        github: state.github,
        portfolio: state.portfolio,
        jobTitle: state.jobTitle,
        summary: state.summary,
        postalCode: state.postalCode,
        experiences: state.experiences,
        educations: state.educations,
        skills: state.skills,
        spokenLanguages: state.spokenLanguages,
        jobDescription: state.jobDescription,
        templateId: state.templateId,
        isCompactMode: state.isCompactMode,
      }),
    }
  )
);
