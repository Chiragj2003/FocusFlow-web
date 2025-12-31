// Predefined Challenges

export interface ChallengeHabit {
  title: string
  description: string
  category: string
  color: string
  goalType: 'binary' | 'duration' | 'quantity'
  goalTarget?: number
  unit?: string
}

export interface ChallengeTemplate {
  id: string
  title: string
  description: string
  duration: number // days
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  icon: string // emoji
  habits: ChallengeHabit[]
}

export const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  {
    id: '30-day-fitness',
    title: '30-Day Fitness Challenge',
    description: 'Build a consistent exercise routine with daily workouts and healthy habits',
    duration: 30,
    category: 'Fitness',
    difficulty: 'medium',
    icon: '💪',
    habits: [
      {
        title: 'Morning Exercise',
        description: 'Start your day with movement',
        category: 'Fitness',
        color: '#ef4444',
        goalType: 'duration',
        goalTarget: 30,
        unit: 'min',
      },
      {
        title: 'Drink Water',
        description: 'Stay hydrated throughout the day',
        category: 'Health',
        color: '#3b82f6',
        goalType: 'quantity',
        goalTarget: 8,
        unit: 'glasses',
      },
      {
        title: '10,000 Steps',
        description: 'Walk more every day',
        category: 'Fitness',
        color: '#22c55e',
        goalType: 'quantity',
        goalTarget: 10000,
        unit: 'steps',
      },
    ],
  },
  {
    id: '21-day-mindfulness',
    title: '21-Day Mindfulness Journey',
    description: 'Develop a peaceful mind through meditation and reflection',
    duration: 21,
    category: 'Mindfulness',
    difficulty: 'easy',
    icon: '🧘',
    habits: [
      {
        title: 'Morning Meditation',
        description: 'Start with clarity and focus',
        category: 'Mindfulness',
        color: '#a855f7',
        goalType: 'duration',
        goalTarget: 10,
        unit: 'min',
      },
      {
        title: 'Gratitude Journal',
        description: 'Write 3 things you are grateful for',
        category: 'Mindfulness',
        color: '#f59e0b',
        goalType: 'binary',
      },
      {
        title: 'Digital Detox Hour',
        description: 'One hour without screens before bed',
        category: 'Mindfulness',
        color: '#14b8a6',
        goalType: 'binary',
      },
    ],
  },
  {
    id: '30-day-learning',
    title: '30-Day Learning Sprint',
    description: 'Commit to continuous learning and skill development',
    duration: 30,
    category: 'Learning',
    difficulty: 'medium',
    icon: '📚',
    habits: [
      {
        title: 'Read Daily',
        description: 'Expand your knowledge through books',
        category: 'Learning',
        color: '#3b82f6',
        goalType: 'duration',
        goalTarget: 30,
        unit: 'min',
      },
      {
        title: 'Learn Something New',
        description: 'Watch a tutorial or course lesson',
        category: 'Learning',
        color: '#8b5cf6',
        goalType: 'binary',
      },
      {
        title: 'Practice Skills',
        description: 'Apply what you learned',
        category: 'Learning',
        color: '#06b6d4',
        goalType: 'duration',
        goalTarget: 45,
        unit: 'min',
      },
    ],
  },
  {
    id: '14-day-productivity',
    title: '14-Day Productivity Boost',
    description: 'Optimize your daily routine for maximum output',
    duration: 14,
    category: 'Productivity',
    difficulty: 'hard',
    icon: '🚀',
    habits: [
      {
        title: 'Wake Up Early',
        description: 'Start your day before 7 AM',
        category: 'Productivity',
        color: '#f59e0b',
        goalType: 'binary',
      },
      {
        title: 'Deep Work Session',
        description: 'Focused work without distractions',
        category: 'Productivity',
        color: '#ef4444',
        goalType: 'duration',
        goalTarget: 90,
        unit: 'min',
      },
      {
        title: 'Plan Tomorrow',
        description: 'End your day by planning the next',
        category: 'Productivity',
        color: '#22c55e',
        goalType: 'binary',
      },
      {
        title: 'Review Goals',
        description: 'Check progress on weekly goals',
        category: 'Productivity',
        color: '#a855f7',
        goalType: 'binary',
      },
    ],
  },
  {
    id: '30-day-healthy-eating',
    title: '30-Day Healthy Eating',
    description: 'Transform your nutrition habits for better health',
    duration: 30,
    category: 'Nutrition',
    difficulty: 'medium',
    icon: '🥗',
    habits: [
      {
        title: 'Eat Vegetables',
        description: 'Include veggies in every meal',
        category: 'Nutrition',
        color: '#22c55e',
        goalType: 'quantity',
        goalTarget: 5,
        unit: 'servings',
      },
      {
        title: 'No Junk Food',
        description: 'Avoid processed snacks',
        category: 'Nutrition',
        color: '#ef4444',
        goalType: 'binary',
      },
      {
        title: 'Meal Prep',
        description: 'Prepare healthy meals in advance',
        category: 'Nutrition',
        color: '#f59e0b',
        goalType: 'binary',
      },
    ],
  },
  {
    id: '7-day-sleep',
    title: '7-Day Sleep Reset',
    description: 'Improve your sleep quality in just one week',
    duration: 7,
    category: 'Health',
    difficulty: 'easy',
    icon: '😴',
    habits: [
      {
        title: 'Sleep by 10 PM',
        description: 'Get to bed early for better rest',
        category: 'Health',
        color: '#6366f1',
        goalType: 'binary',
      },
      {
        title: 'No Caffeine After 2 PM',
        description: 'Avoid caffeine in the afternoon',
        category: 'Health',
        color: '#78716c',
        goalType: 'binary',
      },
      {
        title: '8 Hours of Sleep',
        description: 'Get enough quality rest',
        category: 'Health',
        color: '#14b8a6',
        goalType: 'duration',
        goalTarget: 480,
        unit: 'min',
      },
    ],
  },
  {
    id: '30-day-creative',
    title: '30-Day Creative Challenge',
    description: 'Unleash your creativity with daily creative practice',
    duration: 30,
    category: 'Creative',
    difficulty: 'medium',
    icon: '🎨',
    habits: [
      {
        title: 'Create Something',
        description: 'Make art, music, or write daily',
        category: 'Creative',
        color: '#ec4899',
        goalType: 'binary',
      },
      {
        title: 'Creative Practice',
        description: 'Dedicate time to your craft',
        category: 'Creative',
        color: '#8b5cf6',
        goalType: 'duration',
        goalTarget: 30,
        unit: 'min',
      },
      {
        title: 'Seek Inspiration',
        description: 'Explore new ideas and artists',
        category: 'Creative',
        color: '#06b6d4',
        goalType: 'binary',
      },
    ],
  },
  {
    id: '21-day-social',
    title: '21-Day Connection Challenge',
    description: 'Strengthen relationships and build new connections',
    duration: 21,
    category: 'Social',
    difficulty: 'easy',
    icon: '🤝',
    habits: [
      {
        title: 'Reach Out',
        description: 'Message or call someone you care about',
        category: 'Social',
        color: '#ec4899',
        goalType: 'binary',
      },
      {
        title: 'Quality Time',
        description: 'Spend meaningful time with loved ones',
        category: 'Social',
        color: '#f59e0b',
        goalType: 'duration',
        goalTarget: 30,
        unit: 'min',
      },
      {
        title: 'Random Act of Kindness',
        description: 'Do something nice for someone',
        category: 'Social',
        color: '#22c55e',
        goalType: 'binary',
      },
    ],
  },
]

// Get challenges by category
export function getChallengesByCategory(category: string): ChallengeTemplate[] {
  return CHALLENGE_TEMPLATES.filter((c) => c.category === category)
}

// Get challenges by difficulty
export function getChallengesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): ChallengeTemplate[] {
  return CHALLENGE_TEMPLATES.filter((c) => c.difficulty === difficulty)
}

// Get challenge by ID
export function getChallengeById(id: string): ChallengeTemplate | undefined {
  return CHALLENGE_TEMPLATES.find((c) => c.id === id)
}
