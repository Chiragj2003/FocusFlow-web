import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

// AI-powered habit generation using Google Gemini

interface GeneratedHabit {
  title: string
  description: string
  category: string
  color: string
  goalType: 'binary' | 'duration' | 'quantity'
  goalTarget?: number
  unit?: string
}

// Color mapping for categories
const CATEGORY_COLORS: Record<string, string> = {
  Health: '#22c55e',
  Fitness: '#ef4444',
  Mindfulness: '#a855f7',
  Learning: '#3b82f6',
  Productivity: '#f59e0b',
  Social: '#ec4899',
  Creative: '#8b5cf6',
  Finance: '#14b8a6',
  Nutrition: '#84cc16',
  Other: '#71717a',
}

async function generateHabitWithGemini(userInput: string): Promise<GeneratedHabit> {
  const apiKey = process.env.GEMINI_API_KEY
  
  if (!apiKey) {
    console.error('GEMINI_API_KEY environment variable is not set')
    throw new Error('AI service not configured. Please contact support.')
  }

  const prompt = `You are a habit tracking assistant. Based on the user's description, generate a structured habit for tracking.

User's description: "${userInput}"

Respond with ONLY a valid JSON object (no markdown, no code blocks) with these exact fields:
{
  "title": "Short, action-oriented habit name (3-7 words max)",
  "description": "Brief motivational description (1 sentence)",
  "category": "One of: Health, Fitness, Mindfulness, Learning, Productivity, Social, Creative, Finance, Nutrition, Other",
  "goalType": "One of: binary (yes/no completion), duration (time-based), quantity (count-based)",
  "goalTarget": number or null (for binary type use null, for duration/quantity provide a reasonable target),
  "unit": "string or null (e.g., 'minutes', 'glasses', 'pages', 'steps' - null for binary type)"
}

Examples:
- "drink water" -> {"title": "Stay Hydrated", "description": "Drink enough water to keep your body healthy and energized", "category": "Health", "goalType": "quantity", "goalTarget": 8, "unit": "glasses"}
- "meditate" -> {"title": "Daily Meditation", "description": "Take time to calm your mind and practice mindfulness", "category": "Mindfulness", "goalType": "duration", "goalTarget": 10, "unit": "minutes"}
- "read books" -> {"title": "Read Daily", "description": "Expand your knowledge through consistent reading", "category": "Learning", "goalType": "duration", "goalTarget": 30, "unit": "minutes"}`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    console.error('Gemini API error:', error)
    throw new Error('Failed to generate habit with AI')
  }

  const data = await response.json()
  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!textResponse) {
    throw new Error('No response from AI')
  }

  // Clean up the response (remove markdown code blocks if present)
  let cleanedResponse = textResponse.trim()
  if (cleanedResponse.startsWith('```json')) {
    cleanedResponse = cleanedResponse.slice(7)
  } else if (cleanedResponse.startsWith('```')) {
    cleanedResponse = cleanedResponse.slice(3)
  }
  if (cleanedResponse.endsWith('```')) {
    cleanedResponse = cleanedResponse.slice(0, -3)
  }
  cleanedResponse = cleanedResponse.trim()

  try {
    const parsed = JSON.parse(cleanedResponse)
    
    // Validate and sanitize the response
    const validCategories = ['Health', 'Fitness', 'Mindfulness', 'Learning', 'Productivity', 'Social', 'Creative', 'Finance', 'Nutrition', 'Other']
    const category = validCategories.includes(parsed.category) ? parsed.category : 'Other'
    
    const validGoalTypes = ['binary', 'duration', 'quantity']
    const goalType = validGoalTypes.includes(parsed.goalType) ? parsed.goalType : 'binary'

    return {
      title: String(parsed.title || 'New Habit').slice(0, 50),
      description: String(parsed.description || 'Track this habit daily').slice(0, 200),
      category,
      color: CATEGORY_COLORS[category] || CATEGORY_COLORS.Other,
      goalType: goalType as 'binary' | 'duration' | 'quantity',
      goalTarget: goalType !== 'binary' && parsed.goalTarget ? Number(parsed.goalTarget) : undefined,
      unit: goalType !== 'binary' && parsed.unit ? String(parsed.unit) : undefined,
    }
  } catch (_parseError) {
    console.error('Failed to parse Gemini response:', cleanedResponse)
    throw new Error('Failed to parse AI response')
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'A prompt is required' },
        { status: 400 }
      )
    }

    const trimmedPrompt = prompt.trim()
    if (trimmedPrompt.length < 3) {
      return NextResponse.json(
        { error: 'Please provide a more detailed description' },
        { status: 400 }
      )
    }

    // Generate habit using Gemini AI
    const generatedHabit = await generateHabitWithGemini(trimmedPrompt)

    return NextResponse.json(generatedHabit)
  } catch (error) {
    console.error('Error generating habit:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate habit' },
      { status: 500 }
    )
  }
}
