import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { convex } from '@/lib/convex'
import { api } from '../../../../convex/_generated/api'

// Force dynamic rendering for auth
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/habits - List all habits for the current user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const active = searchParams.get('active')
    const category = searchParams.get('category')

    const habits = await convex.query(api.habits.list, {
      userId,
      ...(active !== null ? { active: active === 'true' } : {}),
      ...(category ? { category } : {}),
    })

    // Add cache headers for faster subsequent requests
    const response = NextResponse.json(habits)
    response.headers.set('Cache-Control', 'private, max-age=10, stale-while-revalidate=30')
    return response
  } catch (error) {
    console.error('Error fetching habits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch habits' },
      { status: 500 }
    )
  }
}

// POST /api/habits - Create a new habit
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category, color, goalType, goalTarget, unit } = body

    if (!title || !goalType) {
      return NextResponse.json(
        { error: 'Title and goalType are required' },
        { status: 400 }
      )
    }

    const habit = await convex.mutation(api.habits.create, {
      userId,
      title,
      description,
      category,
      color,
      goalType,
      goalTarget,
      unit,
    })

    return NextResponse.json(habit, { status: 201 })
  } catch (error) {
    console.error('Error creating habit:', error)
    return NextResponse.json(
      { error: 'Failed to create habit' },
      { status: 500 }
    )
  }
}
