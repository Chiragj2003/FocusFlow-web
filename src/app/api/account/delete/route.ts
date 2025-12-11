import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { confirmation } = body

    if (confirmation !== 'delete my account') {
      return NextResponse.json(
        { error: 'Invalid confirmation text' },
        { status: 400 }
      )
    }

    // Delete user from database (cascade will delete all related data)
    await prisma.user.delete({
      where: { id: userId },
    })

    // Delete user from Clerk
    const clerk = await clerkClient()
    await clerk.users.deleteUser(userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}
