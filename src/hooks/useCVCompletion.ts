import { useResumeStore } from '@/store/useResumeStore';

export function useCVCompletion() {
  const store = useResumeStore();

  const fields = [
    { value: store.fullName, weight: 10 },
    { value: store.email, weight: 5 },
    { value: store.jobTitle, weight: 10 },
    { value: store.summary, weight: 15 },
    { value: store.experiences.length > 0 && store.experiences[0].company ? 20 : 0, weight: 20, isBoolean: true },
    { value: store.educations.length > 0 && store.educations[0].institution ? 15 : 0, weight: 15, isBoolean: true },
    { value: store.skills.length > 0 ? 15 : 0, weight: 15, isBoolean: true },
    { value: store.phone, weight: 5 },
    { value: store.location, weight: 5 },
  ];

  const totalWeight = fields.reduce((acc, f) => acc + f.weight, 0);
  const completedWeight = fields.reduce((acc, f) => {
    const isCompleted = f.isBoolean ? !!f.value : !!(f.value as string).trim();
    return acc + (isCompleted ? f.weight : 0);
  }, 0);

  const percentage = Math.round((completedWeight / totalWeight) * 100);

  return { percentage };
}
