import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase, toHabitResponse, type DbHabit } from '@/lib/supabase'
import { habitUpdateSchema } from '@/lib/validations'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
    
    const validationResult = habitUpdateSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.flatten().fieldErrors 
      }, { status: 400 })
    }
    
    const validData = validationResult.data
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    
    if (validData.title !== undefined) updates.title = validData.title
    if (validData.description !== undefined) updates.description = validData.description
    if (validData.category !== undefined) updates.category = validData.category
    if (validData.color !== undefined) updates.color = validData.color
    if (validData.goalType !== undefined) updates.goal_type = validData.goalType
    if (validData.goalTarget !== undefined) updates.goal_target = validData.goalTarget
    if (validData.unit !== undefined) updates.unit = validData.unit
    if (validData.active !== undefined) updates.active = validData.active

    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('[Supabase] Error updating habit:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: 'Failed to update habit', details: error.message, code: error.code },
        { status: 500 }
      )
    }
    if (!data) return NextResponse.json({ error: 'Habit not found' }, { status: 404 })

    return NextResponse.json(toHabitResponse(data as DbHabit))
  } catch (error) {
    console.error('[Supabase] Unexpected error updating habit:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to update habit', details: msg }, { status: 500 })
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

    if (error) {
      console.error('[Supabase] Error deleting habit:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: 'Failed to delete habit', details: error.message, code: error.code },
        { status: 500 }
      )
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Supabase] Unexpected error deleting habit:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to delete habit', details: msg }, { status: 500 })
  }
}
