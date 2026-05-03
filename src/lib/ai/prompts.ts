// src/lib/ai/prompts.ts

export type SectionType = 'experience' | 'summary';
export type ToneType = 'formal' | 'strong' | 'short' | 'ats';

export interface ImproveRequestParams {
  content: string;
  section: SectionType;
  jobTitle?: string;
  language?: 'ar' | 'nl';
}

export const generateImprovementPrompt = (params: ImproveRequestParams): string => {
  const { content, section, jobTitle = 'غير محدد', language = 'ar' } = params;
  const langStr = language === 'ar' ? 'Arabic' : language === 'nl' ? 'Dutch' : 'English';

  const basePrompt = `You are an expert Resume/CV writer and career coach.
Your task is to improve the user's input for the "${section}" section of their CV.
Target Job Title: "${jobTitle}"
Output Language: ${langStr}

You must provide 4 different options for the improvement, each matching a specific tone/style:
1. "formal": Professional, formal, and standard CV language.
2. "strong": Action-oriented, impactful, emphasizing achievements and metrics.
3. "short": Concise, brief, and straight to the point (bullet-point style if applicable).
4. "ats": Keyword-rich, optimized for Applicant Tracking Systems, using standard industry terms.

IMPORTANT RULES:
- Output MUST be a valid JSON object ONLY, with no markdown formatting around it (no \`\`\`json).
- The JSON structure must exactly match this format:
{
  "options": [
    {"tone": "formal", "text": "..."},
    {"tone": "strong", "text": "..."},
    {"tone": "short", "text": "..."},
    {"tone": "ats", "text": "..."}
  ]
}
- Do not include any explanations, greetings, or other text outside the JSON object.
- CRITICAL: The output MUST be strictly in the requested Output Language (${language === 'ar' ? 'Arabic' : language === 'nl' ? 'Dutch' : 'English'}).
- Even if the "User's Input" is in a different language, you MUST translate and generate the professional content ONLY in ${language === 'ar' ? 'Arabic' : language === 'nl' ? 'Dutch' : 'English'}.
- For "experience", generate 3-5 separate achievement bullet points. Each bullet must be on its OWN LINE separated by a newline character (\n). Do NOT use bullet symbols (•, -, *). Use strong action verbs (e.g., Developed, Led, حقق, طوّر).
- For "summary", generate 2-4 impactful sentences. Each sentence must be on its OWN LINE separated by a newline character (\n). Make the sentences cohesive but individually meaningful.

User's Input:
"""
${content}
"""
`;

  return basePrompt.trim();
};

export const generatePlaceholdersPrompt = (jobTitle: string, language: 'ar' | 'nl' = 'ar'): string => {
  const langStr = language === 'ar' ? 'Arabic' : language === 'nl' ? 'Dutch' : 'English';
  const basePrompt = `You are an expert career coach helping a user build their CV.
The user's Target Job Title is: "${jobTitle}"
Output Language: ${langStr}

Your task is to provide 4 short, highly relevant examples (placeholders) for this specific job title, to guide the user on what to write in their CV fields.
1. "company": A realistic example of a top company hiring for this role.
2. "position": A realistic job title based on their input (can be the same or slightly refined).
3. "experienceDescription": A short, 1-sentence example of a typical responsibility or achievement.
4. "summary": A short, 1-sentence example of a professional summary for this role.

IMPORTANT RULES:
- Output MUST be a valid JSON object ONLY, with no markdown formatting around it (no \`\`\`json).
- The JSON structure must exactly match this format:
{
  "company": "${language === 'ar' ? 'مثال' : language === 'nl' ? 'Bijv' : 'e.g.'}: ...",
  "position": "${language === 'ar' ? 'مثال' : language === 'nl' ? 'Bijv' : 'e.g.'}: ...",
  "experienceDescription": "${language === 'ar' ? 'مثال' : language === 'nl' ? 'Bijv' : 'e.g.'}: ...",
  "summary": "${language === 'ar' ? 'مثال' : language === 'nl' ? 'Bijv' : 'e.g.'}: ..."
}
- Start each value with the language-appropriate example prefix ("مثال: " for Arabic, "Bijv: " for Dutch, "e.g. " for English).
- Do not include any explanations, greetings, or other text outside the JSON object.
`;

  return basePrompt.trim();
};

