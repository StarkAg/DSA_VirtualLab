import { CheckCircle2, XCircle, Clock, AlertTriangle, Gauge, ListChecks } from 'lucide-react';

function MiniHeader({ title, icon: Icon }) {
  return (
    <div className="section-bar !rounded-lg !py-2">
      <Icon size={14} className="relative z-10" />
      <h3 className="relative z-10">{title}</h3>
    </div>
  );
}

export default function ResultPanel({ result, keywordCheck, complexityNote, running }) {
  return (
    <div className="space-y-3">
      {/* Complexity analysis */}
      <div>
        <MiniHeader title="Complexity Analysis" icon={Gauge} />
        <div className="card mt-2 p-3 text-xs text-ink-soft">
          {complexityNote || 'Analyse the time and space complexity of your approach.'}
          {keywordCheck?.length > 0 && (
            <div className="mt-3 border-t border-surface-line pt-2">
              <p className="mb-1 font-medium text-ink-mute">Mandatory keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {keywordCheck.map((k) => (
                  <span
                    key={k.keyword}
                    className={`chip ${k.present ? 'border-ok/30 bg-ok/10 text-ok' : 'border-bad/30 bg-bad/10 text-bad'}`}
                  >
                    {k.present ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    <code>{k.keyword}</code>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Test case status */}
      <div>
        <MiniHeader title="Test Case Status" icon={ListChecks} />
        <div className="card mt-2 overflow-hidden">
          {running && (
            <div className="flex items-center gap-2 p-4 text-sm text-ink-mute">
              <Clock size={16} className="animate-spin" /> Evaluating your submission…
            </div>
          )}

          {!running && !result && (
            <div className="flex flex-col items-center gap-2 p-6 text-center">
              <Clock size={26} className="text-ink-faint" />
              <p className="text-sm font-medium text-ink-soft">Waiting for your Submission!</p>
              <p className="text-xs text-ink-faint">Your code will be evaluated against the test cases.</p>
            </div>
          )}

          {!running && result && (
            <div>
              {result.mode === 'mock' && (
                <div className="flex items-start gap-2 border-b border-warn/20 bg-warn/10 p-3 text-xs text-warn">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  <span>
                    <b>Mock mode</b> — code is not executed (<code>VITE_EXEC_MODE=mock</code>).
                    Expected outputs are shown below for reference.
                  </span>
                </div>
              )}
              {result.mode === 'live' && (
                <div className={`p-3 text-sm font-semibold ${result.passedCount === result.total ? 'text-ok' : 'text-ink-soft'}`}>
                  {result.passedCount} / {result.total} test cases passed
                </div>
              )}
              <ul className="divide-y divide-surface-line">
                {result.results.map((r) => (
                  <li key={r.index} className="p-3">
                    <div className="flex items-center gap-2 text-sm">
                      {r.passed === true && <CheckCircle2 size={15} className="text-ok" />}
                      {r.passed === false && <XCircle size={15} className="text-bad" />}
                      {r.passed === null && <Clock size={15} className="text-warn" />}
                      <span className="font-medium">Test Case {r.index + 1}</span>
                      <span className="ml-auto text-xs text-ink-faint">{r.status}</span>
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      <IO label="Input" value={r.stdin} />
                      <IO label="Expected" value={r.expected} tone="ok" />
                      {r.passed !== null && <IO label="Your Output" value={r.actual || '—'} tone={r.passed ? 'ok' : 'bad'} />}
                    </div>
                    {r.error && (
                      <pre className="mt-2 max-h-28 overflow-auto rounded-md bg-bad/5 p-2 text-[11px] text-bad">{r.error.trim()}</pre>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IO({ label, value, tone }) {
  const ring = tone === 'ok' ? 'border-ok/30' : tone === 'bad' ? 'border-bad/30' : 'border-surface-line';
  return (
    <div>
      <p className="stat-label mb-1">{label}</p>
      <pre className={`max-h-24 overflow-auto rounded-md border ${ring} bg-surface-sunken px-2 py-1.5 font-mono text-[11px] text-ink-soft`}>
        {String(value ?? '').trim() || '—'}
      </pre>
    </div>
  );
}
