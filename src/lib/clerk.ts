import { auth, currentUser } from '@clerk/nextjs/server'
import prisma from './db'

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

  // Upsert user in our database
  const dbUser = await prisma.user.upsert({
    where: { id: userId },
    update: {
      email: user.emailAddresses[0]?.emailAddress,
      name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : undefined,
    },
    create: {
      id: userId,
      email: user.emailAddresses[0]?.emailAddress,
      name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null,
      timezone: 'UTC',
    },
  })

  return dbUser
}

export async function getCurrentDbUser() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  return prisma.user.findUnique({
    where: { id: userId },
  })
}
