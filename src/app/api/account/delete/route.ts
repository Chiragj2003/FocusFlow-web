import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { confirmation } = await request.json()
    if (confirmation !== 'delete my account') return NextResponse.json({ error: 'Invalid confirmation' }, { status: 400 })
    // Delete all user data
    await Promise.all([
      supabase.from('entries').delete().eq('user_id', userId),
      supabase.from('focus_sessions').delete().eq('user_id', userId),
      supabase.from('challenge_participants').delete().eq('user_id', userId),
      supabase.from('badges').delete().eq('user_id', userId),
    ])
    await supabase.from('habits').delete().eq('user_id', userId)
    await supabase.from('users').delete().eq('clerk_user_id', userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
