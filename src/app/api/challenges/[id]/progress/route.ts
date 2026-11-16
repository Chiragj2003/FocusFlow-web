import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { updateChallengeParticipantProgress } from '@/lib/challenge-progress'
import { getCatalog, toProgressInput } from '@/lib/challengeCatalog'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    const { id } = await params
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const challenge = (await getCatalog()).get(id)
    if (!challenge) return NextResponse.json({ progress: 0, completed: false, completedAt: null })

    const { data } = await supabase.from('challenge_participants')
      .select('*').eq('challenge_id', challenge.dbId).eq('user_id', userId).maybeSingle()
    if (!data) return NextResponse.json({ progress: 0, completed: false, completedAt: null })

    const progress = await updateChallengeParticipantProgress(userId, toProgressInput(challenge))
    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error fetching challenge progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
