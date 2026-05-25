import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { dbListHabits, dbListEntries } from '@/lib/db'
import { toHabitResponse, toEntryResponse } from '@/lib/supabase'
import { HabitsClient } from './client'

export const revalidate = 30

export default async function HabitsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10)

  const [habits, archivedHabits, entries] = await Promise.all([
    dbListHabits(userId, true),
    dbListHabits(userId, false),
    dbListEntries(userId, start, end),
  ])

  return (
    <HabitsClient
      initialHabits={habits.map(toHabitResponse) as any}
      initialEntries={entries.map(toEntryResponse) as any}
      initialMonth={now.getMonth()}
      initialYear={now.getFullYear()}
      archivedHabits={archivedHabits.map(toHabitResponse) as any}
    />
  )
}
