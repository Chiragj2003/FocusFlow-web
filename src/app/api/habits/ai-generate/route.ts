import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

// AI-powered habit generation using Google Gemini with local fallback

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

// Local fallback templates for common habit patterns
const HABIT_PATTERNS: { 
  keywords: string[]
  habit: GeneratedHabit 
}[] = [
  {
    keywords: ['water', 'drink', 'hydrate', 'hydration'],
    habit: {
      title: 'Stay Hydrated',
      description: 'Drink enough water to keep your body healthy and energized',
      category: 'Health',
      color: CATEGORY_COLORS.Health,
      goalType: 'quantity',
      goalTarget: 8,
      unit: 'glasses',
    },
  },
  {
    keywords: ['meditate', 'meditation', 'mindful', 'calm', 'peace'],
    habit: {
      title: 'Daily Meditation',
      description: 'Take time to calm your mind and practice mindfulness',
      category: 'Mindfulness',
      color: CATEGORY_COLORS.Mindfulness,
      goalType: 'duration',
      goalTarget: 10,
      unit: 'minutes',
    },
  },
  {
    keywords: ['read', 'book', 'reading', 'literature'],
    habit: {
      title: 'Read Daily',
      description: 'Expand your knowledge through consistent reading',
      category: 'Learning',
      color: CATEGORY_COLORS.Learning,
      goalType: 'duration',
      goalTarget: 30,
      unit: 'minutes',
    },
  },
  {
    keywords: ['exercise', 'workout', 'gym', 'fitness', 'train'],
    habit: {
      title: 'Daily Exercise',
      description: 'Stay fit and healthy with regular physical activity',
      category: 'Fitness',
      color: CATEGORY_COLORS.Fitness,
      goalType: 'duration',
      goalTarget: 30,
      unit: 'minutes',
    },
  },
  {
    keywords: ['walk', 'steps', 'walking', 'stroll'],
    habit: {
      title: 'Daily Walk',
      description: 'Get moving with a refreshing daily walk',
      category: 'Fitness',
      color: CATEGORY_COLORS.Fitness,
      goalType: 'quantity',
      goalTarget: 10000,
      unit: 'steps',
    },
  },
  {
    keywords: ['sleep', 'rest', 'bed', 'early'],
    habit: {
      title: 'Quality Sleep',
      description: 'Prioritize rest for better health and productivity',
      category: 'Health',
      color: CATEGORY_COLORS.Health,
      goalType: 'duration',
      goalTarget: 8,
      unit: 'hours',
    },
  },
  {
    keywords: ['journal', 'write', 'diary', 'gratitude', 'reflect'],
    habit: {
      title: 'Daily Journaling',
      description: 'Reflect on your day and cultivate gratitude',
      category: 'Mindfulness',
      color: CATEGORY_COLORS.Mindfulness,
      goalType: 'binary',
    },
  },
  {
    keywords: ['yoga', 'stretch', 'flexibility'],
    habit: {
      title: 'Practice Yoga',
      description: 'Improve flexibility and mental clarity through yoga',
      category: 'Fitness',
      color: CATEGORY_COLORS.Fitness,
      goalType: 'duration',
      goalTarget: 20,
      unit: 'minutes',
    },
  },
  {
    keywords: ['learn', 'study', 'course', 'skill', 'language'],
    habit: {
      title: 'Learn Something New',
      description: 'Invest in yourself by learning daily',
      category: 'Learning',
      color: CATEGORY_COLORS.Learning,
      goalType: 'duration',
      goalTarget: 15,
      unit: 'minutes',
    },
  },
  {
    keywords: ['code', 'program', 'develop', 'coding'],
    habit: {
      title: 'Code Daily',
      description: 'Build your programming skills with daily practice',
      category: 'Learning',
      color: CATEGORY_COLORS.Learning,
      goalType: 'duration',
      goalTarget: 30,
      unit: 'minutes',
    },
  },
  {
    keywords: ['save', 'money', 'budget', 'invest'],
    habit: {
      title: 'Track Finances',
      description: 'Stay on top of your financial goals',
      category: 'Finance',
      color: CATEGORY_COLORS.Finance,
      goalType: 'binary',
    },
  },
  {
    keywords: ['healthy', 'eat', 'nutrition', 'vegetable', 'fruit', 'diet'],
    habit: {
      title: 'Eat Healthy',
      description: 'Nourish your body with nutritious food choices',
      category: 'Nutrition',
      color: CATEGORY_COLORS.Nutrition,
      goalType: 'quantity',
      goalTarget: 5,
      unit: 'servings',
    },
  },
  {
    keywords: ['social', 'friend', 'family', 'call', 'connect'],
    habit: {
      title: 'Stay Connected',
      description: 'Maintain meaningful relationships with loved ones',
      category: 'Social',
      color: CATEGORY_COLORS.Social,
      goalType: 'binary',
    },
  },
  {
    keywords: ['art', 'draw', 'paint', 'create', 'creative', 'music'],
    habit: {
      title: 'Creative Practice',
      description: 'Express yourself through creative activities',
      category: 'Creative',
      color: CATEGORY_COLORS.Creative,
      goalType: 'duration',
      goalTarget: 20,
      unit: 'minutes',
    },
  },
  {
    keywords: ['focus', 'productive', 'work', 'task', 'deep'],
    habit: {
      title: 'Deep Focus Work',
      description: 'Accomplish more with dedicated focus time',
      category: 'Productivity',
      color: CATEGORY_COLORS.Productivity,
      goalType: 'duration',
      goalTarget: 60,
      unit: 'minutes',
    },
  },
]

// Local fallback generator when API is unavailable
function generateHabitLocally(userInput: string): GeneratedHabit {
  const lowerInput = userInput.toLowerCase()
  
  // Try to match with known patterns
  for (const pattern of HABIT_PATTERNS) {
    if (pattern.keywords.some(keyword => lowerInput.includes(keyword))) {
      // Customize the title if we can extract numbers
      const numberMatch = userInput.match(/(\d+)/g)
      if (numberMatch && pattern.habit.goalTarget) {
        return {
          ...pattern.habit,
          goalTarget: parseInt(numberMatch[0], 10),
        }
      }
      return pattern.habit
    }
  }
  
  // Default fallback - create a generic habit
  const capitalizedInput = userInput.charAt(0).toUpperCase() + userInput.slice(1).toLowerCase()
  const shortTitle = capitalizedInput.split(' ').slice(0, 4).join(' ')
  
  return {
    title: shortTitle.length > 30 ? shortTitle.slice(0, 30) + '...' : shortTitle,
    description: `Make "${userInput}" a daily habit`,
    category: 'Other',
    color: CATEGORY_COLORS.Other,
    goalType: 'binary',
  }
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
  } catch {
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

    let generatedHabit: GeneratedHabit

    // Try AI generation first, fall back to local if it fails
    const apiKey = process.env.GEMINI_API_KEY
    
    if (apiKey) {
      try {
        generatedHabit = await generateHabitWithGemini(trimmedPrompt)
      } catch (aiError) {
        console.warn('AI generation failed, using local fallback:', aiError)
        generatedHabit = generateHabitLocally(trimmedPrompt)
      }
    } else {
      // No API key configured, use local fallback
      console.info('GEMINI_API_KEY not configured, using local habit generation')
      generatedHabit = generateHabitLocally(trimmedPrompt)
    }

    return NextResponse.json(generatedHabit)
  } catch (error) {
    console.error('Error generating habit:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate habit' },
      { status: 500 }
    )
  }
}
