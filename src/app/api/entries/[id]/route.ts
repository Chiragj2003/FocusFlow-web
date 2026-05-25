import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase, toEntryResponse, type DbEntry } from '@/lib/supabase'

// PUT /api/entries/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const { id } = await params
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (body.completed !== undefined) updates.completed = body.completed
    if (body.value !== undefined) updates.value = body.value
    if (body.notes !== undefined) updates.notes = body.notes

    const { data, error } = await supabase
      .from('entries')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Entry not found' }, { status: 404 })

    return NextResponse.json(toEntryResponse(data as DbEntry))
  } catch (error) {
    console.error('Error updating entry:', error)
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 })
  }
}

// DELETE /api/entries/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const { id } = await params
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase
      .from('entries')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting entry:', error)
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
}
