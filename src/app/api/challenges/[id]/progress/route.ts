import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { updateChallengeParticipantProgress } from '@/lib/challenge-progress'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    const { id } = await params
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data, error } = await supabase.from('challenge_participants')
      .select('*').eq('challenge_id', id).eq('user_id', userId).single()
    if (error || !data) return NextResponse.json({ progress: 0, completed: false, completedAt: null })
    const { data: challenge } = await supabase.from('challenges').select('*').eq('challenge_id', id).single()
    if (!challenge) return NextResponse.json({ progress: data.progress, completed: !!data.completed_at, completedAt: data.completed_at })
    const progress = await updateChallengeParticipantProgress(userId, challenge as any)
    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error fetching challenge progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
