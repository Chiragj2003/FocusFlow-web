import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { convex } from '@/lib/convex'
import { api } from '../../../../../convex/_generated/api'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body // 'deactivate' or 'reactivate'

    if (action === 'deactivate') {
      await convex.mutation(api.users.setDeactivated, { clerkUserId: userId, deactivated: true })

      return NextResponse.json({ success: true, status: 'deactivated' })
    } else if (action === 'reactivate') {
      await convex.mutation(api.users.setDeactivated, { clerkUserId: userId, deactivated: false })

      return NextResponse.json({ success: true, status: 'reactivated' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating account status:', error)
    return NextResponse.json(
      { error: 'Failed to update account status' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await convex.query(api.users.getByClerkId, { clerkUserId: userId })
    const isDeactivated = user?.isDeactivated || false

    return NextResponse.json({ isDeactivated })
  } catch (error) {
    console.error('Error checking account status:', error)
    return NextResponse.json(
      { error: 'Failed to check account status' },
      { status: 500 }
    )
  }
}
