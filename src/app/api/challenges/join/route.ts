import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { dbUpsertUser } from '@/lib/db'
import { getCatalog, toApiChallenge } from '@/lib/challengeCatalog'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await dbUpsertUser(userId)
    const { challengeId } = await request.json()
    if (!challengeId) return NextResponse.json({ error: 'challengeId is required' }, { status: 400 })

    // "ach_1" -> its challenges row (created on first use)
    const challenge = (await getCatalog()).get(challengeId)
    if (!challenge || !challenge.active) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    const { data: existing } = await supabase
      .from('challenge_participants')
      .select('id')
      .eq('challenge_id', challenge.dbId)
      .eq('user_id', userId)
      .maybeSingle()
    if (existing) return NextResponse.json({ error: 'Already joined' }, { status: 409 })

    const { data, error } = await supabase
      .from('challenge_participants')
      .insert({ challenge_id: challenge.dbId, user_id: userId, progress: 0 })
      .select()
      .single()
    if (error) {
      // Unique (challenge_id, user_id): a double tap raced us
      if (error.code === '23505') return NextResponse.json({ error: 'Already joined' }, { status: 409 })
      throw error
    }

    return NextResponse.json({
      id: data.id,
      challengeId: challenge.key,
      userId: data.user_id,
      progress: data.progress,
      completed: !!data.completed_at,
      completedAt: data.completed_at,
      joinedAt: data.started_at,
      challenge: toApiChallenge(challenge),
    }, { status: 201 })
  } catch (error: unknown) {
    const e = error as { message?: string; code?: string }
    console.error('Error joining challenge:', error)
    return NextResponse.json(
      { error: 'Failed to join challenge', details: e?.message, code: e?.code },
      { status: 500 }
    )
  }
}
