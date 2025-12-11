// Habit and Entry types
export interface Habit {
  id: string
  userId: string
  title: string
  description?: string | null
  category?: string | null
  color: string
  goalType: 'binary' | 'duration' | 'quantity'
  goalTarget?: number | null
  unit?: string | null
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface HabitEntry {
  id: string
  habitId: string
  userId: string
  entryDate: Date
  completed: boolean
  value?: number | null
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface HabitWithEntries extends Habit {
  entries: HabitEntry[]
}

// API Request/Response types
export interface CreateHabitRequest {
  title: string
  description?: string
  category?: string
  color?: string
  goalType: 'binary' | 'duration' | 'quantity'
  goalTarget?: number
  unit?: string
}

export interface UpdateHabitRequest {
  title?: string
  description?: string
  category?: string
  color?: string
  goalType?: 'binary' | 'duration' | 'quantity'
  goalTarget?: number
  unit?: string
  active?: boolean
}

export interface UpsertEntryRequest {
  habitId: string
  entryDate: string // ISO date string
  completed: boolean
  value?: number
  notes?: string
}

export interface UpdateEntryRequest {
  completed?: boolean
  value?: number
  notes?: string
}

// Analytics types
export interface DailySummary {
  date: string
  totalHabits: number
  completedHabits: number
  completionRate: number
}

export interface MonthlyData {
  month: string
  year: number
  days: DailySummary[]
  overallRate: number
}

// Chart data types
export interface ChartDataPoint {
  name: string
  value: number
  color?: string
}

export interface LineChartDataPoint {
  date: string
  value: number
  label?: string
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  timezone: string
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 // Sunday = 0
  notifications: boolean
}

// Grid types for the habit tracker view
export interface GridCell {
  habitId: string
  date: string
  entry?: HabitEntry
  isToday: boolean
  isFuture: boolean
}

export interface HabitRow {
  habit: Habit
  cells: GridCell[]
  weeklyTotal: number
  monthlyTotal: number
}
