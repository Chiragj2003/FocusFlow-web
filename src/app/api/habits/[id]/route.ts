import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'

// GET /api/habits/[id] - Get a specific habit
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const { id } = await params

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const habit = await prisma.habit.findFirst({
      where: { id, userId },
      include: {
        entries: {
          orderBy: { entryDate: 'desc' },
          take: 100,
        },
      },
    })

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    return NextResponse.json(habit)
  } catch (error) {
    console.error('Error fetching habit:', error)
    return NextResponse.json(
      { error: 'Failed to fetch habit' },
      { status: 500 }
    )
  }
}

// PUT /api/habits/[id] - Update a habit
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const { id } = await params

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category, color, goalType, goalTarget, unit, active } = body

    // Verify ownership
    const existingHabit = await prisma.habit.findFirst({
      where: { id, userId },
    })

    if (!existingHabit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    const habit = await prisma.habit.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(color !== undefined && { color }),
        ...(goalType !== undefined && { goalType }),
        ...(goalTarget !== undefined && { goalTarget }),
        ...(unit !== undefined && { unit }),
        ...(active !== undefined && { active }),
      },
    })

    return NextResponse.json(habit)
  } catch (error) {
    console.error('Error updating habit:', error)
    return NextResponse.json(
      { error: 'Failed to update habit' },
      { status: 500 }
    )
  }
}

// DELETE /api/habits/[id] - Delete a habit
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const { id } = await params

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const existingHabit = await prisma.habit.findFirst({
      where: { id, userId },
    })

    if (!existingHabit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    await prisma.habit.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting habit:', error)
    return NextResponse.json(
      { error: 'Failed to delete habit' },
      { status: 500 }
    )
  }
}
