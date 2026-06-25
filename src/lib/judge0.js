// Code-execution client. Talks to the same-origin /api/execute proxy, which
// runs submissions on the free Piston engine (or self-hosted Judge0 if the
// server has JUDGE0_URL set). Set VITE_EXEC_MODE=mock to disable execution.

export function execMode() {
  return import.meta.env.VITE_EXEC_MODE === 'mock' ? 'mock' : 'live';
}
export const isMockMode = () => execMode() === 'mock';

const norm = (s) =>
  (s ?? '').replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').replace(/\n+$/g, '').trim();

export function checkKeywords(source, keywords = []) {
  return keywords.map((kw) => ({ keyword: kw, present: (source || '').includes(kw) }));
}

async function submitOne({ source, langKey, stdin }) {
  const res = await fetch('/api/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language: langKey, source, stdin }),
  });
  if (!res.ok) {
    let msg = `Execution error ${res.status}`;
    try {
      const j = await res.json();
      if (j.error) msg = j.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return res.json(); // { stdout, stderr, compileError, status, ok }
}

// Evaluate source against [{stdin, expected}]. Returns a result summary.
export async function evaluate({ source, langKey, tests }) {
  if (isMockMode()) {
    return {
      mode: 'mock',
      results: tests.map((t, i) => ({
        index: i, stdin: t.stdin, expected: t.expected,
        actual: '(not executed — mock mode)', passed: null, status: 'Simulated', error: '',
      })),
      passedCount: 0, total: tests.length,
    };
  }

  const results = [];
  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    try {
      const r = await submitOne({ source, langKey, stdin: t.stdin });
      const err = r.compileError || r.stderr || '';
      const passed = r.ok && norm(r.stdout) === norm(t.expected);
      results.push({
        index: i, stdin: t.stdin, expected: t.expected, actual: r.stdout || '',
        passed, status: r.status, error: passed ? '' : err,
      });
    } catch (e) {
      results.push({
        index: i, stdin: t.stdin, expected: t.expected, actual: '',
        passed: false, status: 'Error', error: e.message,
      });
    }
  }
  return { mode: 'live', results, passedCount: results.filter((r) => r.passed).length, total: tests.length };
}
