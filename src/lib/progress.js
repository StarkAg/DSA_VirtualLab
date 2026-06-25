// localStorage-backed progress & profile store for the DSA Virtual Lab.
const PROFILE_KEY = 'dsalab.profile';
const PROGRESS_KEY = 'dsalab.progress';

export function getProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearProfile() {
  localStorage.removeItem(PROFILE_KEY);
}

// progress shape: { [experimentId]: { solved: { [challengeId]: true }, quizBest: number } }
export function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveProgress(p) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  // notify listeners in the same tab
  window.dispatchEvent(new Event('dsalab:progress'));
}

export function getExperimentProgress(expId) {
  const p = getProgress();
  return p[expId] || { solved: {}, quizBest: 0 };
}

export function markChallengeSolved(expId, challengeId) {
  const p = getProgress();
  if (!p[expId]) p[expId] = { solved: {}, quizBest: 0 };
  p[expId].solved[challengeId] = true;
  saveProgress(p);
}

export function setQuizBest(expId, score) {
  const p = getProgress();
  if (!p[expId]) p[expId] = { solved: {}, quizBest: 0 };
  if (score > (p[expId].quizBest || 0)) p[expId].quizBest = score;
  saveProgress(p);
}

// ---- aggregate stats for the dashboard ----
export function computeStats(experiments) {
  const p = getProgress();
  let solved = 0;
  let total = 0;
  experiments.forEach((exp) => {
    total += exp.challenges.length;
    const ep = p[exp.id];
    if (ep) solved += Object.keys(ep.solved || {}).length;
  });
  // playful rank: fewer solved => higher (worse) rank number, like eLab
  const rank = Math.max(1, 500 - solved * 7);
  const starPct = total ? Math.round((solved / total) * 100) : 0;
  return { solved, total, rank, starPct };
}

// percentage of challenges solved for one experiment (drives card progress bars)
export function experimentCompletion(exp) {
  const ep = getExperimentProgress(exp.id);
  const solvedCount = Object.keys(ep.solved || {}).length;
  const pct = exp.challenges.length
    ? Math.round((solvedCount / exp.challenges.length) * 100)
    : 0;
  return { solvedCount, pct, quizBest: ep.quizBest || 0 };
}
