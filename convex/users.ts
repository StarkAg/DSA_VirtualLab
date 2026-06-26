import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/** Upsert a student by email on login. Returns their id + role. */
export const ensureUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    studentId: v.string(),
    dept: v.string(),
  },
  handler: async (ctx, { name, email, studentId, dept }) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { name, studentId, dept, lastActiveAt: now });
      return { userId: existing._id, role: existing.role };
    }
    const userId = await ctx.db.insert("users", {
      name,
      email,
      studentId,
      dept,
      role: "student",
      createdAt: now,
      lastActiveAt: now,
    });
    return { userId, role: "student" as const };
  },
});

export const get = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => ctx.db.get(userId),
});
