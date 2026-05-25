import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { dbListHabits, dbListEntries } from '@/lib/db'
import { CalendarClient } from './client'

export default async function CalendarPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const currentYear = new Date().getFullYear()
  const start = new Date(currentYear, 0, 1).toISOString().slice(0, 10)
  const end = new Date(currentYear, 11, 31).toISOString().slice(0, 10)

  const [habits, entries] = await Promise.all([
    dbListHabits(userId, true),
    dbListEntries(userId, start, end),
  ])

  const serializedHabits = habits.map((h) => ({
    id: h.id, title: h.title, color: h.color, goalType: h.goal_type, goalTarget: h.goal_target, unit: h.unit,
  }))
  const serializedEntries = entries.map((e) => ({
    id: e.id, habitId: e.habit_id, entryDate: e.entry_date, completed: e.completed, value: e.value,
  }))

  return (
    <CalendarClient
      initialHabits={serializedHabits}
      initialEntries={serializedEntries}
      initialYear={currentYear}
    />
  )
}
