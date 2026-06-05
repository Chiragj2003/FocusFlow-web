import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase, toEntryResponse, type DbEntry } from '@/lib/supabase'
import { dbUpsertUser } from '@/lib/db'

// GET /api/entries
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const searchParams = request.nextUrl.searchParams
    const habitId = searchParams.get('habitId')
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    let query = supabase.from('habit_entries').select('*').eq('user_id', userId)
    if (habitId) query = query.eq('habit_id', habitId)
    if (start) query = query.gte('entry_date', start)
    if (end) query = query.lte('entry_date', end)
    query = query.order('entry_date', { ascending: false })

    const { data, error } = await query
    if (error) {
      console.error('[Supabase] Error fetching entries:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: 'Failed to fetch entries', details: error.message, code: error.code },
        { status: 500 }
      )
    }

    const response = NextResponse.json((data as DbEntry[]).map(toEntryResponse))
    response.headers.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=60')
    return response
  } catch (error) {
    console.error('[Supabase] Unexpected error fetching entries:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to fetch entries', details: msg }, { status: 500 })
  }
}

// POST /api/entries - Upsert
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Ensure user exists in DB before creating entry
    await dbUpsertUser(userId)

    const body = await request.json()
    const { habitId, entryDate, completed, value, notes, mood, energy, duration } = body
    if (!habitId || !entryDate) return NextResponse.json({ error: 'habitId and entryDate are required' }, { status: 400 })

    // Verify habit belongs to user
    const { data: habit } = await supabase.from('habits').select('id').eq('id', habitId).eq('user_id', userId).single()
    if (!habit) return NextResponse.json({ error: 'Habit not found' }, { status: 404 })

    const { data, error } = await supabase
      .from('habit_entries')
      .upsert(
        {
          habit_id: habitId,
          user_id: userId,
          entry_date: entryDate,
          completed: completed ?? false,
          value: value ?? null,
          notes: notes ?? null,
          mood: mood ?? null,
          energy: energy ?? null,
          duration: duration ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'habit_id,user_id,entry_date' }
      )
      .select()
      .single()

    if (error) {
      console.error('[Supabase] Error upserting entry:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: 'Failed to save entry', details: error.message, code: error.code },
        { status: 500 }
      )
    }
    return NextResponse.json(toEntryResponse(data as DbEntry))
  } catch (error) {
    console.error('[Supabase] Unexpected error upserting entry:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to save entry', details: msg }, { status: 500 })
  }
}
