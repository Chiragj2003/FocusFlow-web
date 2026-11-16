import { supabase } from '@/lib/supabase'
import { ACTIVE_ACHIEVEMENTS } from '@/lib/constants'

/**
 * Bridge between the app's challenge catalog (ids like "ach_1", defined in constants.ts)
 * and the real Supabase tables:
 *   challenges(id uuid, title, description, duration, habits jsonb, category, difficulty, tags text[], ...)
 *   challenge_participants(challenge_id uuid -> challenges.id, user_id, started_at, progress, completed_at)
 *
 * Each catalog entry is stored as one `challenges` row with category 'achievement' and
 * its catalog id in `tags` (e.g. ['ach_1', 'type:focus']). Type / target / reward come
 * from constants.ts, so no schema change is needed.
 */

export const CATALOG_CATEGORY = 'achievement'

type Achievement = (typeof ACTIVE_ACHIEVEMENTS)[number]

export interface CatalogChallenge {
  key: string // "ach_1"
  dbId: string // challenges.id (uuid)
  active: boolean
  ach: Achievement
}

const difficultyFor = (reward: number) => (reward <= 150 ? 'easy' : reward <= 400 ? 'medium' : 'hard')

const toRow = (a: Achievement) => ({
  title: a.title,
  description: a.description,
  duration: a.duration,
  habits: [],
  category: CATALOG_CATEGORY,
  difficulty: difficultyFor(a.reward),
  tags: [a.id, `type:${a.type}`],
  featured: false,
  active: true,
})

const keyOf = (tags: string[] | null) => (tags || []).find((t) => ACTIVE_ACHIEVEMENTS.some((a) => a.id === t))

/**
 * Returns every active catalog challenge with its database row id,
 * creating the rows that don't exist yet (first run / newly added ids).
 */
export async function getCatalog(): Promise<Map<string, CatalogChallenge>> {
  const { data, error } = await supabase
    .from('challenges')
    .select('id, tags, active, created_at')
    .eq('category', CATALOG_CATEGORY)
    .order('created_at', { ascending: true })
  if (error) throw error

  const rowByKey = new Map<string, { id: string; active: boolean }>()
  for (const row of data || []) {
    const key = keyOf(row.tags)
    if (key && !rowByKey.has(key)) rowByKey.set(key, { id: row.id, active: row.active !== false })
  }

  const missing = ACTIVE_ACHIEVEMENTS.filter((a) => !rowByKey.has(a.id))
  if (missing.length) {
    const { data: created, error: insertError } = await supabase
      .from('challenges')
      .insert(missing.map(toRow))
      .select('id, tags, active')
    if (insertError) throw insertError
    for (const row of created || []) {
      const key = keyOf(row.tags)
      if (key) rowByKey.set(key, { id: row.id, active: row.active !== false })
    }
  }

  const catalog = new Map<string, CatalogChallenge>()
  for (const ach of ACTIVE_ACHIEVEMENTS) {
    const row = rowByKey.get(ach.id)
    if (row) catalog.set(ach.id, { key: ach.id, dbId: row.id, active: row.active, ach })
  }
  return catalog
}

/** Shape the app and website expect for a challenge. */
export const toApiChallenge = (c: CatalogChallenge) => ({
  id: c.key,
  dbId: c.dbId,
  challengeId: c.key,
  title: c.ach.title,
  description: c.ach.description,
  type: c.ach.type,
  target: c.ach.target,
  duration: c.ach.duration,
  reward: c.ach.reward,
  active: c.active,
})

/** Input for progress calculation. */
export const toProgressInput = (c: CatalogChallenge) => ({
  dbId: c.dbId,
  type: c.ach.type as 'streak' | 'completion' | 'focus' | 'quantity',
  target: c.ach.target,
  duration: c.ach.duration,
})
