import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase, toEntryResponse, type DbEntry } from '@/lib/supabase'
import { entryUpdateSchema } from '@/lib/validations'
import { checkRateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function updateEntry(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const { id } = await params
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Apply Rate Limiting
    const rateLimitResponse = checkRateLimit(request, userId)
    if (rateLimitResponse) return rateLimitResponse

    const body = await request.json()
    
    // Validate request body using Zod
    const validationResult = entryUpdateSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.flatten().fieldErrors 
      }, { status: 400 })
    }
    
    const validData = validationResult.data
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    
    if (validData.completed !== undefined) updates.completed = validData.completed
    if (validData.value !== undefined) updates.value = validData.value
    if (validData.notes !== undefined) updates.notes = validData.notes
    if (validData.mood !== undefined) updates.mood = validData.mood
    if (validData.energy !== undefined) updates.energy = validData.energy
    if (validData.duration !== undefined) updates.duration = validData.duration

    const { data, error } = await supabase
      .from('habit_entries')
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

// PUT /api/entries/[id]
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return updateEntry(request, context)
}

// PATCH /api/entries/[id]
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return updateEntry(request, context)
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
      .from('habit_entries')
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
