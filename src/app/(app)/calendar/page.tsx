import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { convex } from '@/lib/convex'
import { api } from '../../../../convex/_generated/api'
import { CalendarClient } from './client'

export default async function CalendarPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Get current year
  const currentYear = new Date().getFullYear()
  const startDate = new Date(currentYear, 0, 1)
  const endDate = new Date(currentYear, 11, 31)

  const start = startDate.toISOString().slice(0, 10)
  const end = endDate.toISOString().slice(0, 10)

  const [habits, entries] = await Promise.all([
    convex.query(api.habits.list, { userId, active: true }),
    convex.query(api.entries.list, { userId, start, end }),
  ])

  // Serialize dates for client component
  const serializedHabits = habits.map((h: { id: string; title: string; color: string; goalType: string; goalTarget: number | null; unit: string | null }) => ({
    id: h.id,
    title: h.title,
    color: h.color,
    goalType: h.goalType,
    goalTarget: h.goalTarget,
    unit: h.unit,
  }))

  const serializedEntries = entries.map((e: { id: string; habitId: string; entryDate: string; completed: boolean; value: number | null }) => ({
    id: e.id,
    habitId: e.habitId,
    entryDate: e.entryDate,
    completed: e.completed,
    value: e.value,
  }))

  return (
    <CalendarClient
      initialHabits={serializedHabits}
      initialEntries={serializedEntries}
      initialYear={currentYear}
    />
  )
}
