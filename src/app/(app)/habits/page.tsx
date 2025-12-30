import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { HabitsClient } from './client'

export default async function HabitsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Get current month
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Fetch habits (active and archived) and entries
  const [habits, archivedHabits, entries] = await Promise.all([
    prisma.habit.findMany({
      where: { userId, active: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.habit.findMany({
      where: { userId, active: false },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.habitEntry.findMany({
      where: {
        userId,
        entryDate: { gte: startDate, lte: endDate },
      },
    }),
  ])

  // Convert dates to strings for client
  const serializedHabits = habits.map((h) => ({
    ...h,
    createdAt: h.createdAt.toISOString(),
    updatedAt: h.updatedAt.toISOString(),
  }))

  const serializedEntries = entries.map((e) => ({
    ...e,
    entryDate: e.entryDate.toISOString().split('T')[0],
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }))

  const serializedArchivedHabits = archivedHabits.map((h) => ({
    ...h,
    createdAt: h.createdAt.toISOString(),
    updatedAt: h.updatedAt.toISOString(),
  }))

  return (
    <HabitsClient
      initialHabits={serializedHabits}
      initialEntries={serializedEntries}
      initialMonth={now.getMonth()}
      initialYear={now.getFullYear()}
      archivedHabits={serializedArchivedHabits}
    />
  )
}
