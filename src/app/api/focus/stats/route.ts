import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

// GET /api/focus/stats - Get focus session statistics
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all sessions for the user
    const sessions = await prisma.focusSession.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    })

    // Calculate stats
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(todayStart)
    weekStart.setDate(weekStart.getDate() - 7)

    const totalSessions = sessions.length
    const totalSeconds = sessions.reduce((sum, s) => sum + s.duration, 0)
    const totalMinutes = Math.floor(totalSeconds / 60)

    const todaySessions = sessions.filter(s => new Date(s.completedAt) >= todayStart)
    const todayMinutes = Math.floor(todaySessions.reduce((sum, s) => sum + s.duration, 0) / 60)

    const weekSessions = sessions.filter(s => new Date(s.completedAt) >= weekStart)
    const weekMinutes = Math.floor(weekSessions.reduce((sum, s) => sum + s.duration, 0) / 60)

    const averageSessionLength = totalSessions > 0 
      ? Math.floor(totalSeconds / totalSessions / 60) 
      : 0

    const longestSession = sessions.length > 0
      ? Math.floor(Math.max(...sessions.map(s => s.duration)) / 60)
      : 0

    return NextResponse.json({
      totalSessions,
      totalMinutes,
      todayMinutes,
      weekMinutes,
      averageSessionLength,
      longestSession,
    })
  } catch (error) {
    console.error('Error fetching focus stats:', error)
    return NextResponse.json({ error: 'Failed to fetch focus stats' }, { status: 500 })
  }
}
