import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { dbUpsertUser } from '@/lib/db'
import { SettingsClient } from './client'

export default async function SettingsPage() {
  const { userId: authUserId } = await auth()
  const clerkUser = await currentUser()
  if (!authUserId || !clerkUser) redirect('/sign-in')

  const userId = authUserId
  const userEmail = clerkUser.emailAddresses[0]?.emailAddress
  const userName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null

  const dbUser = await dbUpsertUser(userId, userEmail, userName ?? undefined, 'UTC')
  if (!dbUser) redirect('/sign-in')

  return (
    <SettingsClient
      user={{
        id: dbUser.id ?? userId,
        email: dbUser.email ?? '',
        name: dbUser.name ?? null,
        timezone: dbUser.timezone ?? 'UTC',
      }}
      clerkUser={{
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
      }}
    />
  )
}
