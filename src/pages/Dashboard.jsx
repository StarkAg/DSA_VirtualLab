import { useEffect, useState } from 'react';
import { IdCard, User, CheckCircle2 } from 'lucide-react';
import SectionHeader from '../components/layout/SectionHeader.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import RankWidget from '../components/dashboard/RankWidget.jsx';
import ExperimentCard from '../components/dashboard/ExperimentCard.jsx';
import { experiments } from '../data/experiments.js';
import { getProfile, computeStats } from '../lib/progress.js';

export default function Dashboard() {
  const profile = getProfile();
  const [stats, setStats] = useState(() => computeStats(experiments));

  // refresh when progress changes (e.g. returning from an experiment)
  useEffect(() => {
    const refresh = () => setStats(computeStats(experiments));
    refresh();
    window.addEventListener('dsalab:progress', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('dsalab:progress', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* top stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="User ID" value={profile?.id || '—'} icon={IdCard} />
        <StatCard label="Name" value={(profile?.name || 'Student').toUpperCase()} icon={User} />
        <StatCard
          label="Programs Solved"
          value={`${stats.solved} / ${stats.total}`}
          icon={CheckCircle2}
          sub="across all experiments"
        />
        <RankWidget rank={stats.rank} starPct={stats.starPct} />
      </div>

      {/* experiments section */}
      <section className="card overflow-hidden">
        <SectionHeader title="DSA Lab — Experiments" />
        <div className="grid gap-5 p-5 sm:grid-cols-2 xl:grid-cols-3">
          {experiments.map((exp) => (
            <ExperimentCard key={exp.id} exp={exp} />
          ))}
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-center gap-3 pb-4 text-center text-xs text-ink-faint">
        <span>For any inquiries, please contact your Faculty or Course Coordinator.</span>
      </footer>
    </div>
  );
}
