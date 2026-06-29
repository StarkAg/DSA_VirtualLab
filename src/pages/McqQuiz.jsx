import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { GraduationCap, ArrowRight, ArrowLeft, CheckCircle2, XCircle, ListChecks, RotateCcw, Home } from 'lucide-react';
import { api } from '@convex/api';
import { getProfile, setProfile } from '../lib/identity.js';

// Standalone MCQ quiz at /quiz. Phases: start (name+email) → quiz → result.
export default function McqQuiz() {
  const existing = getProfile();
  const [phase, setPhase] = useState('start'); // start | quiz | result

  const [name, setName] = useState(existing?.name || '');
  const [email, setEmail] = useState(existing?.email || '');
  const [userId, setUserId] = useState(existing?.userId || null);
  const [busy, setBusy] = useState(false);

  const ensureUser = useMutation(api.users.ensureUser);
  const questions = useQuery(api.mcq.listForQuiz) || [];
  const submitAttempt = useMutation(api.mcq.submitAttempt);

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // questionId -> selected index
  const [result, setResult] = useState(null);

  const begin = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const handle = (email.split('@')[0] || 'student').toLowerCase();
    const id = String(Math.abs([...handle].reduce((a, c) => a * 31 + c.charCodeAt(0), 7)) % 1000000000).padStart(9, '4');
    const profile = {
      name: (name || handle).replace(/[^a-zA-Z ]/g, '').trim() || 'Student',
      email: email || `${handle}@srmist.edu.in`,
      id,
      dept: 'School of Computing',
    };
    try {
      const { userId: uid, role } = await ensureUser({
        name: profile.name, email: profile.email, studentId: profile.id, dept: profile.dept,
      });
      setProfile({ ...profile, userId: uid, role });
      setUserId(uid);
      setIdx(0);
      setAnswers({});
      setResult(null);
      setPhase('quiz');
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const payload = questions.map((q) => ({ questionId: q.id, selected: answers[q.id] ?? -1 }));
      const res = await submitAttempt({ userId, answers: payload });
      setResult(res);
      setPhase('result');
    } finally {
      setBusy(false);
    }
  };

  // ── Start ─────────────────────────────────────────────────────────────────
  if (phase === 'start') {
    return (
      <Shell>
        <form onSubmit={begin} className="card w-full max-w-sm p-8 animate-fade-up">
          <div className="mb-1 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white"><GraduationCap size={18} /></span>
            <span className="font-display text-lg font-bold">MCQ Quiz</span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold">Advanced Programming Practice</h2>
          <p className="mt-1 text-sm text-ink-mute">Enter your details to begin the quiz.</p>

          <label className="mt-6 block text-xs font-medium text-ink-soft">Full name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name"
            className="mt-1 w-full rounded-lg border border-surface-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />

          <label className="mt-4 block text-xs font-medium text-ink-soft">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@srmist.edu.in"
            className="mt-1 w-full rounded-lg border border-surface-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />

          <button type="submit" disabled={busy} className="btn-primary mt-6 w-full disabled:opacity-60">
            {busy ? 'Starting…' : 'Start Quiz'} <ArrowRight size={16} />
          </button>
          <p className="mt-4 text-center text-[11px] text-ink-faint">{questions.length} questions · one at a time</p>
          <Link to="/dashboard" className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-medium text-ink-mute hover:text-accent">
            <ArrowLeft size={12} /> Back to lab
          </Link>
        </form>
      </Shell>
    );
  }

  // ── Result ────────────────────────────────────────────────────────────────
  if (phase === 'result' && result) {
    const pct = result.total ? Math.round((result.score / result.total) * 100) : 0;
    const byId = Object.fromEntries(result.results.map((r) => [r.questionId, r]));
    return (
      <Shell>
        <div className="w-full max-w-2xl space-y-4">
          <div className="card p-8 text-center animate-fade-up">
            <span className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${pct >= 60 ? 'bg-ok/15 text-ok' : 'bg-warn/15 text-warn'}`}>
              <ListChecks size={26} />
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold">{result.score} / {result.total}</h2>
            <p className="mt-1 text-sm text-ink-mute">You scored {pct}%</p>
            <div className="mx-auto mt-4 h-2 w-full max-w-sm overflow-hidden rounded-full bg-surface-sunken">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: pct >= 60 ? 'var(--ok, #16a34a)' : '#d97706' }} />
            </div>
            <div className="mt-6 flex justify-center gap-2">
              <button onClick={() => { setPhase('quiz'); setIdx(0); setAnswers({}); setResult(null); }} className="btn-ghost">
                <RotateCcw size={15} /> Retake
              </button>
              <Link to="/dashboard" className="btn-primary"><Home size={15} /> Back to lab</Link>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-surface-line bg-surface-sunken/50 px-4 py-2.5 text-sm font-semibold">Review</div>
            <ul className="divide-y divide-surface-line">
              {questions.map((q, i) => {
                const r = byId[q.id];
                const chosen = answers[q.id];
                return (
                  <li key={q.id} className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      {r?.correct ? <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-ok" /> : <XCircle size={16} className="mt-0.5 shrink-0 text-bad" />}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink">{i + 1}. {q.question}</p>
                        <p className="mt-1 text-xs text-ink-mute">
                          Your answer: <span className={r?.correct ? 'text-ok' : 'text-bad'}>{chosen != null && chosen >= 0 ? q.options[chosen] : '—'}</span>
                          {!r?.correct && r && (<> · Correct: <span className="text-ok">{q.options[r.correctIndex]}</span></>)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Shell>
    );
  }

  // ── Quiz (one question at a time) ───────────────────────────────────────────
  if (questions.length === 0) {
    return <Shell><div className="card p-8 text-center text-sm text-ink-mute">No questions published yet. Check back soon.</div></Shell>;
  }

  const q = questions[idx];
  const selected = answers[q.id];
  const isLast = idx === questions.length - 1;
  const answeredCount = questions.filter((x) => answers[x.id] != null).length;
  const pct = Math.round(((idx + 1) / questions.length) * 100);

  return (
    <Shell>
      <div className="w-full max-w-2xl space-y-4">
        {/* progress */}
        <div className="card flex items-center gap-3 p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand text-white"><GraduationCap size={18} /></span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-ink-mute">Question {idx + 1} of {questions.length}</p>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
              <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <span className="text-xs text-ink-faint">{answeredCount}/{questions.length} answered</span>
        </div>

        {/* question */}
        <div className="card p-6 animate-fade-up" key={q.id}>
          <h3 className="font-display text-lg font-semibold leading-snug text-ink">{q.question}</h3>
          <div className="mt-4 space-y-2">
            {q.options.map((opt, oi) => {
              const active = selected === oi;
              return (
                <button
                  key={oi}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                    active ? 'border-accent bg-accent/10 text-accent' : 'border-surface-line bg-white text-ink-soft hover:bg-surface-sunken'
                  }`}
                >
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-bold ${active ? 'border-accent bg-accent text-white' : 'border-surface-line text-ink-faint'}`}>
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0}
              className="btn-ghost disabled:opacity-40"><ArrowLeft size={15} /> Back</button>
            {isLast ? (
              <button onClick={submit} disabled={busy || answeredCount === 0} className="btn-primary disabled:opacity-50">
                {busy ? 'Submitting…' : 'Submit Quiz'} <CheckCircle2 size={16} />
              </button>
            ) : (
              <button onClick={() => setIdx((i) => Math.min(questions.length - 1, i + 1))} className="btn-primary">
                Next <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }) {
  return <div className="flex min-h-screen items-center justify-center bg-surface-sunken p-6">{children}</div>;
}
