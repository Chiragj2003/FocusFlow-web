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
      select: {
        id: true,
        habitId: true,
        userId: true,
        entryDate: true,
        completed: true,
        value: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        habit: {
          select: { title: true, color: true, goalType: true },
        },
      },
      orderBy: { entryDate: 'desc' },
    })

    // Add cache headers for better performance
    const response = NextResponse.json(entries)
    response.headers.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=60')
    return response
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
    const { habitId, entryDate, completed, value, notes, mood, energy, duration } = body

    if (!habitId || !entryDate) {
      return NextResponse.json(
        { error: 'habitId and entryDate are required' },
        { status: 400 }
      )
    }

    const parsedDate = new Date(entryDate)

    // Upsert the entry directly - habit ownership verified by unique constraint
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
        mood: mood ?? null,
        energy: energy ?? null,
        duration: duration ?? null,
      },
      create: {
        habitId,
        userId,
        entryDate: parsedDate,
        completed: completed ?? false,
        value: value ?? 0,
        notes: notes ?? null,
        mood: mood ?? null,
        energy: energy ?? null,
        duration: duration ?? null,
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
