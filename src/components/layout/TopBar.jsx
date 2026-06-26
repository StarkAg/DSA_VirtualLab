import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Power, GraduationCap } from 'lucide-react';
import { clearProfile } from '../../lib/identity.js';

function Chip({ label, value, color }) {
  return (
    <span className="chip" style={{ borderColor: `${color}55`, background: `${color}11`, color }}>
      <span className="opacity-70">{label}:</span>
      <span className="font-semibold">{value}</span>
    </span>
  );
}

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

const ordinal = (d) => {
  if (d > 3 && d < 21) return 'th';
  switch (d % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

export default function TopBar({ profile }) {
  const navigate = useNavigate();
  const now = useClock();
  const day = now.getDate();
  const dateStr = `${now.toLocaleString('en-US', { month: 'long' })} ${day}${ordinal(day)} ${now.getFullYear()}, ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}`;

  const logout = () => {
    clearProfile();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-surface-line bg-surface/90 px-4 py-2.5 backdrop-blur">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 pr-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">
          <GraduationCap size={18} />
        </span>
        <span className="font-display text-lg font-bold tracking-tight">
          DSA<span className="text-accent">Lab</span>
        </span>
      </button>

      <div className="hidden flex-wrap items-center gap-2 lg:flex">
        <Chip label="Role" value="Student" color="#16a34a" />
        <Chip label="Name" value={profile?.name || 'Student'} color="#2563eb" />
        <Chip label="Id" value={profile?.id || '—'} color="#0d9488" />
        <Chip label="Dept" value={profile?.dept || 'CSE'} color="#d97706" />
      </div>

      <span className="ml-auto hidden items-center gap-1.5 text-xs text-ink-mute md:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {dateStr}
      </span>

      <button
        onClick={logout}
        className="ml-auto flex items-center gap-2 rounded-lg bg-bad px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 md:ml-3"
      >
        <Power size={14} /> LOGOUT
      </button>
    </header>
  );
}
