import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'

// PUT /api/entries/[id] - Update a specific entry
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
    const { completed, value, notes } = body

    // Verify ownership
    const existingEntry = await prisma.habitEntry.findFirst({
      where: { id, userId },
    })

    if (!existingEntry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    const entry = await prisma.habitEntry.update({
      where: { id },
      data: {
        ...(completed !== undefined && { completed }),
        ...(value !== undefined && { value }),
        ...(notes !== undefined && { notes }),
      },
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error('Error updating entry:', error)
    return NextResponse.json(
      { error: 'Failed to update entry' },
      { status: 500 }
    )
  }
}

// DELETE /api/entries/[id] - Delete an entry
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
    const existingEntry = await prisma.habitEntry.findFirst({
      where: { id, userId },
    })

    if (!existingEntry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    await prisma.habitEntry.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting entry:', error)
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 }
    )
  }
}
