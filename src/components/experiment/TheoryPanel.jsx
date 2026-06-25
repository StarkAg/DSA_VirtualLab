import { Target, BookOpen } from 'lucide-react';
import Visualizer from '../visualizers/index.jsx';

export default function TheoryPanel({ exp }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="card p-5">
          <h3 className="flex items-center gap-2 font-display text-lg font-bold">
            <Target size={18} className="text-accent" /> Aim
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{exp.aim}</p>
        </div>
        <div className="card p-5">
          <h3 className="flex items-center gap-2 font-display text-lg font-bold">
            <BookOpen size={18} className="text-teal" /> Theory
          </h3>
          <div className="mt-3 space-y-4">
            {exp.theory.map((t, i) => (
              <div key={i}>
                <h4 className="text-sm font-semibold text-ink">{t.h}</h4>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{t.p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="mb-3 font-display text-lg font-bold">Try it live</h3>
        <Visualizer kind={exp.viz} />
      </div>
    </div>
  );
}
