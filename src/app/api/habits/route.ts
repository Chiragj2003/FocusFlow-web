import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'

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

    const where: { userId: string; active?: boolean; category?: string } = { userId }
    
    if (active !== null) {
      where.active = active === 'true'
    }
    
    if (category) {
      where.category = category
    }

    const habits = await prisma.habit.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(habits)
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

    // Ensure user exists in our database (upsert to avoid conflicts)
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        timezone: 'UTC',
      },
    })

    const habit = await prisma.habit.create({
      data: {
        userId,
        title,
        description,
        category,
        color: color || '#FFB4A2',
        goalType,
        goalTarget,
        unit,
      },
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
