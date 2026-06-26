import { useEffect, useMemo, useState } from 'react';
import { useMutation } from 'convex/react';
import { Save, RotateCcw, Play, CornerDownLeft, Check } from 'lucide-react';
import { api } from '@convex/api';
import CodeEditor from '../editor/CodeEditor.jsx';
import ResultPanel from './ResultPanel.jsx';
import { LANGUAGES } from '../../data/experiments.js';
import { evaluate, checkKeywords, isMockMode } from '../../lib/judge0.js';
import { getProfile } from '../../lib/identity.js';

const codeKey = (exp, ch, lang) => `dsalab.code.${exp}.${ch}.${lang}`;

export default function PracticePanel({ experimentId, challenge }) {
  const langs = LANGUAGES;
  const profile = getProfile();
  const recordSolve = useMutation(api.progress.recordSolve);
  const logSubmission = useMutation(api.progress.logSubmission);
  const [lang, setLang] = useState('c');
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [saved, setSaved] = useState(false);

  const starter = challenge.starter[lang] || '';

  // load saved code (or starter) whenever challenge/lang changes
  useEffect(() => {
    const stored = localStorage.getItem(codeKey(experimentId, challenge.id, lang));
    setCode(stored ?? starter);
    setResult(null);
  }, [experimentId, challenge.id, lang]); // eslint-disable-line

  const keywordCheck = useMemo(
    () => checkKeywords(code, challenge.mandatoryKeywords || []),
    [code, challenge.mandatoryKeywords]
  );

  const save = () => {
    localStorage.setItem(codeKey(experimentId, challenge.id, lang), code);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };
  const reset = () => { setCode(starter); setResult(null); };

  const run = async (allTests) => {
    setRunning(true);
    setResult(null);
    const tests = allTests ? challenge.logicalTests : challenge.logicalTests.slice(0, 1);
    const res = await evaluate({ source: code, langKey: lang, tests });
    setResult(res);
    setRunning(false);

    // Persist to Convex on a full Evaluate run (only when really executed).
    if (allTests && res.mode === 'live' && profile?.userId) {
      const allPassed = res.passedCount === res.total;
      logSubmission({
        userId: profile.userId,
        experimentId,
        challengeId: challenge.id,
        language: lang,
        passed: allPassed,
        passedCount: res.passedCount,
        total: res.total,
      }).catch(() => {});
      if (allPassed) {
        recordSolve({
          userId: profile.userId,
          experimentId,
          challengeId: challenge.id,
          language: lang,
        }).catch(() => {});
      }
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
      {/* editor column */}
      <div className="card flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-surface-line bg-surface-sunken/60 px-3 py-2">
          <div className="flex overflow-hidden rounded-lg border border-surface-line text-xs">
            {langs.map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className={`px-2.5 py-1.5 font-medium transition ${lang === l.id ? 'bg-accent text-white' : 'bg-white text-ink-mute hover:bg-surface-sunken'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
          {isMockMode() && (
            <span className="chip border-warn/30 bg-warn/10 text-warn">mock mode</span>
          )}
        </div>

        <div className="h-[420px]">
          <CodeEditor value={code} onChange={setCode} language={lang} />
        </div>

        <div className="grid grid-cols-4 divide-x divide-surface-line border-t border-surface-line text-sm">
          <ToolBtn onClick={save} icon={saved ? Check : Save} label={saved ? 'Saved' : 'Save'} tone={saved ? 'ok' : ''} />
          <ToolBtn onClick={reset} icon={RotateCcw} label="Reset" />
          <ToolBtn onClick={() => run(false)} icon={Play} label="Run" disabled={running} />
          <ToolBtn onClick={() => run(true)} icon={CornerDownLeft} label="Evaluate" tone="accent" disabled={running} />
        </div>
      </div>

      {/* result column */}
      <ResultPanel
        result={result}
        running={running}
        keywordCheck={keywordCheck}
        complexityNote={challenge.complexityNote}
      />
    </div>
  );
}

function ToolBtn({ onClick, icon: Icon, label, tone, disabled }) {
  const tones = {
    accent: 'text-accent hover:bg-accent/5',
    ok: 'text-ok hover:bg-ok/5',
    '': 'text-ink-soft hover:bg-surface-sunken',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-1.5 py-2.5 font-medium transition disabled:opacity-40 ${tones[tone || '']}`}
    >
      <Icon size={14} /> {label}
    </button>
  );
}
