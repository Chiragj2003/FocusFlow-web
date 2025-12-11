import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
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

  // Fetch habits and entries for the year
  const [habits, entries] = await Promise.all([
    prisma.habit.findMany({
      where: { userId, active: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.habitEntry.findMany({
      where: {
        userId,
        entryDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { entryDate: 'desc' },
    }),
  ])

  // Serialize dates for client component
  const serializedHabits = habits.map((h) => ({
    id: h.id,
    title: h.title,
    color: h.color,
    goalType: h.goalType,
    goalTarget: h.goalTarget,
    unit: h.unit,
  }))

  const serializedEntries = entries.map((e) => ({
    id: e.id,
    habitId: e.habitId,
    entryDate: e.entryDate.toISOString().split('T')[0],
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
