import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase, toBadgeResponse, type DbBadge } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data, error } = await supabase.from('badges').select('*').eq('user_id', userId).order('awarded_at', { ascending: false })
    if (error) throw error
    return NextResponse.json((data as DbBadge[]).map(toBadgeResponse), {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Error fetching badges:', error)
    return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const { name, metadata } = body
    if (!name) return NextResponse.json({ error: 'Badge name is required' }, { status: 400 })
    const { data, error } = await supabase.from('badges').insert([{ user_id: userId, name, metadata }]).select().single()
    if (error) throw error
    return NextResponse.json(toBadgeResponse(data as DbBadge))
  } catch (error) {
    console.error('Error awarding badge:', error)
    return NextResponse.json({ error: 'Failed to award badge' }, { status: 500 })
  }
}
