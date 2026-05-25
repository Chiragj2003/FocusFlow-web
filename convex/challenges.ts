import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const DEFAULT_CHALLENGES = [
  { challengeId: "streak-7", title: "7-Day Streak", description: "Complete all your habits for 7 consecutive days", type: "streak", target: 7, duration: 7, reward: 100, active: true },
  { challengeId: "streak-14", title: "14-Day Champion", description: "Maintain a 14-day habit streak", type: "streak", target: 14, duration: 14, reward: 250, active: true },
  { challengeId: "streak-30", title: "Monthly Master", description: "Complete a full month of consistent habits", type: "streak", target: 30, duration: 30, reward: 500, active: true },
  { challengeId: "completion-50", title: "Half Century", description: "Complete 50 habit entries", type: "completion", target: 50, duration: 30, reward: 150, active: true },
  { challengeId: "completion-100", title: "Century Club", description: "Complete 100 habit entries", type: "completion", target: 100, duration: 60, reward: 300, active: true },
  { challengeId: "focus-60", title: "Hour of Power", description: "Accumulate 60 minutes of focus time", type: "focus", target: 60, duration: 7, reward: 100, active: true },
  { challengeId: "focus-600", title: "Focus Marathon", description: "Accumulate 10 hours of focus time", type: "focus", target: 600, duration: 30, reward: 400, active: true },
] as const;

const getCurrentStreak = (completedDateSet: Set<string>, maxTarget: number) => {
  let streak = 0;
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  while (streak < maxTarget) {
    const key = date.toISOString().slice(0, 10);
    if (!completedDateSet.has(key)) break;
    streak += 1;
    date.setUTCDate(date.getUTCDate() - 1);
  }
  return streak;
};

const computeProgress = (
  type: "streak" | "completion" | "focus" | "quantity",
  joinedAt: number,
  completedEntries: { entryDate: string }[],
  focusSessions: { duration: number }[],
  target: number
) => {
  if (type === "completion" || type === "quantity") return completedEntries.length;
  if (type === "focus") return Math.floor(focusSessions.reduce((sum, s) => sum + s.duration, 0) / 60);
  const set = new Set(completedEntries.map((e) => e.entryDate));
  return getCurrentStreak(set, target);
};

export const list = query({
  args: {},
  handler: async (ctx) => {
    const custom = await ctx.db.query("challenges").collect();
    const customMapped = custom
      .filter((c) => c.active)
      .map((c) => ({
        id: c.challengeId,
        title: c.title,
        description: c.description,
        type: c.type,
        target: c.target,
        duration: c.duration,
        reward: c.reward,
        active: c.active,
      }));
    return [...DEFAULT_CHALLENGES.map((c) => ({ ...c, id: c.challengeId })), ...customMapped];
  },
});

export const join = mutation({
  args: { userId: v.string(), challengeId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("challengeParticipants")
      .withIndex("by_challenge_user", (q) => q.eq("challengeId", args.challengeId).eq("userId", args.userId))
      .first();
    if (existing) return null;

    const all = await ctx.db.query("challenges").withIndex("by_challenge_id", (q) => q.eq("challengeId", args.challengeId)).first();
    const fallback = DEFAULT_CHALLENGES.find((c) => c.challengeId === args.challengeId);
    const selected = all
      ? { challengeId: all.challengeId, title: all.title, description: all.description, type: all.type, target: all.target, duration: all.duration, reward: all.reward, active: all.active }
      : fallback;
    if (!selected) return false;

    const joinedAt = Date.now();
    const participantId = await ctx.db.insert("challengeParticipants", {
      challengeId: args.challengeId,
      userId: args.userId,
      joinedAt,
      progress: 0,
    });

    return {
      id: participantId,
      challengeId: args.challengeId,
      userId: args.userId,
      progress: 0,
      completed: false,
      completedAt: null,
      joinedAt: new Date(joinedAt).toISOString(),
      challenge: {
        id: selected.challengeId,
        title: selected.title,
        description: selected.description,
        type: selected.type,
        target: selected.target,
        duration: selected.duration,
        reward: selected.reward,
        active: selected.active,
        startDate: new Date(joinedAt).toISOString(),
        endDate: new Date(joinedAt + selected.duration * 24 * 60 * 60 * 1000).toISOString(),
      },
    };
  },
});

