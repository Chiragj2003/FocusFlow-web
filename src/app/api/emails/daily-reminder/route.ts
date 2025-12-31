import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { sendEmail, generateDailyReminderEmail } from '@/lib/email'
import { clerkClient } from '@clerk/nextjs/server'

// POST /api/emails/daily-reminder
// This endpoint sends daily reminder emails to all users
// Should be called by a cron job service (Vercel Cron, Railway Cron, etc.)
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized calls
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get today's date range
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get all users with active habits
    const usersWithHabits = await prisma.user.findMany({
      where: {
        habits: {
          some: {
            active: true,
          },
        },
      },
      include: {
        habits: {
          where: { active: true },
        },
        entries: {
          where: {
            entryDate: {
              gte: today,
              lt: tomorrow,
            },
          },
        },
      },
    })

    const results = {
      total: usersWithHabits.length,
      sent: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[],
    }

    // Process each user
    for (const user of usersWithHabits) {
      try {
        // Get user email from Clerk
        let userEmail = user.email
        let userName = user.name

        if (!userEmail) {
          // Fetch from Clerk if not stored locally
          try {
            const client = await clerkClient()
            const clerkUser = await client.users.getUser(user.id)
            userEmail = clerkUser.emailAddresses[0]?.emailAddress
            userName = clerkUser.firstName || clerkUser.username || undefined

            // Update local user record with email
            if (userEmail) {
              await prisma.user.update({
                where: { id: user.id },
                data: { 
                  email: userEmail,
                  name: userName,
                },
              })
            }
          } catch {
            console.error(`Failed to fetch Clerk user: ${user.id}`)
          }
        }

        if (!userEmail) {
          results.skipped++
          continue
        }

        // Calculate user stats
        const totalHabits = user.habits.length
        const completedToday = user.entries.filter((e: { completed: boolean }) => e.completed).length
        const pendingHabits = user.habits
          .filter((habit: { id: string; title: string }) => 
            !user.entries.some((e: { habitId: string; completed: boolean }) => e.habitId === habit.id && e.completed)
          )
          .map((h: { title: string }) => h.title)

        // Calculate streak (simplified - check consecutive days)
        const streak = await calculateStreak(user.id, totalHabits)

        // Generate and send email
        const emailContent = generateDailyReminderEmail(userName || 'there', {
          totalHabits,
          completedToday,
          currentStreak: streak,
          pendingHabits,
        })

        const result = await sendEmail({
          to: userEmail,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        })

        if (result.success) {
          results.sent++
        } else {
          results.failed++
          results.errors.push(`${userEmail}: ${result.error}`)
        }
      } catch (error) {
        results.failed++
        results.errors.push(`User ${user.id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      message: 'Daily reminder job completed',
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Daily reminder error:', error)
    return NextResponse.json(
      { error: 'Failed to send daily reminders' },
      { status: 500 }
    )
  }
}

// Calculate user's current streak
async function calculateStreak(userId: string, totalHabits: number): Promise<number> {
  if (totalHabits === 0) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check up to 365 days back
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - i)
    const nextDate = new Date(checkDate)
    nextDate.setDate(nextDate.getDate() + 1)

    const entriesForDay = await prisma.habitEntry.count({
      where: {
        userId,
        completed: true,
        entryDate: {
          gte: checkDate,
          lt: nextDate,
        },
      },
    })

    // If user completed at least one habit that day, count it
    if (entriesForDay > 0) {
      streak++
    } else if (i > 0) {
      // Don't break streak for today (they might not have completed yet)
      break
    }
  }

  return streak
}

// GET endpoint to check status (useful for debugging)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    status: 'ready',
    message: 'Daily reminder endpoint is ready. POST to trigger sending.',
    config: {
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasFromEmail: !!process.env.FROM_EMAIL,
      hasCronSecret: !!process.env.CRON_SECRET,
    },
  })
}
