import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase, type DbFocusSession } from '@/lib/supabase'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data, error } = await supabase.from('focus_sessions').select('*').eq('user_id', userId)
    if (error) throw error
    const sessions = (data || []) as DbFocusSession[]
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0)
    const totalSessions = sessions.length
    const today = new Date().toISOString().slice(0, 10)
    const todaySessions = sessions.filter((s) => s.completed_at.slice(0, 10) === today)
    const todayMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0)
    return NextResponse.json({ totalMinutes, totalSessions, todayMinutes, todaySessions: todaySessions.length })
  } catch (error) {
    console.error('Error fetching focus stats:', error)
    return NextResponse.json({ error: 'Failed to fetch focus stats' }, { status: 500 })
  }
}
