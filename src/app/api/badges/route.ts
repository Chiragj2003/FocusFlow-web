import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase, toBadgeResponse, type DbBadge } from '@/lib/supabase'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data, error } = await supabase.from('badges').select('*').eq('user_id', userId).order('awarded_at', { ascending: false })
    if (error) throw error
    return NextResponse.json((data as DbBadge[]).map(toBadgeResponse))
  } catch (error) {
    console.error('Error fetching badges:', error)
    return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 })
  }
}
