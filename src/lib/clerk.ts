import { auth, currentUser } from '@clerk/nextjs/server'
import { convex } from './convex'
import { api } from '../../convex/_generated/api'

export async function getAuthenticatedUser() {
  const { userId } = await auth()
  
  if (!userId) {
    return null
  }

  return userId
}

export async function ensureUserExists() {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId || !user) {
    return null
  }

  const dbUser = await convex.mutation(api.users.upsertFromClerk, {
    clerkUserId: userId,
    email: user.emailAddresses[0]?.emailAddress,
    name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : undefined,
    timezone: 'UTC',
  })

  return dbUser
}

export async function getCurrentDbUser() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  return convex.query(api.users.getByClerkId, { clerkUserId: userId })
}
