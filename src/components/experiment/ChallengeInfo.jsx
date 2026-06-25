import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

function Row({ label, children }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 border-b border-surface-line py-3 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</span>
      <div className="min-w-0 text-sm text-ink-soft">{children}</div>
    </div>
  );
}

export default function ChallengeInfo({ exp, challenge }) {
  return (
    <div className="card overflow-hidden">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-surface-line bg-surface-sunken/60 p-4 text-sm sm:grid-cols-4">
        <Meta k="Course" v="DSA" />
        <Meta k="Session" v={exp.title} />
        <Meta k="Question" v={challenge.title} />
        <Meta k="Level" v={<><span className="text-accent">●</span> Level {challenge.level}</>} />
      </div>

      <div className="p-4">
        <Row label="Problem">
          <p className="leading-relaxed">{challenge.description}</p>
        </Row>
        <Row label="Constraints">
          <ul className="list-inside list-disc space-y-0.5 font-mono text-[13px]">
            {challenge.constraints.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </Row>
        <Row label="Input">
          <span className="inline-flex items-start gap-1.5"><ArrowDownToLine size={14} className="mt-0.5 text-teal" /> {challenge.ioFormat.input}</span>
        </Row>
        <Row label="Output">
          <span className="inline-flex items-start gap-1.5"><ArrowUpFromLine size={14} className="mt-0.5 text-accent" /> {challenge.ioFormat.output}</span>
        </Row>
      </div>
    </div>
  );
}

function Meta({ k, v }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">{k}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-ink">{v}</p>
    </div>
  );
}
