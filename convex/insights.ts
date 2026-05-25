import { query } from "./_generated/server";
import { v } from "convex/values";

const dateRange = (start: string, end: string) => {
  const result: string[] = [];
  const current = new Date(`${start}T00:00:00.000Z`);
  const endDate = new Date(`${end}T00:00:00.000Z`);
  while (current <= endDate) {
    result.push(current.toISOString().slice(0, 10));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return result;
};

export const summary = query({
  args: { userId: v.string(), startDate: v.string(), endDate: v.string() },
  handler: async (ctx, args) => {
    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user_active", (q) => q.eq("userId", args.userId).eq("active", true))
      .collect();
    const entries = await ctx.db
      .query("entries")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const rangeEntries = entries.filter((e) => e.entryDate >= args.startDate && e.entryDate <= args.endDate);
    const days = dateRange(args.startDate, args.endDate);
    const completedEntries = rangeEntries.filter((e) => e.completed);

    const totalCompleted = completedEntries.length;
    const totalPossible = days.length * habits.length;
    const overallCompletionRate = totalPossible > 0 ? totalCompleted / totalPossible : 0;

    // Compute per-habit streak info for topHabits
    const habitStreaks = habits.map((habit) => {
      const completedDates = new Set(
        entries
          .filter((e) => e.habitId === habit._id && e.completed)
          .map((e) => e.entryDate)
      );
      const sorted = Array.from(completedDates).sort();
      let longest = 0;
      let runLen = 0;
      let prev: Date | null = null;
      for (const d of sorted) {
        const date = new Date(`${d}T00:00:00.000Z`);
        if (!prev) { runLen = 1; } else {
          const diff = (date.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000);
          runLen = diff === 1 ? runLen + 1 : 1;
        }
        longest = Math.max(longest, runLen);
        prev = date;
      }
      let curStreak = 0;
      const cursor = new Date();
      cursor.setUTCHours(0, 0, 0, 0);
      while (completedDates.has(cursor.toISOString().slice(0, 10))) {
        curStreak += 1;
        cursor.setUTCDate(cursor.getUTCDate() - 1);
      }
      return { habitId: habit._id, currentStreak: curStreak, longestStreak: longest };
    });
    const streakMap = new Map(habitStreaks.map((s) => [s.habitId, s]));

    const topHabits = habits
      .map((habit) => {
        const habitEntries = rangeEntries.filter((e) => e.habitId === habit._id);
        const completedCount = habitEntries.filter((e) => e.completed).length;
        const completionRate = days.length > 0 ? completedCount / days.length : 0;
        const streak = streakMap.get(habit._id);
        return {
          habitId: habit._id,
          title: habit.title,
          color: habit.color,
          completionRate,
          currentStreak: streak?.currentStreak ?? 0,
          longestStreak: streak?.longestStreak ?? 0,
        };
      })
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 5);

    // Build weekly stats grouped by week-start (Monday)
    const weeklyMap = new Map<string, { completed: number; possible: number }>();
    for (const date of days) {
      const d = new Date(`${date}T00:00:00.000Z`);
      const dayOfWeek = d.getUTCDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(d);
      monday.setUTCDate(d.getUTCDate() + mondayOffset);
      const weekStart = monday.toISOString().slice(0, 10);
      if (!weeklyMap.has(weekStart)) {
        weeklyMap.set(weekStart, { completed: 0, possible: 0 });
      }
      const bucket = weeklyMap.get(weekStart)!;
      bucket.possible += habits.length;
      bucket.completed += completedEntries.filter((e) => e.entryDate === date).length;
    }
    const weekly = Array.from(weeklyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([weekStart, stats]) => ({
        weekStart,
        completed: stats.completed,
        possible: stats.possible,
        completionRate: stats.possible > 0 ? stats.completed / stats.possible : 0,
      }));

    // Calculate per-habit summaries for the insights detail table
    const habitSummaries = habits.map((habit) => {
      const habitEntries = rangeEntries.filter((e) => e.habitId === habit._id);
      const completedHabitEntries = habitEntries.filter((e) => e.completed);
      const countLogged = completedHabitEntries.length;
      const sumValue = completedHabitEntries.reduce((sum, e) => sum + (e.value ?? 0), 0);
      const avgPerActiveDay = countLogged > 0 ? sumValue / countLogged : 0;

      return {
        habitId: habit._id,
        title: habit.title,
        countLogged,
        sumValue,
        avgPerActiveDay,
      };
    });

    return {
      userId: args.userId,
      period: { start: args.startDate, end: args.endDate },
      overallCompletionRate,
      totalCompleted,
      totalPossible,
      topHabits,
      weekly,
      habitSummaries,
    };
  },
});

export const streaks = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user_active", (q) => q.eq("userId", args.userId).eq("active", true))
      .collect();
    const entries = await ctx.db
      .query("entries")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const streaksByHabit = habits.map((habit) => {
      const dates = new Set(
        entries
          .filter((e) => e.habitId === habit._id && e.completed)
          .map((e) => e.entryDate)
      );

      const sorted = Array.from(dates).sort();
      let longestStreak = 0;
      let current = 0;
      let prev: Date | null = null;
      for (const d of sorted) {
        const date = new Date(`${d}T00:00:00.000Z`);
        if (!prev) {
          current = 1;
        } else {
          const diff = (date.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000);
          current = diff === 1 ? current + 1 : 1;
        }
        longestStreak = Math.max(longestStreak, current);
        prev = date;
      }

      let currentStreak = 0;
      const cursor = new Date();
      cursor.setUTCHours(0, 0, 0, 0);
      while (dates.has(cursor.toISOString().slice(0, 10))) {
        currentStreak += 1;
        cursor.setUTCDate(cursor.getUTCDate() - 1);
      }

      // Find last completed date for this habit
      const lastCompletedDate = sorted.length > 0 ? sorted[sorted.length - 1] : null;

      return {
        habitId: habit._id,
        title: habit.title,
        currentStreak,
        longestStreak,
        lastCompletedDate,
      };
    });

    const currentStreak = Math.max(0, ...streaksByHabit.map((s) => s.currentStreak));
    const longestStreak = Math.max(0, ...streaksByHabit.map((s) => s.longestStreak));
    return { currentStreak, longestStreak, streaksByHabit };
  },
});
