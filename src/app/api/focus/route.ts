import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase, toFocusSessionResponse, type DbFocusSession } from '@/lib/supabase'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data, error } = await supabase.from('focus_sessions').select('*').eq('user_id', userId).order('completed_at', { ascending: false }).limit(50)
    if (error) throw error
    return NextResponse.json((data as DbFocusSession[]).map(toFocusSessionResponse))
  } catch (error) {
    console.error('Error fetching focus sessions:', error)
    return NextResponse.json({ error: 'Failed to fetch focus sessions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const { habitId, duration, notes } = body
    if (!duration) return NextResponse.json({ error: 'Duration is required' }, { status: 400 })
    const { data, error } = await supabase.from('focus_sessions').insert({
      user_id: userId, habit_id: habitId || null, duration, notes: notes || null,
      completed_at: new Date().toISOString(),
    }).select().single()
    if (error) throw error
    return NextResponse.json(toFocusSessionResponse(data as DbFocusSession), { status: 201 })
  } catch (error) {
    console.error('Error creating focus session:', error)
    return NextResponse.json({ error: 'Failed to create focus session' }, { status: 500 })
  }
}
