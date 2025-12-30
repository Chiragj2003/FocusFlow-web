// Motivational Quotes for Dashboard

export interface Quote {
  text: string
  author: string
}

export const MOTIVATIONAL_QUOTES: Quote[] = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius"
  },
  {
    text: "Motivation is what gets you started. Habit is what keeps you going.",
    author: "Jim Ryun"
  },
  {
    text: "Small daily improvements are the key to staggering long-term results.",
    author: "Robin Sharma"
  },
  {
    text: "The journey of a thousand miles begins with a single step.",
    author: "Lao Tzu"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "Your habits will determine your future.",
    author: "Jack Canfield"
  },
  {
    text: "The difference between who you are and who you want to be is what you do.",
    author: "Unknown"
  },
  {
    text: "Champions keep playing until they get it right.",
    author: "Billie Jean King"
  },
  {
    text: "Progress, not perfection, is what we should be asking of ourselves.",
    author: "Julia Cameron"
  },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar"
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb"
  },
  {
    text: "Consistency is the key to achieving and maintaining momentum.",
    author: "Darren Hardy"
  },
  {
    text: "Every action you take is a vote for the type of person you wish to become.",
    author: "James Clear"
  },
  {
    text: "It's not about being the best. It's about being better than you were yesterday.",
    author: "Unknown"
  },
  {
    text: "What you do every day matters more than what you do once in a while.",
    author: "Gretchen Rubin"
  },
  {
    text: "Discipline is the bridge between goals and accomplishment.",
    author: "Jim Rohn"
  },
  {
    text: "A year from now you may wish you had started today.",
    author: "Karen Lamb"
  },
  {
    text: "Your future is created by what you do today, not tomorrow.",
    author: "Robert Kiyosaki"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt"
  },
  {
    text: "Make each day your masterpiece.",
    author: "John Wooden"
  },
  {
    text: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe"
  },
  {
    text: "Habits are the compound interest of self-improvement.",
    author: "James Clear"
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Unknown"
  },
  {
    text: "Dream big. Start small. Act now.",
    author: "Robin Sharma"
  },
]

// Get a random quote
export function getRandomQuote(): Quote {
  const index = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
  return MOTIVATIONAL_QUOTES[index]
}

// Get quote based on day (consistent for the day)
export function getDailyQuote(): Quote {
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 
    (1000 * 60 * 60 * 24)
  )
  const index = dayOfYear % MOTIVATIONAL_QUOTES.length
  return MOTIVATIONAL_QUOTES[index]
}

// Streak-based messages
export interface StreakMessage {
  minStreak: number
  maxStreak: number
  messages: string[]
}

export const STREAK_MESSAGES: StreakMessage[] = [
  {
    minStreak: 0,
    maxStreak: 0,
    messages: [
      "Today is day one. Let's make it count! 🚀",
      "Every master was once a beginner. Start now! 💪",
      "The best time to start is now! 🌟",
    ],
  },
  {
    minStreak: 1,
    maxStreak: 2,
    messages: [
      "Great start! Keep the momentum going! 🎯",
      "You're building something great! 🌱",
      "One day at a time. You've got this! 💫",
    ],
  },
  {
    minStreak: 3,
    maxStreak: 6,
    messages: [
      "You're on fire! Keep it up! 🔥",
      "Consistency is your superpower! ⚡",
      "Look at you go! Amazing progress! 🌟",
    ],
  },
  {
    minStreak: 7,
    maxStreak: 13,
    messages: [
      "A whole week! You're unstoppable! 🏆",
      "Week warrior status unlocked! 💎",
      "Seven days strong! Incredible! 🎉",
    ],
  },
  {
    minStreak: 14,
    maxStreak: 29,
    messages: [
      "Two weeks and counting! You're a habit machine! 🤖",
      "Fortnight fighter! Your dedication is inspiring! 💪",
      "This is becoming second nature to you! 🧠",
    ],
  },
  {
    minStreak: 30,
    maxStreak: 59,
    messages: [
      "A whole month! You're officially a habit master! 👑",
      "30 days of pure dedication! Legendary! 🏅",
      "Monthly master! Nothing can stop you now! 🚀",
    ],
  },
  {
    minStreak: 60,
    maxStreak: 99,
    messages: [
      "60+ days! You're in the elite club now! 💎",
      "Two months strong! Absolutely incredible! 🌟",
      "Your discipline is extraordinary! 🏆",
    ],
  },
  {
    minStreak: 100,
    maxStreak: 364,
    messages: [
      "CENTURY CLUB! 100+ days of pure excellence! 👑",
      "Triple digits! You're an inspiration! 🌟",
      "100+ days! You've proven anything is possible! 💫",
    ],
  },
  {
    minStreak: 365,
    maxStreak: Infinity,
    messages: [
      "A FULL YEAR! You're a LEGEND! 🏆👑🌟",
      "365+ days! Words can't describe how amazing you are! 💎",
      "Year champion! You've achieved the extraordinary! 🎉",
    ],
  },
]

// Get streak-based message
export function getStreakMessage(streak: number): string {
  const category = STREAK_MESSAGES.find(
    (s) => streak >= s.minStreak && streak <= s.maxStreak
  )
  
  if (!category) {
    return "Keep going! You're doing great! 💪"
  }
  
  const index = Math.floor(Math.random() * category.messages.length)
  return category.messages[index]
}

// Get consistent streak message for the day
export function getDailyStreakMessage(streak: number): string {
  const category = STREAK_MESSAGES.find(
    (s) => streak >= s.minStreak && streak <= s.maxStreak
  )
  
  if (!category) {
    return "Keep going! You're doing great! 💪"
  }
  
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 
    (1000 * 60 * 60 * 24)
  )
  const index = dayOfYear % category.messages.length
  return category.messages[index]
}
