// Shared code-execution core used by both the Vercel function (api/execute.js)
// and the Vite dev middleware. Files in /api prefixed with "_" are NOT exposed
// as endpoints by Vercel — they're helpers.
//
// Backend selection (server-side env vars):
//   - JUDGE0_URL set  → use your self-hosted Judge0 (privileged VM)
//   - otherwise       → use the free public Wandbox compiler API (no key, no server)

const JUDGE0_URL = process.env.JUDGE0_URL || '';
const JUDGE0_TOKEN = process.env.JUDGE0_TOKEN || '';
const WANDBOX = process.env.WANDBOX_URL || 'https://wandbox.org';

// Default Wandbox compilers (override per language via WANDBOX_C, WANDBOX_CPP, …).
const WANDBOX_COMPILER = {
  c: process.env.WANDBOX_C || 'gcc-13.2.0-c',
  cpp: process.env.WANDBOX_CPP || 'gcc-13.2.0',
  java: process.env.WANDBOX_JAVA || 'openjdk-jdk-22+36',
  python: process.env.WANDBOX_PYTHON || 'cpython-3.14.0',
};
const JUDGE0_ID = { c: 50, cpp: 54, java: 62, python: 71 };

// ---------- Wandbox (free public compiler API) ----------
async function viaWandbox({ language, source, stdin }) {
  const compiler = WANDBOX_COMPILER[language] || WANDBOX_COMPILER.python;
  // Wandbox compiles a single file (prog.java); a public class breaks that, so
  // drop the `public` modifier for Java.
  const code = language === 'java' ? (source || '').replace(/public\s+class\s+/, 'class ') : source || '';

  const res = await fetch(`${WANDBOX}/api/compile.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ compiler, code, stdin: stdin || '' }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Wandbox ${res.status}: ${t.slice(0, 160)}`);
  }
  const d = await res.json();
  const compileError = d.compiler_error || '';
  const ok = String(d.status) === '0' && !compileError;
  return {
    stdout: d.program_output || '',
    stderr: d.program_error || '',
    compileError,
    status: compileError
      ? 'Compilation Error'
      : ok
      ? 'Accepted'
      : d.signal
      ? `Runtime Error (${d.signal})`
      : 'Runtime Error',
    ok,
  };
}

// ---------- Self-hosted Judge0 ----------
async function viaJudge0({ language, source, stdin }) {
  const b64 = (s) => Buffer.from(s || '', 'utf8').toString('base64');
  const dec = (s) => Buffer.from(s || '', 'base64').toString('utf8');
  const headers = { 'Content-Type': 'application/json' };
  if (JUDGE0_TOKEN) headers['X-Auth-Token'] = JUDGE0_TOKEN;
  const res = await fetch(
    `${JUDGE0_URL.replace(/\/$/, '')}/submissions?base64_encoded=true&wait=true&fields=*`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        language_id: JUDGE0_ID[language] ?? 71,
        source_code: b64(source),
        stdin: b64(stdin),
      }),
    }
  );
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Judge0 ${res.status}: ${t.slice(0, 160)}`);
  }
  const d = await res.json();
  const compileError = dec(d.compile_output);
  return {
    stdout: dec(d.stdout),
    stderr: dec(d.stderr),
    compileError,
    status: d.status?.description || 'Unknown',
    ok: d.status?.id === 3,
  };
}

export async function runExecution(input) {
  return JUDGE0_URL ? viaJudge0(input) : viaWandbox(input);
}
