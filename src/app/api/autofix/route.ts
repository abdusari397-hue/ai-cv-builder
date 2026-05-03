import { NextRequest, NextResponse } from 'next/server';
import { generateAutoFixPrompt } from '@/lib/ai/prompts';
import { GoogleGenAI } from '@google/genai';
import { AutoFixSchema } from '@/lib/ai/schemas';
import { cleanAIResponse } from '@/lib/ai/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.cvData || !body.reviewFeedback) {
      return NextResponse.json({ error: 'Missing required fields: cvData, reviewFeedback' }, { status: 400 });
    }

    const language = (body.language || 'ar') as 'ar' | 'nl';
    const prompt = generateAutoFixPrompt(body.cvData, body.reviewFeedback, language);

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
      parsedData = AutoFixSchema.parse(JSON.parse(cleaned));
    } catch (e) {
      console.error('Validation error:', e);
      return NextResponse.json({ error: 'AI response was invalid' }, { status: 500 });
    }

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error auto-fixing CV:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
