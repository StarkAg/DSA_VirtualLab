import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { BookOpen, FileText, Code2, HelpCircle, ChevronLeft, Home, ChevronRight, CheckCircle2 } from 'lucide-react';
import SectionHeader from '../components/layout/SectionHeader.jsx';
import TheoryPanel from '../components/experiment/TheoryPanel.jsx';
import ChallengeInfo from '../components/experiment/ChallengeInfo.jsx';
import TestCasePanel from '../components/experiment/TestCasePanel.jsx';
import PracticePanel from '../components/experiment/PracticePanel.jsx';
import Quiz from '../components/quiz/Quiz.jsx';
import Certificate from '../components/Certificate.jsx';
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

  const [certOpen, setCertOpen] = useState(false);

  const profile = getProfile();
  const progress = useQuery(
    api.progress.forUser,
    profile?.userId ? { userId: profile.userId } : 'skip'
  );

  // Auto-pop certificate the moment this session causes full completion
  const solvedCount = (progress?.solved || []).filter(s => s.experimentId === id).length;
  const pct = exp ? (exp.challenges.length ? Math.round((solvedCount / exp.challenges.length) * 100) : 0) : 0;
  const prevPct = useRef(null);
  useEffect(() => {
    if (progress === undefined) return; // still loading
    if (pct === 100 && prevPct.current !== null && prevPct.current < 100) {
      setCertOpen(true);
    }
    prevPct.current = pct;
  }, [pct, progress]);

  if (!exp) return <Navigate to="/dashboard" replace />;
  const challenge = exp.challenges[chIdx];
  const solved = new Set(
    (progress?.solved || []).filter((s) => s.experimentId === exp.id).map((s) => s.challengeId)
  );

  const expIndex = experiments.findIndex((e) => e.id === id);
  const nextExp = experiments[(expIndex + 1) % experiments.length];

  // step navigation across the 4 tabs
  const curIdx = TABS.findIndex((t) => t.id === tab);
  const prevTab = TABS[curIdx - 1];
  const nextTab = TABS[curIdx + 1];
  const goTab = (tabId) => { setTab(tabId); window.scrollTo({ top: 0, behavior: 'smooth' }); };

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

        {/* step navigation — keeps students moving forward through the tabs */}
        <style>{`@keyframes nudgeX { 0%,100%{transform:translateX(0)} 50%{transform:translateX(4px)} }`}</style>
        <div className="flex items-center justify-between gap-3 border-t border-surface-line bg-surface-sunken/40 px-4 py-3">
          {prevTab ? (
            <button
              onClick={() => goTab(prevTab.id)}
              className="flex items-center gap-1.5 rounded-lg border border-surface-line bg-white px-3 py-2 text-sm font-medium text-ink-mute transition hover:bg-surface-sunken"
            >
              <ChevronLeft size={15} /> {prevTab.label}
            </button>
          ) : <span />}

          {nextTab ? (
            <button
              onClick={() => goTab(nextTab.id)}
              className="btn-primary flex items-center gap-2 px-4 py-2 text-sm shadow-pop ring-2 ring-accent/20"
            >
              Next: {nextTab.label}
              <ChevronRight size={16} style={{ animation: 'nudgeX 1.1s ease-in-out infinite' }} />
            </button>
          ) : (
            <button
              onClick={() => { navigate(`/experiment/${nextExp.id}`); setTab('theory'); setChIdx(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="btn-primary flex items-center gap-2 px-4 py-2 text-sm shadow-pop ring-2 ring-accent/20"
            >
              Next experiment: {nextExp.title}
              <ChevronRight size={16} style={{ animation: 'nudgeX 1.1s ease-in-out infinite' }} />
            </button>
          )}
        </div>
      </div>

      {certOpen && <Certificate exp={exp} onClose={() => setCertOpen(false)} />}

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
