import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Trophy, FileText, HelpCircle, Settings } from 'lucide-react';

const ITEMS = [
  { icon: Home, label: 'Dashboard', to: '/dashboard' },
  { icon: BookOpen, label: 'Experiments', to: '/dashboard' },
  { icon: Trophy, label: 'Progress', to: '/dashboard' },
  { icon: FileText, label: 'Manual', to: '/dashboard' },
  { icon: HelpCircle, label: 'Help', to: '/dashboard' },
  { icon: Settings, label: 'Settings', to: '/dashboard' },
];

export default function SideBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <aside className="sticky top-[53px] z-20 hidden h-[calc(100vh-53px)] w-14 shrink-0 flex-col items-center gap-1 border-r border-surface-line bg-surface py-3 sm:flex">
      {ITEMS.map(({ icon: Icon, label, to }, i) => {
        const active = i === 0 && pathname.startsWith('/dashboard');
        return (
          <button
            key={label + i}
            title={label}
            onClick={() => navigate(to)}
            className={`group relative grid h-10 w-10 place-items-center rounded-lg transition ${
              active ? 'bg-accent/10 text-accent' : 'text-ink-faint hover:bg-surface-sunken hover:text-ink-soft'
            }`}
          >
            <Icon size={18} />
            {active && <span className="absolute -left-3 h-5 w-1 rounded-r bg-accent" />}
          </button>
        );
      })}
    </aside>
  );
}
