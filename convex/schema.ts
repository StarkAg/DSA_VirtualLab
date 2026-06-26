/**
 * Convex schema for the DSA Virtual Lab.
 * Stores users, per-challenge solves, quiz scores and submission logs.
 * Experiment CONTENT (problems, test cases, quizzes) lives in the app code
 * (src/data/experiments.js); Convex only tracks people + their progress.
 */
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    studentId: v.string(),
    dept: v.string(),
    role: v.union(v.literal("student"), v.literal("admin")),
    createdAt: v.number(),
    lastActiveAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  // One row per (user, experiment, challenge) once solved.
  solves: defineTable({
    userId: v.id("users"),
    experimentId: v.string(),
    challengeId: v.string(),
    language: v.string(),
    solvedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_challenge", ["userId", "experimentId", "challengeId"]),

  // Best quiz score (%) per (user, experiment).
  quizScores: defineTable({
    userId: v.id("users"),
    experimentId: v.string(),
    best: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_experiment", ["userId", "experimentId"]),

  // Lightweight log of every Evaluate run (no source stored).
  submissions: defineTable({
    userId: v.id("users"),
    experimentId: v.string(),
    challengeId: v.string(),
    language: v.string(),
    passed: v.boolean(),
    passedCount: v.number(),
    total: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
