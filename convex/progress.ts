import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

async function touch(ctx: any, userId: Id<"users">) {
  await ctx.db.patch(userId, { lastActiveAt: Date.now() });
}

/** Mark a challenge solved (idempotent) when all test cases pass. */
export const recordSolve = mutation({
  args: {
    userId: v.id("users"),
    experimentId: v.string(),
    challengeId: v.string(),
    language: v.string(),
  },
  handler: async (ctx, { userId, experimentId, challengeId, language }) => {
    const existing = await ctx.db
      .query("solves")
      .withIndex("by_user_challenge", (q) =>
        q.eq("userId", userId).eq("experimentId", experimentId).eq("challengeId", challengeId)
      )
      .first();
    if (!existing) {
      await ctx.db.insert("solves", {
        userId,
        experimentId,
        challengeId,
        language,
        solvedAt: Date.now(),
      });
    }
    await touch(ctx, userId);
  },
});

/** Log every Evaluate run (metadata only). */
export const logSubmission = mutation({
  args: {
    userId: v.id("users"),
    experimentId: v.string(),
    challengeId: v.string(),
    language: v.string(),
    passed: v.boolean(),
    passedCount: v.number(),
    total: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("submissions", { ...args, createdAt: Date.now() });
    await touch(ctx, args.userId);
  },
});

/** Keep the best (highest) quiz score per experiment. */
export const setQuizBest = mutation({
  args: { userId: v.id("users"), experimentId: v.string(), best: v.number() },
  handler: async (ctx, { userId, experimentId, best }) => {
    const existing = await ctx.db
      .query("quizScores")
      .withIndex("by_user_experiment", (q) =>
        q.eq("userId", userId).eq("experimentId", experimentId)
      )
      .first();
    if (existing) {
      if (best > existing.best) await ctx.db.patch(existing._id, { best, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("quizScores", { userId, experimentId, best, updatedAt: Date.now() });
    }
    await touch(ctx, userId);
  },
});

/** All progress for one user — drives the dashboard. */
export const forUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const solves = await ctx.db
      .query("solves")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const quizzes = await ctx.db
      .query("quizScores")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return {
      solved: solves.map((s) => ({ experimentId: s.experimentId, challengeId: s.challengeId })),
      quizzes: quizzes.map((q) => ({ experimentId: q.experimentId, best: q.best })),
    };
  },
});
