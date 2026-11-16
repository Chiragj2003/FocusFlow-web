import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { updateChallengeParticipantProgress } from '@/lib/challenge-progress'
import { getCatalog, toApiChallenge, toProgressInput } from '@/lib/challengeCatalog'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data, error } = await supabase.from('challenge_participants').select('*').eq('user_id', userId)
    if (error) throw error

    // challenges.id (uuid) -> catalog entry ("ach_1", type, target, ...)
    const byDbId = new Map([...(await getCatalog()).values()].map((c) => [c.dbId, c]))

    const rows = await Promise.all((data || []).map(async (p) => {
      const challenge = byDbId.get(p.challenge_id)
      const progress = challenge
        ? await updateChallengeParticipantProgress(userId, toProgressInput(challenge))
        : { progress: p.progress, completed: !!p.completed_at, completedAt: p.completed_at }
      return {
        id: p.id,
        challengeId: challenge ? challenge.key : p.challenge_id,
        userId: p.user_id,
        progress: progress.progress,
        completed: progress.completed,
        joinedAt: p.started_at,
        completedAt: progress.completedAt,
        challenge: challenge ? toApiChallenge(challenge) : null,
      }
    }))

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching user challenges:', error)
    return NextResponse.json({ error: 'Failed to fetch user challenges' }, { status: 500 })
  }
}
