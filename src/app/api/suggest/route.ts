import { NextRequest, NextResponse } from 'next/server';
import { generateShortSuggestionPrompt } from '@/lib/ai/prompts';
import { GoogleGenAI } from '@google/genai';
import { SuggestionSchema } from '@/lib/ai/schemas';
import { cleanAIResponse } from '@/lib/ai/utils';
import { checkRateLimit } from '@/lib/rateLimit';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // 1. Basic Origin Check
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');
    if (origin && !origin.includes(host || '')) {
       return NextResponse.json({ error: 'Unauthorized origin' }, { status: 403 });
    }

    // 2. Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const { allowed } = checkRateLimit(ip, { limit: 20, windowMs: 60 * 1000 }); // Suggestions are fast
    
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json();

    if (!body.jobTitle || !body.fieldType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const language = (body.language || 'ar') as 'ar' | 'nl';
    const prompt = generateShortSuggestionPrompt(body.jobTitle, body.fieldType, body.context, language);

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
        responseMimeType: 'application/json',
      }
    });

    if (!response.text) {
      throw new Error('No response from Gemini API');
    }

    const cleaned = cleanAIResponse(response.text);
    const parsedData = SuggestionSchema.parse(JSON.parse(cleaned));

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error generating short suggestion:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
