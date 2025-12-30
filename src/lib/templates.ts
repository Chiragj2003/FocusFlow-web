// Habit Templates - Pre-built habits users can add with one click

export interface HabitTemplate {
  id: string
  title: string
  description: string
  category: string
  color: string
  goalType: 'binary' | 'duration' | 'quantity'
  goalTarget?: number
  unit?: string
  icon: string
}

export const HABIT_TEMPLATES: HabitTemplate[] = [
  // Health
  {
    id: 'drink_water',
    title: 'Drink Water',
    description: 'Stay hydrated by drinking enough water daily',
    category: 'Health',
    color: '#3b82f6',
    goalType: 'quantity',
    goalTarget: 8,
    unit: 'glasses',
    icon: '💧',
  },
  {
    id: 'take_vitamins',
    title: 'Take Vitamins',
    description: 'Remember to take your daily vitamins',
    category: 'Health',
    color: '#22c55e',
    goalType: 'binary',
    icon: '💊',
  },
  {
    id: 'sleep_early',
    title: 'Sleep by 11 PM',
    description: 'Get to bed early for better rest',
    category: 'Health',
    color: '#6366f1',
    goalType: 'binary',
    icon: '😴',
  },
  {
    id: 'no_junk_food',
    title: 'No Junk Food',
    description: 'Avoid processed and unhealthy foods',
    category: 'Health',
    color: '#ef4444',
    goalType: 'binary',
    icon: '🥗',
  },

  // Fitness
  {
    id: 'morning_exercise',
    title: 'Morning Exercise',
    description: 'Start the day with physical activity',
    category: 'Fitness',
    color: '#f59e0b',
    goalType: 'duration',
    goalTarget: 30,
    unit: 'minutes',
    icon: '🏃',
  },
  {
    id: 'walk_steps',
    title: 'Daily Steps',
    description: 'Walk at least 10,000 steps',
    category: 'Fitness',
    color: '#10b981',
    goalType: 'quantity',
    goalTarget: 10000,
    unit: 'steps',
    icon: '👟',
  },
  {
    id: 'stretching',
    title: 'Stretching',
    description: 'Stretch to improve flexibility',
    category: 'Fitness',
    color: '#ec4899',
    goalType: 'duration',
    goalTarget: 10,
    unit: 'minutes',
    icon: '🧘',
  },
  {
    id: 'strength_training',
    title: 'Strength Training',
    description: 'Build muscle with resistance exercises',
    category: 'Fitness',
    color: '#8b5cf6',
    goalType: 'duration',
    goalTarget: 45,
    unit: 'minutes',
    icon: '💪',
  },

  // Mindfulness
  {
    id: 'meditation',
    title: 'Meditation',
    description: 'Practice mindfulness and calm your mind',
    category: 'Mindfulness',
    color: '#06b6d4',
    goalType: 'duration',
    goalTarget: 10,
    unit: 'minutes',
    icon: '🧘‍♀️',
  },
  {
    id: 'gratitude_journal',
    title: 'Gratitude Journal',
    description: 'Write down things you are grateful for',
    category: 'Mindfulness',
    color: '#f97316',
    goalType: 'quantity',
    goalTarget: 3,
    unit: 'things',
    icon: '🙏',
  },
  {
    id: 'deep_breathing',
    title: 'Deep Breathing',
    description: 'Practice deep breathing exercises',
    category: 'Mindfulness',
    color: '#14b8a6',
    goalType: 'duration',
    goalTarget: 5,
    unit: 'minutes',
    icon: '🌬️',
  },
  {
    id: 'no_phone_morning',
    title: 'No Phone in Morning',
    description: 'Start the day without checking your phone',
    category: 'Mindfulness',
    color: '#a855f7',
    goalType: 'binary',
    icon: '📵',
  },

  // Learning
  {
    id: 'read_book',
    title: 'Read a Book',
    description: 'Read to expand your knowledge',
    category: 'Learning',
    color: '#f43f5e',
    goalType: 'duration',
    goalTarget: 30,
    unit: 'minutes',
    icon: '📚',
  },
  {
    id: 'learn_language',
    title: 'Language Practice',
    description: 'Practice a new language',
    category: 'Learning',
    color: '#0ea5e9',
    goalType: 'duration',
    goalTarget: 15,
    unit: 'minutes',
    icon: '🗣️',
  },
  {
    id: 'online_course',
    title: 'Online Course',
    description: 'Complete lessons from an online course',
    category: 'Learning',
    color: '#84cc16',
    goalType: 'duration',
    goalTarget: 30,
    unit: 'minutes',
    icon: '🎓',
  },
  {
    id: 'practice_skill',
    title: 'Practice a Skill',
    description: 'Work on developing a new skill',
    category: 'Learning',
    color: '#d946ef',
    goalType: 'duration',
    goalTarget: 20,
    unit: 'minutes',
    icon: '🎯',
  },

  // Productivity
  {
    id: 'plan_day',
    title: 'Plan My Day',
    description: 'Plan and prioritize tasks for the day',
    category: 'Productivity',
    color: '#ffffff',
    goalType: 'binary',
    icon: '📋',
  },
  {
    id: 'deep_work',
    title: 'Deep Work Session',
    description: 'Focused work without distractions',
    category: 'Productivity',
    color: '#71717a',
    goalType: 'duration',
    goalTarget: 90,
    unit: 'minutes',
    icon: '🎯',
  },
  {
    id: 'inbox_zero',
    title: 'Inbox Zero',
    description: 'Process all emails in your inbox',
    category: 'Productivity',
    color: '#a1a1aa',
    goalType: 'binary',
    icon: '📧',
  },
  {
    id: 'review_goals',
    title: 'Review Goals',
    description: 'Review progress toward your goals',
    category: 'Productivity',
    color: '#fbbf24',
    goalType: 'binary',
    icon: '🎯',
  },

  // Social
  {
    id: 'call_family',
    title: 'Call Family/Friends',
    description: 'Stay connected with loved ones',
    category: 'Social',
    color: '#fb7185',
    goalType: 'binary',
    icon: '📞',
  },
  {
    id: 'random_kindness',
    title: 'Random Act of Kindness',
    description: 'Do something kind for someone',
    category: 'Social',
    color: '#f472b6',
    goalType: 'binary',
    icon: '💝',
  },

  // Creative
  {
    id: 'write_journal',
    title: 'Write in Journal',
    description: 'Document your thoughts and experiences',
    category: 'Creative',
    color: '#c084fc',
    goalType: 'binary',
    icon: '✍️',
  },
  {
    id: 'creative_hobby',
    title: 'Creative Hobby',
    description: 'Spend time on a creative activity',
    category: 'Creative',
    color: '#e879f9',
    goalType: 'duration',
    goalTarget: 30,
    unit: 'minutes',
    icon: '🎨',
  },
  {
    id: 'photography',
    title: 'Take a Photo',
    description: 'Capture a moment or something interesting',
    category: 'Creative',
    color: '#38bdf8',
    goalType: 'binary',
    icon: '📸',
  },
]

// Get templates by category
export function getTemplatesByCategory(category: string): HabitTemplate[] {
  return HABIT_TEMPLATES.filter((t) => t.category === category)
}

// Get all unique categories
export function getTemplateCategories(): string[] {
  return [...new Set(HABIT_TEMPLATES.map((t) => t.category))]
}

// Get template by ID
export function getTemplateById(id: string): HabitTemplate | undefined {
  return HABIT_TEMPLATES.find((t) => t.id === id)
}
