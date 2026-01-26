import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

// DELETE /api/focus/[id] - Delete a focus session
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if session exists and belongs to user
    const session = await prisma.focusSession.findFirst({
      where: { id, userId },
    })

    if (!session) {
      return NextResponse.json({ error: 'Focus session not found' }, { status: 404 })
    }

    await prisma.focusSession.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting focus session:', error)
    return NextResponse.json({ error: 'Failed to delete focus session' }, { status: 500 })
  }
}
