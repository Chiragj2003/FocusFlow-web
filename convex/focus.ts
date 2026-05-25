import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { v } from "convex/values";

const serializeSession = (s: Doc<"focusSessions">) => ({
  id: s._id,
  userId: s.userId,
  habitId: s.habitId ?? null,
  duration: s.duration,
  notes: s.notes ?? null,
  completedAt: new Date(s.completedAt).toISOString(),
  createdAt: new Date(s.createdAt).toISOString(),
});

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("focusSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    return sessions.sort((a, b) => b.completedAt - a.completedAt).slice(0, 100).map(serializeSession);
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    habitId: v.optional(v.id("habits")),
    duration: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("focusSessions", {
      userId: args.userId,
      habitId: args.habitId,
      duration: args.duration,
      notes: args.notes,
      completedAt: now,
      createdAt: now,
    });
    const session = await ctx.db.get(id);
    if (!session) throw new Error("Session not found after create");
    return serializeSession(session);
  },
});

export const remove = mutation({
  args: { userId: v.string(), id: v.id("focusSessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.id);
    if (!session || session.userId !== args.userId) return false;
    await ctx.db.delete(args.id);
    return true;
  },
});

export const stats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("focusSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = todayStart - 7 * 24 * 60 * 60 * 1000;

    const totalSessions = sessions.length;
    const totalSeconds = sessions.reduce((sum, s) => sum + s.duration, 0);
    const todaySeconds = sessions.filter((s) => s.completedAt >= todayStart).reduce((sum, s) => sum + s.duration, 0);
    const weekSeconds = sessions.filter((s) => s.completedAt >= weekStart).reduce((sum, s) => sum + s.duration, 0);

    return {
      totalSessions,
      totalMinutes: Math.floor(totalSeconds / 60),
      todayMinutes: Math.floor(todaySeconds / 60),
      weekMinutes: Math.floor(weekSeconds / 60),
      averageSessionLength: totalSessions > 0 ? Math.floor(totalSeconds / totalSessions / 60) : 0,
      longestSession: sessions.length > 0 ? Math.floor(Math.max(...sessions.map((s) => s.duration)) / 60) : 0,
    };
  },
});
