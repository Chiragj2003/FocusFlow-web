import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data, error } = await supabase.from('challenge_participants').select('*').eq('user_id', userId)
    if (error) throw error
    return NextResponse.json((data || []).map((p: any) => ({
      id: p.id, challengeId: p.challenge_id, userId: p.user_id, progress: p.progress,
      joinedAt: p.joined_at, completedAt: p.completed_at,
    })))
  } catch (error) {
    console.error('Error fetching user challenges:', error)
    return NextResponse.json({ error: 'Failed to fetch user challenges' }, { status: 500 })
  }
}
