import { NextRequest, NextResponse } from 'next/server';
import { generatePlaceholdersPrompt } from '@/lib/ai/prompts';
import { GoogleGenAI } from '@google/genai';
import { PlaceholderSchema } from '@/lib/ai/schemas';
import { cleanAIResponse } from '@/lib/ai/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.jobTitle) {
      return NextResponse.json({ error: 'Missing required field: jobTitle' }, { status: 400 });
    }

    const language = (body.language || 'ar') as 'ar' | 'nl';
    const prompt = generatePlaceholdersPrompt(body.jobTitle, language);

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
    const parsedData = PlaceholderSchema.parse(JSON.parse(cleaned));

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error generating placeholders:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
