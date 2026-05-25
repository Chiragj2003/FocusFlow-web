import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    const { id } = await params
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data, error } = await supabase.from('challenge_participants')
      .select('*').eq('challenge_id', id).eq('user_id', userId).single()
    if (error || !data) return NextResponse.json({ progress: 0, completedAt: null })
    return NextResponse.json({ progress: data.progress, completedAt: data.completed_at })
  } catch (error) {
    console.error('Error fetching challenge progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
