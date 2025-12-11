import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body // 'deactivate' or 'reactivate'

    if (action === 'deactivate') {
      // Deactivate all habits (soft disable account)
      await prisma.habit.updateMany({
        where: { userId },
        data: { active: false },
      })

      // Mark user as deactivated by setting a special flag in name
      // In a real app, you'd add an 'active' field to User model
      await prisma.user.update({
        where: { id: userId },
        data: { name: `[DEACTIVATED] ${(await prisma.user.findUnique({ where: { id: userId } }))?.name || ''}`.trim() },
      })

      return NextResponse.json({ success: true, status: 'deactivated' })
    } else if (action === 'reactivate') {
      // Reactivate all habits
      await prisma.habit.updateMany({
        where: { userId },
        data: { active: true },
      })

      // Remove deactivation marker from name
      const user = await prisma.user.findUnique({ where: { id: userId } })
      const cleanName = user?.name?.replace('[DEACTIVATED] ', '') || null

      await prisma.user.update({
        where: { id: userId },
        data: { name: cleanName },
      })

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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    })

    const isDeactivated = user?.name?.startsWith('[DEACTIVATED]') || false

    return NextResponse.json({ isDeactivated })
  } catch (error) {
    console.error('Error checking account status:', error)
    return NextResponse.json(
      { error: 'Failed to check account status' },
      { status: 500 }
    )
  }
}
