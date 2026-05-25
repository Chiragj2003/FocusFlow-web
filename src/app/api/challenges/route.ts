import { NextResponse } from 'next/server'
import { supabase, type DbChallenge } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase.from('challenges').select('*').eq('active', true)
    if (error) throw error
    return NextResponse.json((data as DbChallenge[]).map((c) => ({
      id: c.id, challengeId: c.challenge_id, title: c.title, description: c.description,
      type: c.type, target: c.target, duration: c.duration, reward: c.reward, active: c.active,
    })))
  } catch (error) {
    console.error('Error fetching challenges:', error)
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 })
  }
}
