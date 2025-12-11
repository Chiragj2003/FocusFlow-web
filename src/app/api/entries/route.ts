import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'

// GET /api/entries - Get entries for a date range
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const habitId = searchParams.get('habitId')
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    const where: { userId: string; habitId?: string; entryDate?: { gte?: Date; lte?: Date } } = { userId }
    
    if (habitId) {
      where.habitId = habitId
    }
    
    if (start) {
      where.entryDate = { ...where.entryDate, gte: new Date(start) }
    }
    
    if (end) {
      where.entryDate = { ...where.entryDate, lte: new Date(end) }
    }

    const entries = await prisma.habitEntry.findMany({
      where,
      include: {
        habit: {
          select: { title: true, color: true, goalType: true },
        },
      },
      orderBy: { entryDate: 'desc' },
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error('Error fetching entries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    )
  }
}

// POST /api/entries - Create or update an entry (upsert)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { habitId, entryDate, completed, value, notes } = body

    if (!habitId || !entryDate) {
      return NextResponse.json(
        { error: 'habitId and entryDate are required' },
        { status: 400 }
      )
    }

    // Verify habit ownership
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    })

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    const parsedDate = new Date(entryDate)

    // Upsert the entry
    const entry = await prisma.habitEntry.upsert({
      where: {
        habitId_userId_entryDate: {
          habitId,
          userId,
          entryDate: parsedDate,
        },
      },
      update: {
        completed: completed ?? false,
        value: value ?? 0,
        notes: notes ?? null,
      },
      create: {
        habitId,
        userId,
        entryDate: parsedDate,
        completed: completed ?? false,
        value: value ?? 0,
        notes: notes ?? null,
      },
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error('Error upserting entry:', error)
    return NextResponse.json(
      { error: 'Failed to save entry' },
      { status: 500 }
    )
  }
}
