import { NextRequest, NextResponse } from 'next/server';
import { generateATSMatchPrompt } from '@/lib/ai/prompts';
import { GoogleGenAI } from '@google/genai';
import { ATSMatchSchema } from '@/lib/ai/schemas';
import { cleanAIResponse } from '@/lib/ai/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.cvData || !body.jobDescription) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const language = (body.language || 'ar') as 'ar' | 'nl';
    const prompt = generateATSMatchPrompt(body.cvData, body.jobDescription, language);

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        responseMimeType: 'application/json',
      }
    });

    if (!response.text) {
      throw new Error('No response from Gemini API');
    }

    const cleaned = cleanAIResponse(response.text);
    let parsedData;
    try {
      parsedData = ATSMatchSchema.parse(JSON.parse(cleaned));
    } catch (e) {
      console.error('Validation error:', e);
      parsedData = {
        matchScore: 0,
        missingKeywords: ["فشل التحليل"],
        suggestions: ["يرجى المحاولة مرة أخرى بنص أكثر وضوحاً"]
      };
    }

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error generating ATS match:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
