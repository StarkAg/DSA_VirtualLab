import { v } from "convex/values";
import { query } from "./_generated/server";

// Admin passcode lives in a Convex env var (set via `npx convex env set
// ADMIN_PASSCODE ...`). Falls back to a default for first-run/demo.
function adminPasscode() {
  return process.env.ADMIN_PASSCODE || "dsalab-admin";
}

export const verifyPasscode = query({
  args: { passcode: v.string() },
  handler: async (_ctx, { passcode }) => passcode === adminPasscode(),
});

/** Aggregated per-student stats + overall summary. Passcode-gated. */
export const students = query({
  args: { passcode: v.string() },
  handler: async (ctx, { passcode }) => {
    if (passcode !== adminPasscode()) throw new Error("Invalid admin passcode");

    const users = await ctx.db.query("users").collect();
    const solves = await ctx.db.query("solves").collect();
    const quizzes = await ctx.db.query("quizScores").collect();

    const rows = users
      .filter((u) => u.role === "student")
      .map((u) => {
        const us = solves.filter((s) => s.userId === u._id);
        const uq = quizzes.filter((q) => q.userId === u._id);
        const quizAvg = uq.length
          ? Math.round(uq.reduce((a, b) => a + b.best, 0) / uq.length)
          : 0;
        return {
          id: u._id,
          name: u.name,
          studentId: u.studentId,
          dept: u.dept,
          email: u.email,
          solved: us.length,
          quizAvg,
          lastActiveAt: u.lastActiveAt,
          createdAt: u.createdAt,
        };
      })
      .sort((a, b) => b.solved - a.solved || b.quizAvg - a.quizAvg);

    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const summary = {
      totalStudents: rows.length,
      totalSolves: solves.length,
      activeToday: rows.filter((r) => r.lastActiveAt >= dayAgo).length,
      avgSolved: rows.length
        ? Math.round((solves.length / rows.length) * 10) / 10
        : 0,
    };
    return { rows, summary };
  },
});
