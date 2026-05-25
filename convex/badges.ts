import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const BADGE_DEFINITIONS = [
  { name: "First Habit", type: "habitCount", threshold: 1 },
  { name: "Habit Builder", type: "habitCount", threshold: 5 },
  { name: "Consistency Starter", type: "completionCount", threshold: 10 },
  { name: "Centurion", type: "completionCount", threshold: 100 },
  { name: "Streak Starter", type: "streak", threshold: 3 },
  { name: "Streak Master", type: "streak", threshold: 14 },
] as const;

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const badges = await ctx.db.query("badges").withIndex("by_user", (q) => q.eq("userId", args.userId)).collect();
    return badges
      .sort((a, b) => b.awardedAt - a.awardedAt)
      .map((b) => ({ name: b.name, awardedAt: new Date(b.awardedAt).toISOString(), metadata: b.metadata ?? null }));
  },
});

export const definitions = query({
  args: {},
  handler: async () => BADGE_DEFINITIONS,
});

export const checkAndAward = mutation({
  args: { userId: v.string(), currentStreak: v.number(), longestStreak: v.number() },
  handler: async (ctx, args) => {
    const habits = await ctx.db.query("habits").withIndex("by_user", (q) => q.eq("userId", args.userId)).collect();
    const entries = await ctx.db.query("entries").withIndex("by_user", (q) => q.eq("userId", args.userId)).collect();
    const completedCount = entries.filter((e) => e.completed).length;
    const habitCount = habits.filter((h) => h.active).length;
    const existing = await ctx.db.query("badges").withIndex("by_user", (q) => q.eq("userId", args.userId)).collect();
    const existingSet = new Set(existing.map((b) => b.name));

    const newBadges: string[] = [];
    for (const def of BADGE_DEFINITIONS) {
      const eligible =
        def.type === "habitCount"
          ? habitCount >= def.threshold
          : def.type === "completionCount"
            ? completedCount >= def.threshold
            : Math.max(args.currentStreak, args.longestStreak) >= def.threshold;
      if (eligible && !existingSet.has(def.name)) {
        await ctx.db.insert("badges", {
          userId: args.userId,
          name: def.name,
          awardedAt: Date.now(),
          metadata: { threshold: def.threshold, type: def.type },
        });
        newBadges.push(def.name);
      }
    }
    return newBadges;
  },
});
