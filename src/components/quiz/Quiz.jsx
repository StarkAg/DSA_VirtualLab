import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { api } from '@convex/api';
import { getProfile } from '../../lib/identity.js';

export default function Quiz({ exp }) {
  const profile = getProfile();
  const setQuizBest = useMutation(api.progress.setQuizBest);
  const progress = useQuery(
    api.progress.forUser,
    profile?.userId ? { userId: profile.userId } : 'skip'
  );
  const best = progress?.quizzes?.find((q) => q.experimentId === exp.id)?.best || 0;

  const [answers, setAnswers] = useState({}); // qIdx -> optionIdx
  const [submitted, setSubmitted] = useState(false);

  const total = exp.quiz.length;
  const score = exp.quiz.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0);
  const pct = Math.round((score / total) * 100);

  const submit = () => {
    setSubmitted(true);
    if (profile?.userId) {
      setQuizBest({ userId: profile.userId, experimentId: exp.id, best: pct }).catch(() => {});
    }
  };
  const retry = () => { setAnswers({}); setSubmitted(false); };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="card flex items-center justify-between p-4">
        <div>
          <h3 className="font-display text-lg font-bold">Quiz — {exp.title}</h3>
          <p className="text-sm text-ink-mute">Answer all {total} questions and submit.</p>
        </div>
        <span className="chip border-warn/30 bg-warn/10 text-warn">
          <Trophy size={13} /> Best {best}%
        </span>
      </div>

      {exp.quiz.map((q, qi) => (
        <div key={qi} className="card p-4">
          <p className="font-medium text-ink">{qi + 1}. {q.q}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {q.options.map((opt, oi) => {
              const chosen = answers[qi] === oi;
              const correct = q.answer === oi;
              let cls = 'border-surface-line bg-white hover:bg-surface-sunken';
              if (submitted) {
                if (correct) cls = 'border-ok/40 bg-ok/10 text-ok';
                else if (chosen) cls = 'border-bad/40 bg-bad/10 text-bad';
                else cls = 'border-surface-line bg-white text-ink-mute';
              } else if (chosen) {
                cls = 'border-accent bg-accent/10 text-accent';
              }
              return (
                <button
                  key={oi}
                  disabled={submitted}
                  onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                  className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${cls}`}
                >
                  <span>{opt}</span>
                  {submitted && correct && <CheckCircle2 size={15} />}
                  {submitted && chosen && !correct && <XCircle size={15} />}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={submit}
          disabled={Object.keys(answers).length < total}
          className="btn-primary w-full disabled:opacity-40"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="card flex flex-col items-center gap-2 p-5 text-center animate-pop-in">
          <Trophy size={28} className={pct >= 60 ? 'text-warn' : 'text-ink-faint'} />
          <p className="font-display text-2xl font-bold">{score} / {total}</p>
          <p className="text-sm text-ink-mute">You scored {pct}% {pct >= 60 ? '— well done!' : '— review the theory and try again.'}</p>
          <button onClick={retry} className="btn-ghost mt-2"><RotateCcw size={14} /> Try again</button>
        </div>
      )}
    </div>
  );
}
