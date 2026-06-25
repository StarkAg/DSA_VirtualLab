import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { setProfile } from '../lib/progress.js';

// Mock SRM-style login. No real auth — derives a student profile from the email.
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const handle = (email.split('@')[0] || 'student').toLowerCase();
    const id = String(Math.abs([...handle].reduce((a, c) => a * 31 + c.charCodeAt(0), 7)) % 1000000000).padStart(9, '4');
    setProfile({
      name: (name || handle).replace(/[^a-zA-Z ]/g, '').trim() || 'Student',
      email: email || `${handle}@srmist.edu.in`,
      id,
      dept: 'School of Computing',
    });
    navigate('/dashboard');
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand side */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand p-12 text-white lg:flex">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/20">
            <GraduationCap size={20} />
          </span>
          <span className="font-display text-xl font-bold">DSA Virtual Lab</span>
        </div>
        <div>
          <h1 className="font-display text-4xl font-bold leading-tight">
            Learn Data Structures<br />by doing.
          </h1>
          <p className="mt-4 max-w-md text-white/80">
            Interactive visualizations, real code execution, and guided challenges across
            five core DSA experiments — Stack, Queue, Linked List, Sorting & Searching.
          </p>
          <div className="mt-8 flex flex-wrap gap-2 text-xs">
            {['Stack', 'Queue', 'Linked List', 'Sorting', 'Searching'].map((t) => (
              <span key={t} className="rounded-full bg-white/15 px-3 py-1 font-medium">{t}</span>
            ))}
          </div>
        </div>
        <p className="text-xs text-white/60">School of Computing · DSA Laboratory</p>
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center bg-surface-sunken p-6">
        <form onSubmit={submit} className="card w-full max-w-sm p-8 animate-fade-up">
          <div className="mb-1 flex items-center gap-2 lg:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">
              <GraduationCap size={18} />
            </span>
            <span className="font-display text-lg font-bold">DSA Lab</span>
          </div>
          <h2 className="font-display text-2xl font-bold">Welcome</h2>
          <p className="mt-1 text-sm text-ink-mute">Sign in to enter the virtual lab.</p>

          <label className="mt-6 block text-xs font-medium text-ink-soft">Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dhruv"
            className="mt-1 w-full rounded-lg border border-surface-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />

          <label className="mt-4 block text-xs font-medium text-ink-soft">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="dhruv@srmist.edu.in"
            className="mt-1 w-full rounded-lg border border-surface-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />

          <button type="submit" className="btn-primary mt-6 w-full">
            Continue <ArrowRight size={16} />
          </button>
          <p className="mt-4 text-center text-[11px] text-ink-faint">
            Demo login — no password required. Your progress is saved on this device.
          </p>
        </form>
      </div>
    </div>
  );
}
