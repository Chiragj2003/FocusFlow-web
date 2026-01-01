import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
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

  // Fetch habits (active and archived) and entries in parallel with optimized selects
  const [habits, archivedHabits, entries] = await Promise.all([
    prisma.habit.findMany({
      where: { userId, active: true },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        userId: true,
        title: true,
        description: true,
        category: true,
        color: true,
        goalType: true,
        goalTarget: true,
        unit: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.habit.findMany({
      where: { userId, active: false },
      orderBy: { updatedAt: 'desc' },
      take: 20, // Limit archived habits for faster load
      select: {
        id: true,
        userId: true,
        title: true,
        description: true,
        category: true,
        color: true,
        goalType: true,
        goalTarget: true,
        unit: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.habitEntry.findMany({
      where: {
        userId,
        entryDate: { gte: startDate, lte: endDate },
      },
      select: {
        id: true,
        habitId: true,
        userId: true,
        entryDate: true,
        completed: true,
        value: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
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