export const userChallenges = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const participants = await ctx.db.query("challengeParticipants").withIndex("by_user", (q) => q.eq("userId", args.userId)).collect();
    const completedEntries = await ctx.db.query("entries").withIndex("by_user", (q) => q.eq("userId", args.userId)).collect();
    const focusSessions = await ctx.db.query("focusSessions").withIndex("by_user", (q) => q.eq("userId", args.userId)).collect();
    const custom = await ctx.db.query("challenges").collect();

    return participants.map((p) => {
      const c = DEFAULT_CHALLENGES.find((d) => d.challengeId === p.challengeId)
        ?? custom.find((cc) => cc.challengeId === p.challengeId)
        ?? { challengeId: p.challengeId, title: "Unknown Challenge", description: "", type: "completion" as const, target: 30, duration: 30, reward: 200, active: true };

      const joinedISODate = new Date(p.joinedAt).toISOString().slice(0, 10);
      const joinedEntries = completedEntries.filter((e) => e.completed && e.entryDate >= joinedISODate).map((e) => ({ entryDate: e.entryDate }));
      const joinedFocus = focusSessions.filter((s) => s.completedAt >= p.joinedAt).map((s) => ({ duration: s.duration }));
      const progress = computeProgress(c.type, p.joinedAt, joinedEntries, joinedFocus, c.target);
      const completed = progress >= c.target;

      return {
        id: p._id,
        challengeId: p.challengeId,
        userId: p.userId,
        progress,
        completed,
        completedAt: completed ? (p.completedAt ? new Date(p.completedAt).toISOString() : new Date().toISOString()) : null,
        joinedAt: new Date(p.joinedAt).toISOString(),
        challenge: {
          id: c.challengeId,
          title: c.title,
          description: c.description,
          type: c.type,
          target: c.target,
          duration: c.duration,
          reward: c.reward,
          active: c.active,
          startDate: new Date(p.joinedAt).toISOString(),
          endDate: new Date(p.joinedAt + c.duration * 24 * 60 * 60 * 1000).toISOString(),
        },
      };
    });
  },
});

export const progress = mutation({
  args: { userId: v.string(), challengeId: v.string() },
  handler: async (ctx, args) => {
    const participant = await ctx.db
      .query("challengeParticipants")
      .withIndex("by_challenge_user", (q) => q.eq("challengeId", args.challengeId).eq("userId", args.userId))
      .first();
    if (!participant) return null;

    const cDefault = DEFAULT_CHALLENGES.find((c) => c.challengeId === args.challengeId);
    const cCustom = await ctx.db.query("challenges").withIndex("by_challenge_id", (q) => q.eq("challengeId", args.challengeId)).first();
    const challenge = cDefault ?? cCustom;
    if (!challenge) return null;

    const joinedISODate = new Date(participant.joinedAt).toISOString().slice(0, 10);
    const completedEntries = (await ctx.db.query("entries").withIndex("by_user", (q) => q.eq("userId", args.userId)).collect())
      .filter((e) => e.completed && e.entryDate >= joinedISODate)
      .map((e) => ({ entryDate: e.entryDate }));
    const focusSessions = (await ctx.db.query("focusSessions").withIndex("by_user", (q) => q.eq("userId", args.userId)).collect())
      .filter((s) => s.completedAt >= participant.joinedAt)
      .map((s) => ({ duration: s.duration }));
    const progress = computeProgress(challenge.type, participant.joinedAt, completedEntries, focusSessions, challenge.target);
    const completed = progress >= challenge.target;

    await ctx.db.patch(participant._id, {
      progress,
      completedAt: completed ? participant.completedAt ?? Date.now() : undefined,
    });

    return { progress, completed };
  },
});
