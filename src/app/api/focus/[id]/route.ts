import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { convex } from '@/lib/convex'
import { api } from '../../../../../convex/_generated/api'
import type { Id } from '../../../../../convex/_generated/dataModel'

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

    const ok = await convex.mutation(api.focus.remove, {
      userId,
      id: id as Id<'focusSessions'>,
    })
    if (!ok) {
      return NextResponse.json({ error: 'Focus session not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting focus session:', error)
    return NextResponse.json({ error: 'Failed to delete focus session' }, { status: 500 })
  }
}
