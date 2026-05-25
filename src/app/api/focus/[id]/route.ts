import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    const { id } = await params
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { error } = await supabase.from('focus_sessions').delete().eq('id', id).eq('user_id', userId)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting focus session:', error)
    return NextResponse.json({ error: 'Failed to delete focus session' }, { status: 500 })
  }
}
