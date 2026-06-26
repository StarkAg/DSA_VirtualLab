// Pure helpers that turn Convex progress into dashboard numbers.
// progress shape (from api.progress.forUser):
//   { solved: [{experimentId, challengeId}], quizzes: [{experimentId, best}] }

export const EMPTY_PROGRESS = { solved: [], quizzes: [] };

export function computeStats(experiments, progress = EMPTY_PROGRESS) {
  const total = experiments.reduce((n, e) => n + e.challenges.length, 0);
  const solved = progress.solved?.length || 0;
  const rank = Math.max(1, 500 - solved * 7);
  const starPct = total ? Math.round((solved / total) * 100) : 0;
  return { solved, total, rank, starPct };
}

export function experimentCompletion(exp, progress = EMPTY_PROGRESS) {
  const solvedCount = (progress.solved || []).filter((s) => s.experimentId === exp.id).length;
  const pct = exp.challenges.length
    ? Math.round((solvedCount / exp.challenges.length) * 100)
    : 0;
  const quizBest = (progress.quizzes || []).find((q) => q.experimentId === exp.id)?.best || 0;
  return { solvedCount, pct, quizBest };
}
