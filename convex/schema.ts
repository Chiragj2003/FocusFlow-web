import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    timezone: v.optional(v.string()),
    isDeactivated: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_user_id", ["clerkUserId"]),

  habits: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    color: v.string(),
    goalType: v.union(v.literal("binary"), v.literal("duration"), v.literal("quantity")),
    goalTarget: v.optional(v.number()),
    unit: v.optional(v.string()),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]).index("by_user_active", ["userId", "active"]),

  entries: defineTable({
    habitId: v.id("habits"),
    userId: v.string(),
    entryDate: v.string(), // YYYY-MM-DD
    completed: v.boolean(),
    value: v.optional(v.number()),
    notes: v.optional(v.string()),
    mood: v.optional(v.number()),
    energy: v.optional(v.number()),
    duration: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_habit", ["habitId"])
    .index("by_user_date", ["userId", "entryDate"])
    .index("by_habit_user_date", ["habitId", "userId", "entryDate"]),

  focusSessions: defineTable({
    userId: v.string(),
    habitId: v.optional(v.id("habits")),
    duration: v.number(),
    notes: v.optional(v.string()),
    completedAt: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  challenges: defineTable({
    challengeId: v.string(),
    title: v.string(),
    description: v.string(),
    type: v.union(v.literal("streak"), v.literal("completion"), v.literal("focus"), v.literal("quantity")),
    target: v.number(),
    duration: v.number(),
    reward: v.number(),
    active: v.boolean(),
    createdAt: v.number(),
  }).index("by_challenge_id", ["challengeId"]),

  challengeParticipants: defineTable({
    challengeId: v.string(),
    userId: v.string(),
    joinedAt: v.number(),
    progress: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_challenge_user", ["challengeId", "userId"]),

  badges: defineTable({
    userId: v.string(),
    name: v.string(),
    awardedAt: v.number(),
    metadata: v.optional(v.any()),
  }).index("by_user", ["userId"]).index("by_user_name", ["userId", "name"]),
});
