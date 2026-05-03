import { NextRequest, NextResponse } from 'next/server';
import { generateReviewPrompt } from '@/lib/ai/prompts';
import { GoogleGenAI } from '@google/genai';
import { ReviewSchema } from '@/lib/ai/schemas';
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
    const { allowed } = checkRateLimit(ip, { limit: 5, windowMs: 60 * 1000 });
    
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json();

    if (!body.cvData) {
      return NextResponse.json({ error: 'Missing required field: cvData' }, { status: 400 });
    }

    const language = (body.language || 'ar') as 'ar' | 'nl';
    const prompt = generateReviewPrompt(body.cvData, language);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
      parsedData = ReviewSchema.parse(JSON.parse(cleaned));
    } catch (e) {
      console.error('Validation error:', e);
      // Fallback
      parsedData = {
        score: 5,
        strengths: ["البيانات متوفرة"],
        weaknesses: ["فشل تحليل الذكاء الاصطناعي بشكل كامل"],
        suggestions: ["يرجى المحاولة مرة أخرى"]
      };
    }

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error generating CV review:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
