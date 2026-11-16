/* ==================== ORIGINAL CODE START ====================
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { dbUpsertUser } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await dbUpsertUser(userId)
    const { challengeId } = await request.json()
    if (!challengeId) return NextResponse.json({ error: 'challengeId is required' }, { status: 400 })

    const { data: existing } = await supabase.from('challenge_participants')
      .select('id').eq('challenge_id', challengeId).eq('user_id', userId).single()
    if (existing) return NextResponse.json({ error: 'Already joined' }, { status: 409 })

    const { data, error } = await supabase.from('challenge_participants').insert({
      challenge_id: challengeId, user_id: userId, progress: 0,
    }).select().single()
    if (error) throw error

    const { data: challenge } = await supabase.from('challenges').select('*').eq('challenge_id', data.challenge_id).single()
    return NextResponse.json({
      id: data.id,
      challengeId: data.challenge_id,
      userId: data.user_id,
      progress: data.progress,
      completed: !!data.completed_at,
      completedAt: data.completed_at,
      joinedAt: data.joined_at,
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
    }, { status: 201 })
  } catch (error) {
    console.error('Error joining challenge:', error)
    return NextResponse.json({ error: 'Failed to join challenge' }, { status: 500 })
  }
}
==================== ORIGINAL CODE END ==================== */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { dbUpsertUser } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await dbUpsertUser(userId)
    const { challengeId } = await request.json()
    if (!challengeId) return NextResponse.json({ error: 'challengeId is required' }, { status: 400 })

    // Check that challengeId exists in challenges table (column challenge_id)
    const { data: challengeExists } = await supabase
      .from('challenges')
      .select('challenge_id')
      .eq('challenge_id', challengeId)
      .maybeSingle()
    if (!challengeExists) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    // Use maybeSingle() to check if already joined
    const { data: existing } = await supabase
      .from('challenge_participants')
      .select('id')
      .eq('challenge_id', challengeId)
      .eq('user_id', userId)
      .maybeSingle()
    if (existing) return NextResponse.json({ error: 'Already joined' }, { status: 409 })

    const { data, error } = await supabase.from('challenge_participants').insert({
      challenge_id: challengeId,
      user_id: userId,
      progress: 0,
    }).select().single()
    if (error) throw error

    const { data: challenge } = await supabase.from('challenges').select('*').eq('challenge_id', data.challenge_id).single()
    return NextResponse.json({
      id: data.id,
      challengeId: data.challenge_id,
      userId: data.user_id,
      progress: data.progress,
      completed: !!data.completed_at,
      completedAt: data.completed_at,
      joinedAt: data.joined_at,
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
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error joining challenge:', error)
    return NextResponse.json(
      {
        error: 'Failed to join challenge',
        details: error?.message,
        code: error?.code,
      },
      { status: 500 }
    )
  }
}
