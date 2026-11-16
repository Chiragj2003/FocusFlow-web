import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase, type DbFocusSession } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data, error } = await supabase.from('focus_sessions').select('*').eq('user_id', userId)
    if (error) throw error
    const sessions = (data || []) as DbFocusSession[]
    const totalSeconds = sessions.reduce((sum, s) => sum + s.duration, 0)
    const totalSessions = sessions.length
    const today = new Date().toISOString().slice(0, 10)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const todaySessions = sessions.filter((s) => s.completed_at.slice(0, 10) === today)
    const todaySeconds = todaySessions.reduce((sum, s) => sum + s.duration, 0)
    const weekSessions = sessions.filter((s) => new Date(s.completed_at) >= weekAgo)
    const weekSeconds = weekSessions.reduce((sum, s) => sum + s.duration, 0)
    const longestSessionSeconds = sessions.length > 0 ? Math.max(...sessions.map((s) => s.duration)) : 0

    return NextResponse.json({
      totalSessions,
      totalMinutes: Math.floor(totalSeconds / 60),
      todayMinutes: Math.floor(todaySeconds / 60),
      weekMinutes: Math.floor(weekSeconds / 60),
      averageSessionLength: totalSessions > 0 ? Math.floor(totalSeconds / totalSessions / 60) : 0,
      longestSession: Math.floor(longestSessionSeconds / 60),
      todaySessions: todaySessions.length,
    })
  } catch (error) {
    console.error('Error fetching focus stats:', error)
    return NextResponse.json({ error: 'Failed to fetch focus stats' }, { status: 500 })
  }
}
