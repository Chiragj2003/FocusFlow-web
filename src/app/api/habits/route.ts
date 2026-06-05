import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase, toHabitResponse, type DbHabit } from '@/lib/supabase'
import { dbUpsertUser } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/habits
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const searchParams = request.nextUrl.searchParams
    const active = searchParams.get('active')
    const category = searchParams.get('category')

    let query = supabase.from('habits').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (active !== null) query = query.eq('active', active === 'true')
    if (category) query = query.eq('category', category)

    const { data, error } = await query
    if (error) {
      console.error('[Supabase] Error fetching habits:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: 'Failed to fetch habits', details: error.message, code: error.code },
        { status: 500 }
      )
    }

    const response = NextResponse.json((data as DbHabit[]).map(toHabitResponse))
    response.headers.set('Cache-Control', 'private, max-age=10, stale-while-revalidate=30')
    return response
  } catch (error) {
    console.error('[Supabase] Unexpected error fetching habits:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to fetch habits', details: msg }, { status: 500 })
  }
}

// POST /api/habits
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Ensure user exists in DB before creating habit
    await dbUpsertUser(userId)

    const body = await request.json()
    const { title, description, category, color, goalType, goalTarget, unit } = body
    if (!title || !goalType) return NextResponse.json({ error: 'Title and goalType are required' }, { status: 400 })

    // Ensure no duplicate active habit name for the same user
    const { data: existingHabits, error: fetchError } = await supabase
      .from('habits')
      .select('title')
      .eq('user_id', userId)
      .eq('active', true)
    
    if (!fetchError && existingHabits) {
      const isDuplicate = existingHabits.some(
        (h) => h.title.trim().toLowerCase().replace(/\s+/g, ' ') === title.trim().toLowerCase().replace(/\s+/g, ' ')
      )
      if (isDuplicate) {
        return NextResponse.json({ error: 'A habit with this name already exists' }, { status: 400 })
      }
    }

    const { data, error } = await supabase.from('habits').insert({
      user_id: userId,
      title,
      description: description || null,
      category: category || null,
      color: color || '#ffffff',
      goal_type: goalType,
      goal_target: goalTarget || null,
      unit: unit || null,
    }).select().single()

    if (error) {
      console.error('[Supabase] Error creating habit:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: 'Failed to create habit', details: error.message, code: error.code },
        { status: 500 }
      )
    }
    return NextResponse.json(toHabitResponse(data as DbHabit), { status: 201 })
  } catch (error) {
    console.error('[Supabase] Unexpected error creating habit:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to create habit', details: msg }, { status: 500 })
  }
}
