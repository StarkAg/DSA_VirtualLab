import { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { BookOpen, FileText, Code2, HelpCircle, ChevronLeft, Home, ChevronRight, CheckCircle2 } from 'lucide-react';
import SectionHeader from '../components/layout/SectionHeader.jsx';
import TheoryPanel from '../components/experiment/TheoryPanel.jsx';
import ChallengeInfo from '../components/experiment/ChallengeInfo.jsx';
import TestCasePanel from '../components/experiment/TestCasePanel.jsx';
import PracticePanel from '../components/experiment/PracticePanel.jsx';
import Quiz from '../components/quiz/Quiz.jsx';
import { useQuery } from 'convex/react';
import { api } from '@convex/api';
import { getExperiment, experiments } from '../data/experiments.js';
import { getProfile } from '../lib/identity.js';

const TABS = [
  { id: 'theory', label: 'Aim & Theory', icon: BookOpen },
  { id: 'challenge', label: 'Challenge', icon: FileText },
  { id: 'practice', label: 'Practice', icon: Code2 },
  { id: 'quiz', label: 'Quiz', icon: HelpCircle },
];

export default function Experiment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const exp = getExperiment(id);
  const [tab, setTab] = useState('theory');
  const [chIdx, setChIdx] = useState(0);

  const profile = getProfile();
  const progress = useQuery(
    api.progress.forUser,
    profile?.userId ? { userId: profile.userId } : 'skip'
  );

  if (!exp) return <Navigate to="/dashboard" replace />;
  const challenge = exp.challenges[chIdx];
  const solved = new Set(
    (progress?.solved || []).filter((s) => s.experimentId === exp.id).map((s) => s.challengeId)
  );

  const expIndex = experiments.findIndex((e) => e.id === id);
  const nextExp = experiments[(expIndex + 1) % experiments.length];

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      {/* breadcrumb / nav */}
      <div className="flex items-center gap-2 text-sm text-ink-mute">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1 hover:text-accent">
          <Home size={14} /> Dashboard
        </button>
        <ChevronRight size={14} />
        <span className="font-medium text-ink">{exp.title}</span>
        <button
          onClick={() => { navigate(`/experiment/${nextExp.id}`); setTab('theory'); setChIdx(0); }}
          className="ml-auto flex items-center gap-1 rounded-lg border border-surface-line px-2.5 py-1 text-xs hover:bg-surface-sunken"
        >
          Next: {nextExp.title} <ChevronRight size={13} />
        </button>
      </div>

      {/* header + tabs */}
      <div className="card overflow-hidden">
        <SectionHeader title={`${exp.title} — Experiment`} />
        <div className="flex flex-wrap gap-1 border-b border-surface-line bg-surface-sunken/50 px-2 py-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  active ? 'bg-accent text-white shadow-pop' : 'text-ink-mute hover:bg-white hover:text-ink-soft'
                }`}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="p-4">
          {/* challenge selector for challenge/practice tabs */}
          {(tab === 'challenge' || tab === 'practice') && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-ink-faint">CHALLENGE:</span>
              {exp.challenges.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setChIdx(i)}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition ${
                    chIdx === i ? 'border-accent bg-accent/10 text-accent' : 'border-surface-line bg-white text-ink-mute hover:bg-surface-sunken'
                  }`}
                >
                  {solved.has(c.id) && <CheckCircle2 size={13} className="text-ok" />}
                  {c.title}
                </button>
              ))}
            </div>
          )}

          {tab === 'theory' && <TheoryPanel exp={exp} />}
          {tab === 'challenge' && (
            <div className="space-y-4">
              <ChallengeInfo exp={exp} challenge={challenge} />
              <TestCasePanel challenge={challenge} />
              <button onClick={() => setTab('practice')} className="btn-primary">
                Start coding <Code2 size={15} />
              </button>
            </div>
          )}
          {tab === 'practice' && (
            <div className="space-y-4">
              <ChallengeInfo exp={exp} challenge={challenge} />
              <PracticePanel experimentId={exp.id} challenge={challenge} />
            </div>
          )}
          {tab === 'quiz' && <Quiz exp={exp} />}
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-center gap-3 pb-4 text-xs text-ink-faint">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1 hover:text-accent">
          <ChevronLeft size={13} /> Back to Dashboard
        </button>
        <span>·</span>
        <span>For any inquiries, please contact your Faculty or Course Coordinator.</span>
      </footer>
    </div>
  );
}
