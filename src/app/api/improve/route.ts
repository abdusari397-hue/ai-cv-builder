import { NextRequest, NextResponse } from 'next/server';
import { generateImprovementPrompt, ImproveRequestParams } from '@/lib/ai/prompts';
import { GoogleGenAI } from '@google/genai';
import { ImprovementSchema } from '@/lib/ai/schemas';
import { parseAIJson } from '@/lib/ai/utils';
import { checkRateLimit } from '@/lib/rateLimit';

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // 1. Basic Origin Check (Security)
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');
    if (origin && !origin.includes(host || '')) {
       return NextResponse.json({ error: 'Unauthorized origin' }, { status: 403 });
    }

    // 2. Rate Limiting (Protection against abuse)
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const { allowed, remaining } = checkRateLimit(ip, { limit: 10, windowMs: 60 * 1000 }); // 10 requests per minute
    
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    const body: ImproveRequestParams = await req.json();

    if (!body.content || !body.section) {
      return NextResponse.json({ error: 'Missing required fields: content or section' }, { status: 400 });
    }

    const prompt = generateImprovementPrompt(body);

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

    const parsedData = ImprovementSchema.parse(parseAIJson(response.text));

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error improving CV field:', error);
    const message = error instanceof Error ? error.message : 'Failed to process request';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
