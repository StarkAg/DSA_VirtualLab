import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Admin passcode (same env var as admin.ts). Falls back for first-run/demo.
function adminPasscode() {
  return process.env.ADMIN_PASSCODE || "dsalab-admin";
}
function requireAdmin(passcode: string) {
  if (passcode !== adminPasscode()) throw new Error("Invalid admin passcode");
}

// ── Public quiz API ──────────────────────────────────────────────────────────

/** Questions for the quiz, ordered — WITHOUT the correct answer (graded server-side). */
export const listForQuiz = query({
  args: {},
  handler: async (ctx) => {
    const qs = await ctx.db.query("mcqQuestions").withIndex("by_order").collect();
    qs.sort((a, b) => a.order - b.order);
    return qs.map((q) => ({ id: q._id, question: q.question, options: q.options }));
  },
});

/** Grade an attempt server-side, record it, and return a per-question review. */
export const submitAttempt = mutation({
  args: {
    userId: v.id("users"),
    answers: v.array(v.object({ questionId: v.id("mcqQuestions"), selected: v.number() })),
  },
  handler: async (ctx, { userId, answers }) => {
    const all = await ctx.db.query("mcqQuestions").collect();
    const byId = new Map(all.map((q) => [q._id, q]));

    let score = 0;
    const results = answers.map(({ questionId, selected }) => {
      const q = byId.get(questionId);
      const correctIndex = q ? q.answer : -1;
      const correct = q ? selected === q.answer : false;
      if (correct) score++;
      return { questionId, selected, correctIndex, correct };
    });

    const user = await ctx.db.get(userId);
    const total = all.length;
    await ctx.db.insert("mcqAttempts", {
      userId,
      name: user?.name ?? "Student",
      email: user?.email ?? "",
      score,
      total,
      submittedAt: Date.now(),
    });
    return { score, total, results };
  },
});

// ── Admin (passcode-gated) ───────────────────────────────────────────────────

export const adminList = query({
  args: { passcode: v.string() },
  handler: async (ctx, { passcode }) => {
    requireAdmin(passcode);
    const qs = await ctx.db.query("mcqQuestions").withIndex("by_order").collect();
    qs.sort((a, b) => a.order - b.order);
    return qs.map((q) => ({
      id: q._id,
      question: q.question,
      options: q.options,
      answer: q.answer,
      order: q.order,
    }));
  },
});

export const create = mutation({
  args: {
    passcode: v.string(),
    question: v.string(),
    options: v.array(v.string()),
    answer: v.number(),
  },
  handler: async (ctx, { passcode, question, options, answer }) => {
    requireAdmin(passcode);
    const existing = await ctx.db.query("mcqQuestions").collect();
    const nextOrder = existing.reduce((m, q) => Math.max(m, q.order), 0) + 1;
    return ctx.db.insert("mcqQuestions", {
      question,
      options,
      answer,
      order: nextOrder,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    passcode: v.string(),
    id: v.id("mcqQuestions"),
    question: v.string(),
    options: v.array(v.string()),
    answer: v.number(),
  },
  handler: async (ctx, { passcode, id, question, options, answer }) => {
    requireAdmin(passcode);
    await ctx.db.patch(id, { question, options, answer });
  },
});

export const remove = mutation({
  args: { passcode: v.string(), id: v.id("mcqQuestions") },
  handler: async (ctx, { passcode, id }) => {
    requireAdmin(passcode);
    await ctx.db.delete(id);
  },
});

export const attempts = query({
  args: { passcode: v.string() },
  handler: async (ctx, { passcode }) => {
    requireAdmin(passcode);
    const rows = await ctx.db.query("mcqAttempts").collect();
    rows.sort((a, b) => b.submittedAt - a.submittedAt);
    return rows.slice(0, 100).map((r) => ({
      id: r._id,
      name: r.name,
      email: r.email,
      score: r.score,
      total: r.total,
      submittedAt: r.submittedAt,
    }));
  },
});

// ── Seed (idempotent) — 10 MCQs from the 21CSC203P syllabus ──────────────────

const SEED = [
  {
    question:
      "The Böhm–Jacopini structured program theorem states that any computable function can be expressed using which three control structures?",
    options: [
      "Sequence, selection, and iteration",
      "Recursion, iteration, and goto",
      "Branch, jump, and loop",
      "Functions, classes, and objects",
    ],
    answer: 0,
  },
  {
    question:
      "Which programming paradigm describes computation as statements that change a program's state?",
    options: ["Imperative paradigm", "Declarative paradigm", "Logic paradigm", "Functional paradigm"],
    answer: 0,
  },
  {
    question:
      "Bundling data and the methods that operate on it into a single unit while hiding internal details is known as:",
    options: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"],
    answer: 0,
  },
  {
    question: "In Java, multiple inheritance of type is achieved by implementing multiple:",
    options: ["Interfaces", "Abstract classes", "Packages", "Constructors"],
    answer: 0,
  },
  {
    question: "JDBC (Java Database Connectivity) is primarily used to:",
    options: [
      "Connect to a database and execute queries",
      "Build graphical user interfaces",
      "Manage threads and concurrency",
      "Open network sockets",
    ],
    answer: 0,
  },
  {
    question: "Executing multiple threads concurrently within a single program is called:",
    options: ["Multithreading", "Multiprocessing", "Serialization", "Recursion"],
    answer: 0,
  },
  {
    question: "The MVC architecture used with Java Swing separates an application into Model, View, and:",
    options: ["Controller", "Container", "Compiler", "Connector"],
    answer: 0,
  },
  {
    question:
      "A function that always returns the same output for the same input and produces no side effects is a:",
    options: ["Pure function", "Void function", "Virtual function", "Static function"],
    answer: 0,
  },
  {
    question:
      "In network programming, which transport-layer protocol is reliable and connection-oriented?",
    options: ["TCP", "UDP", "IP", "HTTP"],
    answer: 0,
  },
  {
    question: "How does a DFA differ from an NFA?",
    options: [
      "A DFA has exactly one transition per input symbol from each state",
      "A DFA can have multiple transitions for the same symbol",
      "A DFA allows epsilon (empty) transitions",
      "A DFA cannot accept any regular language",
    ],
    answer: 0,
  },
];

export const seedQuestions = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("mcqQuestions").first();
    if (existing) return { seeded: 0, note: "questions already present" };
    const now = Date.now();
    let order = 1;
    for (const q of SEED) {
      await ctx.db.insert("mcqQuestions", { ...q, order: order++, createdAt: now });
    }
    return { seeded: SEED.length };
  },
});
