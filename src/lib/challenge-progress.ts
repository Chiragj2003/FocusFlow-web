import { supabase } from './supabase'
import { dbStreaks } from './db'

type ChallengeRow = {
  challenge_id: string
  type: 'streak' | 'completion' | 'focus' | 'quantity'
  target: number
  duration: number
}

function startDateForDuration(days: number) {
  const start = new Date()
  start.setUTCDate(start.getUTCDate() - Math.max(days - 1, 0))
  return start.toISOString().slice(0, 10)
}

export async function calculateChallengeProgress(userId: string, challenge: ChallengeRow) {
  const target = Number(challenge.target) || 0
  let progress = 0

  if (challenge.type === 'streak') {
    const streaks = await dbStreaks(userId)
    progress = streaks.currentStreak
  }

  if (challenge.type === 'completion') {
    const start = startDateForDuration(challenge.duration)
    const { count } = await supabase
      .from('habit_entries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true)
      .gte('entry_date', start)
    progress = count || 0
  }

  if (challenge.type === 'focus') {
    const start = startDateForDuration(challenge.duration)
    const { data } = await supabase
      .from('focus_sessions')
      .select('duration')
      .eq('user_id', userId)
      .gte('completed_at', `${start}T00:00:00.000Z`)
    const seconds = (data || []).reduce((sum, session) => sum + Number(session.duration || 0), 0)
    progress = Math.floor(seconds / 60)
  }

  if (challenge.type === 'quantity') {
    const { count } = await supabase
      .from('habits')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('active', true)
    progress = count || 0
  }

  return {
    progress: Math.min(progress, target),
    completed: target > 0 && progress >= target,
  }
}

export async function updateChallengeParticipantProgress(userId: string, challenge: ChallengeRow) {
  const result = await calculateChallengeProgress(userId, challenge)
  const completedAt = result.completed ? new Date().toISOString() : null

  await supabase
    .from('challenge_participants')
    .update({
      progress: result.progress,
      completed_at: completedAt,
    })
    .eq('user_id', userId)
    .eq('challenge_id', challenge.challenge_id)

  return { ...result, completedAt }
}
