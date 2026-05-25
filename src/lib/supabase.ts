import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Server-side Supabase client with service role (bypasses RLS)
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// Types
export interface DbHabit {
  id: string; user_id: string; title: string; description: string | null; category: string | null;
  color: string; goal_type: 'binary' | 'duration' | 'quantity'; goal_target: number | null;
  unit: string | null; active: boolean; created_at: string; updated_at: string;
}
export interface DbEntry {
  id: string; habit_id: string; user_id: string; entry_date: string; completed: boolean;
  value: number | null; notes: string | null; mood: number | null; energy: number | null;
  duration: number | null; created_at: string; updated_at: string;
}
export interface DbFocusSession {
  id: string; user_id: string; habit_id: string | null; duration: number;
  notes: string | null; completed_at: string; created_at: string;
}
export interface DbBadge {
  id: string; user_id: string; name: string; awarded_at: string; metadata: Record<string, unknown> | null;
}
export interface DbUser {
  id: string; clerk_user_id: string; email: string | null; name: string | null;
  timezone: string; is_deactivated: boolean; created_at: string; updated_at: string;
}
export interface DbChallenge {
  id: string; challenge_id: string; title: string; description: string;
  type: string; target: number; duration: number; reward: number; active: boolean; created_at: string;
}
export interface DbChallengeParticipant {
  id: string; challenge_id: string; user_id: string; joined_at: string;
  progress: number; completed_at: string | null;
}

// Converters
export const toHabitResponse = (h: DbHabit) => ({
  id: h.id, userId: h.user_id, title: h.title, description: h.description, category: h.category,
  color: h.color, goalType: h.goal_type, goalTarget: h.goal_target, unit: h.unit,
  active: h.active, createdAt: h.created_at, updatedAt: h.updated_at,
})
export const toEntryResponse = (e: DbEntry) => ({
  id: e.id, habitId: e.habit_id, userId: e.user_id, entryDate: e.entry_date, completed: e.completed,
  value: e.value, notes: e.notes, mood: e.mood, energy: e.energy, duration: e.duration,
  createdAt: e.created_at, updatedAt: e.updated_at,
})
export const toFocusSessionResponse = (f: DbFocusSession) => ({
  id: f.id, userId: f.user_id, habitId: f.habit_id, duration: f.duration,
  notes: f.notes, completedAt: f.completed_at, createdAt: f.created_at,
})
export const toBadgeResponse = (b: DbBadge) => ({
  id: b.id, userId: b.user_id, name: b.name, awardedAt: b.awarded_at, metadata: b.metadata,
})
