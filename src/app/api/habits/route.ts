import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase, toHabitResponse, type DbHabit } from '@/lib/supabase'

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
    if (error) throw error

    const response = NextResponse.json((data as DbHabit[]).map(toHabitResponse))
    response.headers.set('Cache-Control', 'private, max-age=10, stale-while-revalidate=30')
    return response
  } catch (error) {
    console.error('Error fetching habits:', error)
    return NextResponse.json({ error: 'Failed to fetch habits' }, { status: 500 })
  }
}

// POST /api/habits
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { title, description, category, color, goalType, goalTarget, unit } = body
    if (!title || !goalType) return NextResponse.json({ error: 'Title and goalType are required' }, { status: 400 })

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

    if (error) throw error
    return NextResponse.json(toHabitResponse(data as DbHabit), { status: 201 })
  } catch (error) {
    console.error('Error creating habit:', error)
    return NextResponse.json({ error: 'Failed to create habit' }, { status: 500 })
  }
}
