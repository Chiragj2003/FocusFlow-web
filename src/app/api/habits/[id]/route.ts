import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase, toHabitResponse, type DbHabit } from '@/lib/supabase'

// PATCH /api/habits/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const { id } = await params
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (body.title !== undefined) updates.title = body.title
    if (body.description !== undefined) updates.description = body.description
    if (body.category !== undefined) updates.category = body.category
    if (body.color !== undefined) updates.color = body.color
    if (body.goalType !== undefined) updates.goal_type = body.goalType
    if (body.goalTarget !== undefined) updates.goal_target = body.goalTarget
    if (body.unit !== undefined) updates.unit = body.unit
    if (body.active !== undefined) updates.active = body.active

    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Habit not found' }, { status: 404 })

    return NextResponse.json(toHabitResponse(data as DbHabit))
  } catch (error) {
    console.error('Error updating habit:', error)
    return NextResponse.json({ error: 'Failed to update habit' }, { status: 500 })
  }
}

// DELETE /api/habits/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const { id } = await params
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting habit:', error)
    return NextResponse.json({ error: 'Failed to delete habit' }, { status: 500 })
  }
}
