import { Star, Award } from 'lucide-react';

export default function RankWidget({ rank, starPct }) {
  const stars = Math.round((starPct / 100) * 5);
  return (
    <div className="card flex items-center gap-4 p-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-warn">
          {Math.max(0, 100 - starPct)}% more to your next star!
        </p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-sunken">
          <div className="h-full rounded-full bg-brand transition-all duration-700" style={{ width: `${starPct}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-ink-mute">
            Rank <span className="font-semibold text-ink">#{rank}</span>
          </span>
          <span className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={13} className={i < stars ? 'fill-warn text-warn' : 'text-ink-faint'} />
            ))}
          </span>
        </div>
      </div>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-warn/10 text-warn">
        <Award size={24} />
      </span>
    </div>
  );
}
