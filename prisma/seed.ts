import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create a demo user
  const demoUserId = 'demo_user_12345'
  
  const user = await prisma.user.upsert({
    where: { id: demoUserId },
    update: {},
    create: {
      id: demoUserId,
      email: 'demo@focusflow.app',
      name: 'Demo User',
      timezone: 'America/New_York',
    },
  })

  console.log('✅ Created user:', user.email)

  // Create sample habits
  const habits = [
    {
      title: 'Morning Meditation',
      description: '10 minutes of mindfulness to start the day',
      category: 'Mindfulness',
      color: '#FFB4A2',
      goalType: 'duration',
      goalTarget: 10,
      unit: 'minutes',
    },
    {
      title: 'Exercise',
      description: 'Any form of physical activity',
      category: 'Fitness',
      color: '#CDE7E4',
      goalType: 'duration',
      goalTarget: 30,
      unit: 'minutes',
    },
    {
      title: 'Read',
      description: 'Read at least 20 pages',
      category: 'Learning',
      color: '#E2D6FF',
      goalType: 'quantity',
      goalTarget: 20,
      unit: 'pages',
    },
    {
      title: 'Drink Water',
      description: '8 glasses of water daily',
      category: 'Health',
      color: '#B4E4FF',
      goalType: 'quantity',
      goalTarget: 8,
      unit: 'glasses',
    },
    {
      title: 'No Social Media',
      description: 'Avoid social media for the day',
      category: 'Productivity',
      color: '#FFE5B4',
      goalType: 'binary',
      goalTarget: 1,
      unit: null,
    },
    {
      title: 'Journal',
      description: 'Write in journal before bed',
      category: 'Mindfulness',
      color: '#FFD6D0',
      goalType: 'binary',
      goalTarget: 1,
      unit: null,
    },
  ]

  for (const habitData of habits) {
    const habit = await prisma.habit.upsert({
      where: {
        id: `${demoUserId}_${habitData.title.replace(/\s/g, '_').toLowerCase()}`,
      },
      update: habitData,
      create: {
        id: `${demoUserId}_${habitData.title.replace(/\s/g, '_').toLowerCase()}`,
        userId: demoUserId,
        ...habitData,
      },
    })
    console.log('✅ Created habit:', habit.title)

    // Create entries for the last 30 days with varying completion rates
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const entryDate = new Date(today)
      entryDate.setDate(today.getDate() - i)
      entryDate.setHours(0, 0, 0, 0)

      // Random completion based on habit (some habits have higher success rates)
      const completionChance = 
        habitData.title === 'Morning Meditation' ? 0.85 :
        habitData.title === 'Exercise' ? 0.6 :
        habitData.title === 'Read' ? 0.7 :
        habitData.title === 'Drink Water' ? 0.9 :
        habitData.title === 'No Social Media' ? 0.4 :
        0.65

      const completed = Math.random() < completionChance
      const value = completed
        ? habitData.goalTarget
          ? habitData.goalTarget * (0.8 + Math.random() * 0.4)
          : 0
        : 0

      await prisma.habitEntry.upsert({
        where: {
          habitId_userId_entryDate: {
            habitId: habit.id,
            userId: demoUserId,
            entryDate,
          },
        },
        update: {
          completed,
          value,
        },
        create: {
          habitId: habit.id,
          userId: demoUserId,
          entryDate,
          completed,
          value,
        },
      })
    }
    console.log(`  📅 Created 30 days of entries for ${habit.title}`)
  }

  // Create some badges
  await prisma.badge.upsert({
    where: { id: `${demoUserId}_first_week` },
    update: {},
    create: {
      id: `${demoUserId}_first_week`,
      userId: demoUserId,
      name: 'First Week Complete',
      metadata: { description: 'Completed your first week of tracking!' },
    },
  })

  await prisma.badge.upsert({
    where: { id: `${demoUserId}_streak_7` },
    update: {},
    create: {
      id: `${demoUserId}_streak_7`,
      userId: demoUserId,
      name: '7-Day Streak',
      metadata: { description: 'Maintained a 7-day streak on any habit!' },
    },
  })

  console.log('✅ Created badges')
  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
