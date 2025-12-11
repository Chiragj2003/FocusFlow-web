import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { SettingsClient } from './client'

export default async function SettingsPage() {
  const { userId: authUserId } = await auth()
  const clerkUser = await currentUser()

  if (!authUserId || !clerkUser) {
    redirect('/sign-in')
  }

  const userId = authUserId
  const userEmail = clerkUser.emailAddresses[0]?.emailAddress
  const userName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null

  // Upsert user in database
  const dbUser = await prisma.user.upsert({
    where: { id: userId },
    update: {
      email: userEmail,
      name: userName || undefined,
    },
    create: {
      id: userId,
      email: userEmail,
      name: userName,
      timezone: 'UTC',
    },
  })

  return (
    <SettingsClient
      user={{
        id: dbUser.id,
        email: dbUser.email ?? '',
        name: dbUser.name,
        timezone: dbUser.timezone,
      }}
      clerkUser={{
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
      }}
    />
  )
}
