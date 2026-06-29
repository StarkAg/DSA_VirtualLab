import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Power, GraduationCap } from 'lucide-react';
import { clearProfile } from '../../lib/identity.js';

// LinkedIn brand blue
const LINKEDIN = '#0A66C2';

function Chip({ label, value }) {
  return (
    <span className="chip border-white/25 bg-white/15 text-white">
      <span className="opacity-75">{label}:</span>
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
    <header
      className="sticky top-0 z-40 flex items-center gap-2 px-3 py-2.5 text-white shadow-md sm:gap-3 sm:px-4"
      style={{ background: LINKEDIN }}
    >
      <button onClick={() => navigate('/dashboard')} className="flex shrink-0 items-center gap-2 pr-1 sm:pr-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/20 text-white">
          <GraduationCap size={18} />
        </span>
        <span className="font-display text-lg font-bold tracking-tight text-white">
          DSA<span className="text-white/70">Lab</span>
        </span>
      </button>

      <div className="hidden flex-wrap items-center gap-2 lg:flex">
        <Chip label="Role" value="Student" />
        <Chip label="Name" value={profile?.name || 'Student'} />
        <Chip label="Id" value={profile?.id || '—'} />
        <Chip label="Dept" value={profile?.dept || 'CSE'} />
      </div>

      {/* mobile: compact name */}
      <span className="ml-1 truncate text-sm font-semibold text-white lg:hidden">
        {profile?.name || 'Student'}
      </span>

      <span className="ml-auto hidden items-center gap-1.5 text-xs text-white/80 md:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
        {dateStr}
      </span>

      <button
        onClick={logout}
        className="ml-auto flex shrink-0 items-center gap-2 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/25 md:ml-3"
      >
        <Power size={14} /> <span className="hidden sm:inline">LOGOUT</span>
      </button>
    </header>
  );
}
