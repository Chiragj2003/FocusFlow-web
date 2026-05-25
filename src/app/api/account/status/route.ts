import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data } = await supabase.from('users').select('is_deactivated').eq('clerk_user_id', userId).single()
    return NextResponse.json({ isDeactivated: data?.is_deactivated ?? false })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { action } = await request.json()
    const deactivate = action === 'deactivate'
    await supabase.from('users').update({ is_deactivated: deactivate, updated_at: new Date().toISOString() }).eq('clerk_user_id', userId)
    if (deactivate) {
      await supabase.from('habits').update({ active: false, updated_at: new Date().toISOString() }).eq('user_id', userId)
    } else {
      await supabase.from('habits').update({ active: true, updated_at: new Date().toISOString() }).eq('user_id', userId)
    }
    return NextResponse.json({ status: deactivate ? 'deactivated' : 'active' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
