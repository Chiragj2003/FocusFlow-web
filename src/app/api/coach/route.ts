import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    // Simple dev protection (allow local testing without token if needed, or strictly enforce)
    // if (!userId) {
    //  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { messages, insights } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      // Mock response if no API key is configured
      return NextResponse.json({
        mock: true,
        text: `[MOCK AI COACH]\nI noticed your completion rate is ${
          insights?.overallCompletionRate ? Math.round(insights.overallCompletionRate * 100) : 0
        }%. Keep up the great work! To enable the real AI coach, please add GEMINI_API_KEY to your backend.`
      });
    }

    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    });

    const systemPrompt = `You are a personalized, supportive, and data-driven AI Habit Coach for the FocusFlow app.
Your goal is to help the user build better habits and stay focused. Keep your answers concise, motivating, and directly actionable.
Here is the user's latest performance data (insights):
${JSON.stringify(insights || {})}

Analyze this data. If their completion rate is high, congratulate them. If it's low or they lost a streak, encourage them. Give practical advice based on their actual habits.`;

    const result = streamText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Coach API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
