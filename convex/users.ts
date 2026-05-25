import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertFromClerk = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
        timezone: args.timezone ?? existing.timezone ?? "UTC",
        updatedAt: now,
      });
      const updated = await ctx.db.get(existing._id);
      return updated;
    }
    const id = await ctx.db.insert("users", {
      clerkUserId: args.clerkUserId,
      email: args.email,
      name: args.name,
      timezone: args.timezone ?? "UTC",
      isDeactivated: false,
      createdAt: now,
      updatedAt: now,
    });
    return await ctx.db.get(id);
  },
});

export const getByClerkId = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("users").withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId)).first();
  },
});

export const setDeactivated = mutation({
  args: { clerkUserId: v.string(), deactivated: v.boolean() },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId)).first();
    if (!user) return null;
    await ctx.db.patch(user._id, { isDeactivated: args.deactivated, updatedAt: Date.now() });

    const habits = await ctx.db.query("habits").withIndex("by_user", (q) => q.eq("userId", args.clerkUserId)).collect();
    await Promise.all(habits.map((h) => ctx.db.patch(h._id, { active: !args.deactivated, updatedAt: Date.now() })));
    return true;
  },
});

export const purgeUserData = mutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const [users, habits, entries, focusSessions, participants, badges] = await Promise.all([
      ctx.db.query("users").withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId)).collect(),
      ctx.db.query("habits").withIndex("by_user", (q) => q.eq("userId", args.clerkUserId)).collect(),
      ctx.db.query("entries").withIndex("by_user", (q) => q.eq("userId", args.clerkUserId)).collect(),
      ctx.db.query("focusSessions").withIndex("by_user", (q) => q.eq("userId", args.clerkUserId)).collect(),
      ctx.db.query("challengeParticipants").withIndex("by_user", (q) => q.eq("userId", args.clerkUserId)).collect(),
      ctx.db.query("badges").withIndex("by_user", (q) => q.eq("userId", args.clerkUserId)).collect(),
    ]);

    await Promise.all([
      ...users.map((d) => ctx.db.delete(d._id)),
      ...habits.map((d) => ctx.db.delete(d._id)),
      ...entries.map((d) => ctx.db.delete(d._id)),
      ...focusSessions.map((d) => ctx.db.delete(d._id)),
      ...participants.map((d) => ctx.db.delete(d._id)),
      ...badges.map((d) => ctx.db.delete(d._id)),
    ]);
    return true;
  },
});
