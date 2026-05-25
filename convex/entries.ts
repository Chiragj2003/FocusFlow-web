import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { v } from "convex/values";

const serializeEntry = (entry: Doc<"entries">) => ({
  id: entry._id,
  habitId: entry.habitId,
  userId: entry.userId,
  entryDate: entry.entryDate,
  completed: entry.completed,
  value: entry.value ?? null,
  notes: entry.notes ?? null,
  createdAt: new Date(entry.createdAt).toISOString(),
  updatedAt: new Date(entry.updatedAt).toISOString(),
});

export const list = query({
  args: {
    userId: v.string(),
    habitId: v.optional(v.id("habits")),
    start: v.optional(v.string()),
    end: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let entries = await ctx.db
      .query("entries")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    if (args.habitId) entries = entries.filter((e) => e.habitId === args.habitId);
    if (args.start) entries = entries.filter((e) => e.entryDate >= args.start!);
    if (args.end) entries = entries.filter((e) => e.entryDate <= args.end!);
    return entries.sort((a, b) => (a.entryDate < b.entryDate ? 1 : -1)).map(serializeEntry);
  },
});

export const upsert = mutation({
  args: {
    userId: v.string(),
    habitId: v.id("habits"),
    entryDate: v.string(),
    completed: v.optional(v.boolean()),
    value: v.optional(v.number()),
    notes: v.optional(v.string()),
    mood: v.optional(v.number()),
    energy: v.optional(v.number()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== args.userId) return null;

    const existing = await ctx.db
      .query("entries")
      .withIndex("by_habit_user_date", (q) =>
        q.eq("habitId", args.habitId).eq("userId", args.userId).eq("entryDate", args.entryDate)
      )
      .first();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        completed: args.completed ?? false,
        value: args.value ?? 0,
        notes: args.notes,
        mood: args.mood,
        energy: args.energy,
        duration: args.duration,
        updatedAt: now,
      });
      const updated = await ctx.db.get(existing._id);
      if (!updated) throw new Error("Entry disappeared after update");
      return serializeEntry(updated);
    }

    const id = await ctx.db.insert("entries", {
      habitId: args.habitId,
      userId: args.userId,
      entryDate: args.entryDate,
      completed: args.completed ?? false,
      value: args.value ?? 0,
      notes: args.notes,
      mood: args.mood,
      energy: args.energy,
      duration: args.duration,
      createdAt: now,
      updatedAt: now,
    });
    const created = await ctx.db.get(id);
    if (!created) throw new Error("Entry not found after create");
    return serializeEntry(created);
  },
});

export const update = mutation({
  args: {
    userId: v.string(),
    id: v.id("entries"),
    completed: v.optional(v.boolean()),
    value: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.id);
    if (!entry || entry.userId !== args.userId) return null;
    await ctx.db.patch(args.id, {
      ...(args.completed !== undefined ? { completed: args.completed } : {}),
      ...(args.value !== undefined ? { value: args.value } : {}),
      ...(args.notes !== undefined ? { notes: args.notes } : {}),
      updatedAt: Date.now(),
    });
    const updated = await ctx.db.get(args.id);
    if (!updated) throw new Error("Entry disappeared after patch");
    return serializeEntry(updated);
  },
});

export const remove = mutation({
  args: { userId: v.string(), id: v.id("entries") },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.id);
    if (!entry || entry.userId !== args.userId) return false;
    await ctx.db.delete(args.id);
    return true;
  },
});
