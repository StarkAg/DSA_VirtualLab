import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { ShieldCheck, Users, CheckCircle2, Activity, Trophy, ArrowLeft, LogOut, GraduationCap } from 'lucide-react';
import { api } from '@convex/api';
import SectionHeader from '../components/layout/SectionHeader.jsx';
import { getAdminPasscode, setAdminPasscode, clearAdminPasscode } from '../lib/identity.js';

export default function Admin() {
  const [passcode, setPasscode] = useState(getAdminPasscode());
  const [draft, setDraft] = useState('');

  // Validate the passcode reactively; only fetch data once it's correct.
  const valid = useQuery(api.admin.verifyPasscode, passcode ? { passcode } : 'skip');
  const authed = valid === true;
  const showError = !!passcode && valid === false;

  useEffect(() => {
    if (authed) setAdminPasscode(passcode);
  }, [authed, passcode]);

  const submit = (e) => {
    e.preventDefault();
    setPasscode(draft.trim());
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-sunken p-6">
        <form onSubmit={submit} className="card w-full max-w-sm p-8 animate-fade-up">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-white">
            <ShieldCheck size={22} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold">Admin access</h1>
          <p className="mt-1 text-sm text-ink-mute">Enter the admin passcode to view student analytics.</p>
          <input
            type="password"
            value={draft}
            onChange={(e) => { setDraft(e.target.value); setPasscode(''); }}
            placeholder="Passcode"
            className="mt-5 w-full rounded-lg border border-surface-line bg-white px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          {showError && <p className="mt-2 text-xs font-medium text-bad">Invalid passcode. Try again.</p>}
          <button type="submit" className="btn-primary mt-5 w-full">Enter</button>
          <Link to="/login" className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-ink-mute hover:text-accent">
            <ArrowLeft size={12} /> Back to student login
          </Link>
        </form>
      </div>
    );
  }

  return <AdminDashboard passcode={passcode} onLogout={() => { clearAdminPasscode(); setPasscode(''); setDraft(''); }} />;
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-surface-sunken text-ink-mute"><Icon size={20} /></span>
      <div>
        <p className="stat-label">{label}</p>
        <p className="font-display text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function timeAgo(ts) {
  if (!ts) return '—';
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function AdminDashboard({ passcode, onLogout }) {
  const data = useQuery(api.admin.students, { passcode });
  const rows = data?.rows || [];
  const summary = data?.summary || { totalStudents: 0, totalSolves: 0, activeToday: 0, avgSolved: 0 };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-surface-line bg-surface/90 px-4 py-2.5 backdrop-blur">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white"><GraduationCap size={18} /></span>
        <span className="font-display text-lg font-bold">DSA<span className="text-accent">Lab</span></span>
        <span className="chip border-accent/30 bg-accent/10 text-accent">Admin</span>
        <button onClick={onLogout} className="ml-auto flex items-center gap-2 rounded-lg bg-bad px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110">
          <LogOut size={14} /> Sign out
        </button>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-4 py-5 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat icon={Users} label="Students" value={summary.totalStudents} />
          <Stat icon={CheckCircle2} label="Total solves" value={summary.totalSolves} />
          <Stat icon={Activity} label="Active today" value={summary.activeToday} />
          <Stat icon={Trophy} label="Avg solved / student" value={summary.avgSolved} />
        </div>

        <section className="card overflow-hidden">
          <SectionHeader title="Students & Leaderboard" right={<span className="text-[11px] text-white/80">{rows.length} students</span>} />
          {data === undefined ? (
            <div className="p-6 text-sm text-ink-mute">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-ink-mute">No students have signed in yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-line text-left text-[11px] uppercase tracking-wide text-ink-faint">
                    <th className="px-4 py-2.5 font-medium">#</th>
                    <th className="px-4 py-2.5 font-medium">Student</th>
                    <th className="px-4 py-2.5 font-medium">ID</th>
                    <th className="px-4 py-2.5 font-medium">Dept</th>
                    <th className="px-4 py-2.5 text-center font-medium">Solved</th>
                    <th className="px-4 py-2.5 text-center font-medium">Quiz avg</th>
                    <th className="px-4 py-2.5 font-medium">Last active</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.id} className="border-b border-surface-line last:border-0 hover:bg-surface-sunken/50">
                      <td className="px-4 py-2.5">
                        <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${i < 3 ? 'bg-warn/15 text-warn' : 'text-ink-faint'}`}>{i + 1}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-ink">{r.name}</div>
                        <div className="text-[11px] text-ink-faint">{r.email}</div>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-ink-mute">{r.studentId}</td>
                      <td className="px-4 py-2.5 text-xs text-ink-mute">{r.dept}</td>
                      <td className="px-4 py-2.5 text-center font-semibold text-accent">{r.solved}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`font-medium ${r.quizAvg >= 60 ? 'text-ok' : 'text-ink-soft'}`}>{r.quizAvg}%</span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-ink-mute">{timeAgo(r.lastActiveAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <p className="pb-4 text-center text-xs text-ink-faint">DSA Virtual Lab · Admin analytics · Mentors: Dr. V. Arun & Dr. U. V. Anbazhagu</p>
      </main>
    </div>
  );
}
