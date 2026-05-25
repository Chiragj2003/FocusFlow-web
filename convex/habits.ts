import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { v } from "convex/values";

const serializeHabit = (habit: Doc<"habits">) => ({
  id: habit._id,
  userId: habit.userId,
  title: habit.title,
  description: habit.description ?? null,
  category: habit.category ?? null,
  color: habit.color,
  goalType: habit.goalType,
  goalTarget: habit.goalTarget ?? null,
  unit: habit.unit ?? null,
  active: habit.active,
  createdAt: new Date(habit.createdAt).toISOString(),
  updatedAt: new Date(habit.updatedAt).toISOString(),
});

export const list = query({
  args: {
    userId: v.string(),
    active: v.optional(v.boolean()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let habits = args.active === undefined
      ? await ctx.db.query("habits").withIndex("by_user", (q) => q.eq("userId", args.userId)).collect()
      : await ctx.db
          .query("habits")
          .withIndex("by_user_active", (q) => q.eq("userId", args.userId).eq("active", args.active!))
          .collect();

    if (args.category) {
      habits = habits.filter((h) => h.category === args.category);
    }

    return habits.sort((a, b) => b.createdAt - a.createdAt).map(serializeHabit);
  },
});

export const getById = query({
  args: { userId: v.string(), id: v.id("habits") },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.id);
    if (!habit || habit.userId !== args.userId) return null;
    return serializeHabit(habit);
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    color: v.optional(v.string()),
    goalType: v.union(v.literal("binary"), v.literal("duration"), v.literal("quantity")),
    goalTarget: v.optional(v.number()),
    unit: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("habits", {
      userId: args.userId,
      title: args.title,
      description: args.description,
      category: args.category,
      color: args.color ?? "#FFB4A2",
      goalType: args.goalType,
      goalTarget: args.goalTarget,
      unit: args.unit,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
    const habit = await ctx.db.get(id);
    if (!habit) throw new Error("Habit not found after create");
    return serializeHabit(habit);
  },
});

export const update = mutation({
  args: {
    userId: v.string(),
    id: v.id("habits"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    color: v.optional(v.string()),
    goalType: v.optional(v.union(v.literal("binary"), v.literal("duration"), v.literal("quantity"))),
    goalTarget: v.optional(v.number()),
    unit: v.optional(v.string()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.id);
    if (!habit || habit.userId !== args.userId) return null;

    await ctx.db.patch(args.id, {
      ...(args.title !== undefined ? { title: args.title } : {}),
      ...(args.description !== undefined ? { description: args.description } : {}),
      ...(args.category !== undefined ? { category: args.category } : {}),
      ...(args.color !== undefined ? { color: args.color } : {}),
      ...(args.goalType !== undefined ? { goalType: args.goalType } : {}),
      ...(args.goalTarget !== undefined ? { goalTarget: args.goalTarget } : {}),
      ...(args.unit !== undefined ? { unit: args.unit } : {}),
      ...(args.active !== undefined ? { active: args.active } : {}),
      updatedAt: Date.now(),
    });

    const updated = await ctx.db.get(args.id);
    if (!updated) throw new Error("Habit disappeared after patch");
    return serializeHabit(updated);
  },
});

export const remove = mutation({
  args: { userId: v.string(), id: v.id("habits") },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.id);
    if (!habit || habit.userId !== args.userId) return false;

    const entries = await ctx.db.query("entries").withIndex("by_habit", (q) => q.eq("habitId", args.id)).collect();
    await Promise.all(entries.map((e) => ctx.db.delete(e._id)));
    await ctx.db.delete(args.id);
    return true;
  },
});
