import { FlaskConical, KeySquare, Gauge } from 'lucide-react';

function Group({ title, icon: Icon, children }) {
  return (
    <div>
      <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink-soft">
        <Icon size={14} className="text-accent" /> {title}
      </h4>
      {children}
    </div>
  );
}

export default function TestCasePanel({ challenge }) {
  return (
    <div className="card space-y-5 p-4">
      <Group title="Logical Test Cases" icon={FlaskConical}>
        <div className="grid gap-3 sm:grid-cols-2">
          {challenge.logicalTests.map((t, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-surface-line">
              <div className="section-bar !rounded-none !py-1.5"><h3 className="relative z-10">Test Case {i + 1}</h3></div>
              <div className="space-y-2 p-3">
                <div>
                  <p className="stat-label">Input (stdin)</p>
                  <pre className="mt-1 overflow-auto rounded bg-surface-sunken px-2 py-1.5 font-mono text-[12px] text-ink-soft">{t.stdin}</pre>
                </div>
                <div>
                  <p className="stat-label">Expected Output</p>
                  <pre className="mt-1 overflow-auto rounded bg-surface-sunken px-2 py-1.5 font-mono text-[12px] text-ok">{t.expected}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Group>

      {challenge.mandatoryKeywords?.length > 0 && (
        <Group title="Mandatory Test Cases" icon={KeySquare}>
          <div className="flex flex-wrap gap-2">
            {challenge.mandatoryKeywords.map((kw) => (
              <span key={kw} className="rounded-lg border border-surface-line bg-surface-sunken px-3 py-1.5 font-mono text-xs text-ink-soft">{kw}</span>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-faint">Your solution must include these keywords.</p>
        </Group>
      )}

      <Group title="Complexity Test Cases" icon={Gauge}>
        <p className="text-sm text-ink-soft">{challenge.complexityNote}</p>
      </Group>
    </div>
  );
}
