import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CornerDownLeft, Award, Info, Layers, AlignHorizontalJustifyStart, Link2, BarChart3, Search, Box } from 'lucide-react';
import { experimentCompletion } from '../../lib/stats.js';
import Certificate from '../Certificate.jsx';

const ICONS = { Layers, AlignHorizontalJustifyStart, Link2, BarChart3, Search };

export default function ExperimentCard({ exp, progress }) {
  const navigate = useNavigate();
  const [certOpen, setCertOpen] = useState(false);
  const { pct, solvedCount, quizBest } = experimentCompletion(exp, progress);
  const Icon = ICONS[exp.icon] || Box;
  const total = exp.challenges.length;

  return (
    <>
      {/* outer div instead of button so we can nest a button inside */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate(`/experiment/${exp.id}`)}
        onKeyDown={(e) => e.key === 'Enter' && navigate(`/experiment/${exp.id}`)}
        className="card group flex flex-col overflow-hidden text-left transition hover:-translate-y-0.5 hover:shadow-pop cursor-pointer select-none"
      >
        {/* gradient header */}
        <div className="section-bar !rounded-b-none">
          <Icon size={16} className="relative z-10" />
          <h3 className="relative z-10">{exp.title}</h3>
          <Info size={14} className="relative z-10 ml-auto opacity-70" />
        </div>

        {/* illustration band */}
        <div
          className="relative flex h-28 items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${exp.accent}14, ${exp.accent}04)` }}
        >
          <span
            className="grid h-16 w-16 place-items-center rounded-2xl text-white shadow-pop transition group-hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${exp.accent}, ${exp.accent}cc)` }}
          >
            <Icon size={30} />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="text-xs text-ink-mute">{exp.short}</p>

          <div className="mt-3 space-y-2">
            <Bar label="Challenges" value={pct} accent={exp.accent} />
            <Bar label="Quiz" value={quizBest} accent="#16a34a" />
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-mute">
            {pct === 100 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setCertOpen(true); }}
                className="inline-flex items-center gap-1 font-semibold text-warn hover:text-amber-500 transition-colors cursor-pointer"
              >
                <Award size={12} /> Certificate ready
              </button>
            )}
            <span className="ml-auto">{solvedCount}/{total} solved</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 border-t border-surface-line py-2.5 text-sm font-medium text-accent transition group-hover:bg-accent/5">
          <CornerDownLeft size={14} /> Continue Practice
        </div>
      </div>

      {certOpen && <Certificate exp={exp} onClose={() => setCertOpen(false)} />}
    </>
  );
}

function Bar({ label, value, accent }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 text-[11px] text-ink-faint">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-sunken">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: accent }} />
      </div>
      <span className="w-8 shrink-0 text-right text-[11px] font-medium text-ink-mute">{value}%</span>
    </div>
  );
}