export const generateSkillsPrompt = (jobTitle: string, language: 'ar' | 'nl' = 'ar'): string => {
  const langStr = language === 'ar' ? 'Arabic' : language === 'nl' ? 'Dutch' : 'English';
  const basePrompt = `You are an expert career coach.
The user's Target Job Title is: "${jobTitle}"
Output Language: ${langStr}

Your task is to provide exactly 10 highly relevant skills (both hard and soft skills) for this job title.
Make sure the skills are standard industry terms.

IMPORTANT RULES:
- Output MUST be a valid JSON object ONLY, with no markdown formatting around it (no \`\`\`json).
- The JSON structure must exactly match this format:
{
  "skills": ["Skill 1", "Skill 2", "Skill 3", ...]
}
- All skills in the array MUST be translated to and written strictly in ${langStr}.
- Do not include any explanations, greetings, or other text outside the JSON object.
`;

  return basePrompt.trim();
};

export const generateShortSuggestionPrompt = (jobTitle: string, fieldType: string, context: string = '', language: 'ar' | 'nl' = 'ar'): string => {
  const langStr = language === 'ar' ? 'Arabic' : language === 'nl' ? 'Dutch' : 'English';
  const basePrompt = `You are an AI assistant helping a user fill out ONE specific field in their CV.
The user's Target Job Title is: "${jobTitle}"
The exact field you must fill is: "${fieldType}"
${context ? `Extra Context from the user's CV (use this to make the suggestion highly relevant): "${context}"` : ''}
Output Language: ${langStr}

Your task is to provide exactly ONE realistic, highly professional, short value for THIS FIELD ONLY.

CRITICAL INSTRUCTIONS:
1. ONLY return the value for "${fieldType}". 
2. DO NOT combine fields. Do not include dates, company names, and job titles in the same string.
3. DO NOT use the pipe character "|" or dashes "-" to combine information.
4. Keep it extremely short (1-4 words max).
${context ? `5. Make sure the suggestion logically matches the Extra Context provided (e.g. if position is Software Engineer, suggest a tech company).` : ''}

Examples:
- If field is "اسم الشركة (Company)" -> output "شركة أرامكو" or "Microsoft".
- If field is "المسمى الوظيفي (Position)" -> output "مهندس برمجيات أول" or "Senior Developer".
- If field is "المدينة والدولة (Location)" -> output "الرياض، السعودية".
- If field is "الدرجة العلمية والتخصص (Degree)" -> output "بكالوريوس علوم حاسب".

IMPORTANT RULES:
- Output MUST be a valid JSON object ONLY.
- The JSON structure must exactly match this format:
{
  "suggestion": "Your single short suggestion here"
}
- Do NOT include any explanations or quotes. Just the JSON.
`;

  return basePrompt.trim();
};

interface CVReviewData {
  jobTitle: string;
  summary: string;
  experiences: { company: string; position: string; description: string }[];
  educations: { degree: string; institution: string; year: string }[];
  skills: string[];
}

export const generateReviewPrompt = (cvData: CVReviewData, language: 'ar' | 'nl' = 'ar'): string => {
  const langStr = language === 'ar' ? 'Arabic' : language === 'nl' ? 'Dutch' : 'English';
  const basePrompt = `You are an expert HR Manager and Career Coach.
Your task is to review the following CV data (which has personal information excluded for privacy).
Output Language: ${langStr}

Here is the CV data:
\`\`\`json
${JSON.stringify(cvData, null, 2)}
\`\`\`

Analyze the CV for:
- Clarity, impact, and professionalism.
- Usage of strong action verbs.
- Alignment of skills and experience with the target job title.

IMPORTANT RULES:
- Output MUST be a valid JSON object ONLY, with no markdown formatting around it (no \`\`\`json).
- The JSON structure must exactly match this format:
{
  "score": "A number from 1 to 10 representing the overall quality of the CV",
  "strengths": ["Strength 1", "Strength 2", ...],
  "weaknesses": ["Area for improvement 1", "Area for improvement 2", ...],
  "suggestions": ["Actionable suggestion 1", "Actionable suggestion 2", ...]
}
- Provide 2-4 items for strengths, weaknesses, and suggestions.
- All text values in the JSON MUST be written strictly in ${langStr}.
- Do not include any explanations, greetings, or other text outside the JSON object.
`;

  return basePrompt.trim();
};

