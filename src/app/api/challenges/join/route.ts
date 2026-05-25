import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { challengeId } = await request.json()
    if (!challengeId) return NextResponse.json({ error: 'challengeId is required' }, { status: 400 })

    const { data: existing } = await supabase.from('challenge_participants')
      .select('id').eq('challenge_id', challengeId).eq('user_id', userId).single()
    if (existing) return NextResponse.json({ error: 'Already joined' }, { status: 409 })

    const { data, error } = await supabase.from('challenge_participants').insert({
      challenge_id: challengeId, user_id: userId, progress: 0,
    }).select().single()
    if (error) throw error
    return NextResponse.json({ id: data.id, challengeId: data.challenge_id, userId: data.user_id, progress: data.progress, joinedAt: data.joined_at }, { status: 201 })
  } catch (error) {
    console.error('Error joining challenge:', error)
    return NextResponse.json({ error: 'Failed to join challenge' }, { status: 500 })
  }
}
