import { auth, currentUser } from '@clerk/nextjs/server'
import { dbUpsertUser } from './db'
import { supabase } from './supabase'

export async function getAuthenticatedUser() {
  const { userId } = await auth()
  if (!userId) return null
  return userId
}

export async function ensureUserExists() {
  const { userId } = await auth()
  const user = await currentUser()
  if (!userId || !user) return null
  return dbUpsertUser(
    userId,
    user.emailAddresses[0]?.emailAddress,
    user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : undefined,
    'UTC'
  )
}

export async function getCurrentDbUser() {
  const { userId } = await auth()
  if (!userId) return null
  const { data } = await supabase.from('users').select('*').eq('clerk_user_id', userId).single()
  return data
}