export const generateAutoFixPrompt = (
  cvData: CVReviewData,
  reviewFeedback: { weaknesses: string[]; suggestions: string[] },
  language: 'ar' | 'nl' = 'ar'
): string => {
  const langStr = language === 'ar' ? 'Arabic' : language === 'nl' ? 'Dutch' : 'English';
  const basePrompt = `You are an expert CV writer and career coach.
Your task is to IMPROVE the following CV data based on the review feedback provided below.
Output Language: ${langStr}

## Current CV Data:
\`\`\`json
${JSON.stringify(cvData, null, 2)}
\`\`\`

## Review Feedback (Issues to Fix):
Weaknesses: ${JSON.stringify(reviewFeedback.weaknesses)}
Suggestions: ${JSON.stringify(reviewFeedback.suggestions)}

## Your Task:
Rewrite and improve the CV data to address ALL the weaknesses and suggestions above.
Keep the same structure, IDs, and general meaning, but make the text more professional, impactful, and ATS-friendly.

IMPORTANT RULES:
- Output MUST be a valid JSON object ONLY, with no markdown formatting around it (no \`\`\`json).
- The JSON structure must exactly match this format:
{
  "summary": "Improved professional summary",
  "experiences": [
    {"id": "same_id", "company": "same_company", "position": "same_position", "description": "Improved description"}
  ],
  "educations": [
    {"id": "same_id", "institution": "same_institution", "degree": "same_or_improved_degree", "year": "same_year"}
  ]
}
- Keep the same IDs for experiences and educations.
- Keep company names, institution names, and years UNCHANGED.
- Only improve: summary, experience descriptions, and degree descriptions.
- Use strong action verbs and quantifiable achievements where possible.
- CRITICAL: All text MUST be written strictly in ${langStr}, regardless of the language of the current CV data.
- Do not include any explanations, greetings, or other text outside the JSON object.
`;

  return basePrompt.trim();
};

export const generateATSMatchPrompt = (
  cvData: CVReviewData,
  jobDescription: string,
  language: 'ar' | 'nl' = 'ar'
): string => {
  const langStr = language === 'ar' ? 'Arabic' : 'Dutch';
  const basePrompt = `You are an expert ATS (Applicant Tracking System) and HR Specialist.
Your task is to analyze how well the provided CV matches the given Job Description.
Output Language: ${langStr}

## CV Data:
\`\`\`json
${JSON.stringify(cvData, null, 2)}
\`\`\`

## Target Job Description:
"""
${jobDescription}
"""

Analyze for:
1. Keyword matching (Missing industry-specific terms).
2. Skill relevance.
3. Experience alignment.

IMPORTANT RULES:
- Output MUST be a valid JSON object ONLY, with no markdown formatting around it (no \`\`\`json).
- The JSON structure must exactly match this format:
{
  "matchScore": "A number from 0 to 100",
  "missingKeywords": ["Keyword 1", "Keyword 2", ...],
  "suggestions": ["Specific suggestion to match this JD 1", "Specific suggestion 2", ...]
}
- Provide 5-10 missing keywords.
- Provide 3-5 specific suggestions.
- All text values in the JSON MUST be written strictly in ${langStr}.
- Do not include any explanations, greetings, or other text outside the JSON object.
`;

  return basePrompt.trim();
};
