import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { convex } from '@/lib/convex'
import { api } from '../../../../convex/_generated/api'
import { HabitsClient } from './client'

// Revalidate every 30 seconds for faster loads
export const revalidate = 30

export default async function HabitsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Get current month
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const start = startDate.toISOString().slice(0, 10)
  const end = endDate.toISOString().slice(0, 10)

  const [habits, archivedHabits, entries] = await Promise.all([
    convex.query(api.habits.list, { userId, active: true }),
    convex.query(api.habits.list, { userId, active: false }),
    convex.query(api.entries.list, { userId, start, end }),
  ])

  return (
    <HabitsClient
      initialHabits={habits}
      initialEntries={entries}
      initialMonth={now.getMonth()}
      initialYear={now.getFullYear()}
      archivedHabits={archivedHabits}
    />
  )
}
