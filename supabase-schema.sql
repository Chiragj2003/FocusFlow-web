-- ============================================
-- FocusFlow Supabase Schema
-- Run this SQL in your Supabase Dashboard:
-- Dashboard -> SQL Editor -> New query -> Paste & Run
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT,
  timezone TEXT DEFAULT 'UTC',
  is_deactivated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);

-- ============================================
-- HABITS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  color TEXT NOT NULL DEFAULT '#ffffff',
  goal_type TEXT NOT NULL CHECK (goal_type IN ('binary', 'duration', 'quantity')),
  goal_target NUMERIC,
  unit TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_habits_user ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_user_active ON habits(user_id, active);

-- ============================================
-- ENTRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  entry_date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  value NUMERIC,
  notes TEXT,
  mood INTEGER,
  energy INTEGER,
  duration NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, user_id, entry_date)
);

CREATE INDEX IF NOT EXISTS idx_entries_user ON entries(user_id);
CREATE INDEX IF NOT EXISTS idx_entries_habit ON entries(habit_id);
CREATE INDEX IF NOT EXISTS idx_entries_user_date ON entries(user_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_entries_habit_user_date ON entries(habit_id, user_id, entry_date);

-- ============================================
-- FOCUS SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS focus_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  habit_id UUID REFERENCES habits(id) ON DELETE SET NULL,
  duration INTEGER NOT NULL,
  notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_focus_user ON focus_sessions(user_id);

-- ============================================
-- CHALLENGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('streak', 'completion', 'focus', 'quantity')),
  target INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  reward INTEGER NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_challenges_challenge_id ON challenges(challenge_id);

-- ============================================
-- CHALLENGE PARTICIPANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS challenge_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  progress NUMERIC DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(challenge_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_cp_user ON challenge_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_cp_challenge_user ON challenge_participants(challenge_id, user_id);

-- ============================================
-- BADGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB,
  UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_badges_user ON badges(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_user_name ON badges(user_id, name);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Since we use Clerk for auth (not Supabase Auth),
-- we use service_role key for server-side operations.
-- These policies allow full access via service_role.
CREATE POLICY "Service role has full access to users"
  ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access to habits"
  ON habits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access to entries"
  ON entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access to focus_sessions"
  ON focus_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access to challenge_participants"
  ON challenge_participants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access to badges"
  ON badges FOR ALL USING (true) WITH CHECK (true);
-- Allow public access to challenges (read-only)
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read challenges"
  ON challenges FOR SELECT USING (true);
CREATE POLICY "Service role manages challenges"
  ON challenges FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- SEED: Default challenges
-- ============================================
INSERT INTO challenges (challenge_id, title, description, type, target, duration, reward) VALUES
  ('7day-streak', '7-Day Streak', 'Complete any habit for 7 consecutive days', 'streak', 7, 7, 50),
  ('30day-streak', '30-Day Streak', 'Complete any habit for 30 consecutive days', 'streak', 30, 30, 200),
  ('complete-10', 'Complete 10', 'Complete 10 habit entries in a week', 'completion', 10, 7, 30),
  ('focus-master', 'Focus Master', 'Complete 5 hours of focus sessions', 'focus', 300, 30, 100),
  ('habit-builder', 'Habit Builder', 'Create and maintain 5 active habits', 'quantity', 5, 14, 75)
ON CONFLICT (challenge_id) DO NOTHING;
