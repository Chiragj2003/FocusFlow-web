import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { updateChallengeParticipantProgress } from '@/lib/challenge-progress'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data, error } = await supabase.from('challenge_participants').select('*').eq('user_id', userId)
    if (error) throw error
    const challengeIds = [...new Set((data || []).map((p: any) => p.challenge_id))]
    const { data: challenges } = challengeIds.length
      ? await supabase.from('challenges').select('*').in('challenge_id', challengeIds)
      : { data: [] }
    const challengeById = new Map((challenges || []).map((c: any) => [c.challenge_id, c]))

    const rows = await Promise.all((data || []).map(async (p: any) => {
      const challenge = challengeById.get(p.challenge_id)
      const progress = challenge
        ? await updateChallengeParticipantProgress(userId, challenge as any)
        : { progress: p.progress, completed: !!p.completed_at, completedAt: p.completed_at }
      return {
        id: p.id,
        challengeId: p.challenge_id,
        userId: p.user_id,
        progress: progress.progress,
        completed: progress.completed,
        joinedAt: p.joined_at,
        completedAt: progress.completedAt,
        challenge: challenge ? {
          id: challenge.challenge_id,
          dbId: challenge.id,
          challengeId: challenge.challenge_id,
          title: challenge.title,
          description: challenge.description,
          type: challenge.type,
          target: challenge.target,
          duration: challenge.duration,
          reward: challenge.reward,
          active: challenge.active,
        } : null,
      }
    }))

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching user challenges:', error)
    return NextResponse.json({ error: 'Failed to fetch user challenges' }, { status: 500 })
  }
}
