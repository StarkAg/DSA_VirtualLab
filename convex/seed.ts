import { mutation } from "./_generated/server";

// Idempotent demo data so the dashboard/admin panel look alive in a demo.
// Run once: `npx convex run seed:demo` (add --prod for production).
const DEMO = [
  {
    name: "Aarav Sharma", email: "aarav@srmist.edu.in", studentId: "457210094",
    solves: [["stack", "balanced"], ["stack", "reverse"], ["queue", "fifo"], ["sorting", "ascending"], ["searching", "linear-find"]],
    quizzes: [["stack", 100], ["queue", 75], ["sorting", 75]],
  },
  {
    name: "Diya Patel", email: "diya@srmist.edu.in", studentId: "457210188",
    solves: [["stack", "balanced"], ["queue", "fifo"], ["linkedlist", "build-print"], ["searching", "binary-find"]],
    quizzes: [["stack", 75], ["linkedlist", 100]],
  },
  {
    name: "Rohan Verma", email: "rohan@srmist.edu.in", studentId: "457210233",
    solves: [["stack", "balanced"], ["stack", "reverse"], ["sorting", "ascending"]],
    quizzes: [["stack", 50], ["sorting", 100]],
  },
  {
    name: "Ananya Iyer", email: "ananya@srmist.edu.in", studentId: "457210301",
    solves: [["queue", "fifo"], ["searching", "linear-find"]],
    quizzes: [["queue", 100]],
  },
  {
    name: "Kabir Singh", email: "kabir@srmist.edu.in", studentId: "457210377",
    solves: [["stack", "balanced"]],
    quizzes: [["stack", 25]],
  },
];

const PURGE_EMAILS = [
  "aarav@srmist.edu.in",
  "diya@srmist.edu.in",
  "rohan@srmist.edu.in",
  "ananya@srmist.edu.in",
  "kabir@srmist.edu.in",
  "prodtest1782457157102@srmist.edu.in",
];

export const purgeDemo = mutation({
  args: {},
  handler: async (ctx) => {
    let deleted = 0;
    for (const email of PURGE_EMAILS) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();
      if (!user) continue;
      const uid = user._id;
      for (const row of await ctx.db.query("solves").withIndex("by_user", (q) => q.eq("userId", uid)).collect())
        await ctx.db.delete(row._id);
      for (const row of await ctx.db.query("quizScores").withIndex("by_user", (q) => q.eq("userId", uid)).collect())
        await ctx.db.delete(row._id);
      for (const row of await ctx.db.query("submissions").withIndex("by_user", (q) => q.eq("userId", uid)).collect())
        await ctx.db.delete(row._id);
      await ctx.db.delete(uid);
      deleted++;
    }
    return { deleted };
  },
});

export const demo = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    for (const s of DEMO) {
      let user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", s.email))
        .first();
      const userId = user
        ? (await ctx.db.patch(user._id, { lastActiveAt: now }), user._id)
        : await ctx.db.insert("users", {
            name: s.name, email: s.email, studentId: s.studentId, dept: "School of Computing",
            role: "student", createdAt: now, lastActiveAt: now,
          });

      for (const [experimentId, challengeId] of s.solves) {
        const existing = await ctx.db
          .query("solves")
          .withIndex("by_user_challenge", (q) =>
            q.eq("userId", userId).eq("experimentId", experimentId).eq("challengeId", challengeId)
          )
          .first();
        if (!existing) {
          await ctx.db.insert("solves", { userId, experimentId, challengeId, language: "c", solvedAt: now });
        }
      }
      for (const [experimentId, best] of s.quizzes) {
        const q = await ctx.db
          .query("quizScores")
          .withIndex("by_user_experiment", (qq) => qq.eq("userId", userId).eq("experimentId", String(experimentId)))
          .first();
        if (q) { if (Number(best) > q.best) await ctx.db.patch(q._id, { best: Number(best), updatedAt: now }); }
        else await ctx.db.insert("quizScores", { userId, experimentId: String(experimentId), best: Number(best), updatedAt: now });
      }
    }
    return { seeded: DEMO.length };
  },
});
