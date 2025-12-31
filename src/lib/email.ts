// Email service using Resend API
// You can also use other providers like SendGrid, Mailgun, etc.

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

interface SendEmailResult {
  success: boolean
  messageId?: string
  error?: string
}

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || 'FocusFlow <noreply@focusflow.app>'

export async function sendEmail(options: EmailOptions): Promise<SendEmailResult> {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Failed to send email:', error)
      return { success: false, error: 'Failed to send email' }
    }

    const data = await response.json()
    return { success: true, messageId: data.id }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: 'Email service error' }
  }
}

// Generate daily reminder email HTML
export function generateDailyReminderEmail(userName: string, stats: {
  totalHabits: number
  completedToday: number
  currentStreak: number
  pendingHabits: string[]
}): { subject: string; html: string; text: string } {
  const subject = `🎯 Your Daily Habit Check-in - ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`
  
  const greeting = getTimeBasedGreeting()
  const motivationalQuote = getRandomMotivationalQuote()
  
  const pendingHabitsHtml = stats.pendingHabits.length > 0
    ? `
      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 12px 0; color: #92400e; font-size: 16px;">⏳ Habits waiting for you today:</h3>
        <ul style="margin: 0; padding-left: 20px; color: #78350f;">
          ${stats.pendingHabits.map(habit => `<li style="margin: 8px 0;">${habit}</li>`).join('')}
        </ul>
      </div>
    `
    : `
      <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
        <h3 style="margin: 0; color: #065f46; font-size: 18px;">🎉 Amazing! You've completed all habits today!</h3>
      </div>
    `

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #18181b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="color: #ffffff; font-size: 28px; margin: 0; letter-spacing: -0.5px;">
        ✨ FocusFlow
      </h1>
      <p style="color: #a1a1aa; margin: 8px 0 0 0; font-size: 14px;">Your daily habit companion</p>
    </div>

    <!-- Main Card -->
    <div style="background: linear-gradient(180deg, #27272a 0%, #1f1f23 100%); border-radius: 16px; padding: 32px; border: 1px solid #3f3f46;">
      
      <!-- Greeting -->
      <h2 style="color: #ffffff; font-size: 22px; margin: 0 0 8px 0;">
        ${greeting}, ${userName || 'there'}! 👋
      </h2>
      <p style="color: #a1a1aa; margin: 0 0 24px 0; font-size: 15px; line-height: 1.6;">
        Here's your habit progress for today. Keep building those positive routines!
      </p>

      <!-- Stats Grid -->
      <div style="display: flex; gap: 12px; margin-bottom: 24px;">
        <div style="flex: 1; background: #3f3f46; border-radius: 12px; padding: 16px; text-align: center;">
          <div style="font-size: 28px; font-weight: bold; color: #ffffff;">${stats.completedToday}/${stats.totalHabits}</div>
          <div style="font-size: 12px; color: #a1a1aa; margin-top: 4px;">Completed</div>
        </div>
        <div style="flex: 1; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); border-radius: 12px; padding: 16px; text-align: center;">
          <div style="font-size: 28px; font-weight: bold; color: #ffffff;">🔥 ${stats.currentStreak}</div>
          <div style="font-size: 12px; color: rgba(255,255,255,0.8); margin-top: 4px;">Day Streak</div>
        </div>
      </div>

      <!-- Pending Habits -->
      ${pendingHabitsHtml}

      <!-- Motivational Quote -->
      <div style="background: #3f3f46; border-radius: 12px; padding: 20px; margin-top: 24px; border-left: 4px solid #8b5cf6;">
        <p style="color: #e4e4e7; font-style: italic; margin: 0; font-size: 15px; line-height: 1.6;">
          "${motivationalQuote.quote}"
        </p>
        <p style="color: #71717a; margin: 8px 0 0 0; font-size: 13px;">
          — ${motivationalQuote.author}
        </p>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin-top: 32px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://focusflow.app'}/habits" 
           style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 15px;">
          Track Your Habits →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; color: #71717a; font-size: 12px;">
      <p style="margin: 0 0 8px 0;">
        You're receiving this because you signed up for FocusFlow daily reminders.
      </p>
      <p style="margin: 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://focusflow.app'}/settings" style="color: #a1a1aa;">Manage preferences</a>
        &nbsp;•&nbsp;
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://focusflow.app'}/settings?unsubscribe=true" style="color: #a1a1aa;">Unsubscribe</a>
      </p>
    </div>

  </div>
</body>
</html>
  `.trim()

  const text = `
${greeting}, ${userName || 'there'}!

Here's your habit progress for today:
- Completed: ${stats.completedToday}/${stats.totalHabits}
- Current Streak: ${stats.currentStreak} days

${stats.pendingHabits.length > 0 
  ? `Habits waiting for you:\n${stats.pendingHabits.map(h => `• ${h}`).join('\n')}`
  : '🎉 Amazing! You\'ve completed all habits today!'
}

"${motivationalQuote.quote}" — ${motivationalQuote.author}

Track your habits: ${process.env.NEXT_PUBLIC_APP_URL || 'https://focusflow.app'}/habits

---
FocusFlow - Your daily habit companion
  `.trim()

  return { subject, html, text }
}

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getRandomMotivationalQuote(): { quote: string; author: string } {
  const quotes = [
    { quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
    { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { quote: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
    { quote: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    { quote: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
    { quote: "Your habits will determine your future.", author: "Jack Canfield" },
    { quote: "First we make our habits, then our habits make us.", author: "Charles C. Noble" },
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { quote: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  ]
  return quotes[Math.floor(Math.random() * quotes.length)]
}
