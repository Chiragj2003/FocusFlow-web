import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendEmail, generateDailyReminderEmail, canSendEmail, EMAIL_RATE_LIMIT_DAYS } from '@/lib/email'
import { clerkClient } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const todayStr = new Date().toISOString().slice(0, 10)
    const { data: users } = await supabase.from('users').select('*').eq('is_deactivated', false)

    const results = { total: (users || []).length, sent: 0, failed: 0, skipped: 0, rateLimited: 0, errors: [] as string[] }

    for (const user of users || []) {
      try {
        const { data: habits } = await supabase.from('habits').select('id,title').eq('user_id', user.clerk_user_id).eq('active', true)
        if (!habits || habits.length === 0) { results.skipped++; continue }

        const { data: entries } = await supabase.from('entries').select('*').eq('user_id', user.clerk_user_id).eq('entry_date', todayStr)

        let userEmail = user.email
        let userName = user.name
        if (!userEmail) {
          try {
            const client = await clerkClient()
            const clerkUser = await client.users.getUser(user.clerk_user_id)
            userEmail = clerkUser.emailAddresses[0]?.emailAddress
            userName = clerkUser.firstName || null
            if (userEmail) {
              await supabase.from('users').update({ email: userEmail, name: userName }).eq('id', user.id)
            }
          } catch { results.skipped++; continue }
        }
        if (!userEmail) { results.skipped++; continue }

        const completedToday = (entries || []).filter((e: any) => e.completed).length
        const pendingHabits = habits.filter((h: any) => !(entries || []).some((e: any) => e.habit_id === h.id && e.completed)).map((h: any) => h.title)

        const emailContent = generateDailyReminderEmail(userName || 'there', {
          totalHabits: habits.length, completedToday, currentStreak: 0, pendingHabits,
        })

        const result = await sendEmail({
          to: userEmail, subject: emailContent.subject, html: emailContent.html, text: emailContent.text,
          tags: [{ name: 'type', value: 'weekly-reminder' }, { name: 'userId', value: user.clerk_user_id }],
        })

        if (result.success) { results.sent++ } else { results.failed++; results.errors.push(`${userEmail}: ${result.error}`) }
      } catch (error) {
        results.failed++
        results.errors.push(`User ${user.clerk_user_id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({ message: `Weekly reminder job completed`, results, timestamp: new Date().toISOString() })
  } catch (error) {
    console.error('Daily reminder error:', error)
    return NextResponse.json({ error: 'Failed to send daily reminders' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({
    status: 'ready',
    config: { hasResendKey: !!process.env.RESEND_API_KEY, hasCronSecret: !!process.env.CRON_SECRET, rateLimitDays: EMAIL_RATE_LIMIT_DAYS },
  })
}
