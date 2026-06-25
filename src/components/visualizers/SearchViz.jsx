import { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Search } from 'lucide-react';
import { VizButton, VizInput } from './vizui.jsx';

function linearSteps(arr, target) {
  const steps = [];
  for (let i = 0; i < arr.length; i++) {
    const found = arr[i] === target;
    steps.push({ active: [i], lo: null, hi: null, mid: null, found: found ? i : null, done: found });
    if (found) return steps;
  }
  steps.push({ active: [], found: null, done: true });
  return steps;
}

function binarySteps(arr, target) {
  const steps = [];
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const found = arr[mid] === target;
    steps.push({ lo, hi, mid, active: [mid], found: found ? mid : null, done: found });
    if (found) return steps;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  steps.push({ lo: -1, hi: -1, mid: null, active: [], found: null, done: true });
  return steps;
}

const sortedArr = () => {
  const s = new Set();
  while (s.size < 9) s.add(Math.floor(Math.random() * 40) + 1);
  return [...s].sort((a, b) => a - b);
};

export default function SearchViz() {
  const [algo, setAlgo] = useState('binary');
  const [arr, setArr] = useState(sortedArr);
  const [target, setTarget] = useState(() => 0);
  const [tInput, setTInput] = useState('');
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);

  const steps = useMemo(() => {
    if (target === 0) return [{ active: [], found: null, done: false, idle: true }];
    return algo === 'linear' ? linearSteps(arr, target) : binarySteps(arr, target);
  }, [algo, arr, target]);

  const cur = steps[Math.min(stepIdx, steps.length - 1)];
  const done = cur.done || cur.idle;

  useEffect(() => {
    if (!playing) return;
    if (stepIdx >= steps.length - 1) { setPlaying(false); return; }
    timer.current = setTimeout(() => setStepIdx((s) => s + 1), 600);
    return () => clearTimeout(timer.current);
  }, [playing, stepIdx, steps.length]);

  const start = () => {
    const t = parseInt(tInput, 10);
    if (Number.isNaN(t)) return;
    setTarget(t);
    setStepIdx(0);
    setPlaying(true);
  };
  const reset = () => { setStepIdx(0); setPlaying(false); };
  const shuffle = () => { setArr(sortedArr()); setTarget(0); setStepIdx(0); setPlaying(false); };

  const cellColor = (i) => {
    if (cur.found === i) return 'border-ok bg-ok text-white';
    if (cur.mid === i) return 'border-accent bg-accent text-white';
    if (cur.active?.includes(i)) return 'border-accent bg-accent/15 text-accent';
    if (algo === 'binary' && cur.lo != null && (i < cur.lo || i > cur.hi)) return 'border-surface-line bg-surface-sunken text-ink-faint opacity-40';
    return 'border-surface-line bg-white text-ink-soft';
  };

  const status = cur.idle
    ? 'Enter a target value and press Search.'
    : cur.found != null
    ? `Found ${target} at index ${cur.found} (1-based: ${cur.found + 1}).`
    : cur.done
    ? `${target} is not present in the array.`
    : algo === 'binary'
    ? `lo=${cur.lo}, hi=${cur.hi}, mid=${cur.mid} → comparing ${arr[cur.mid]} with ${target}.`
    : `Checking index ${cur.active[0]} → ${arr[cur.active[0]]} vs ${target}.`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex overflow-hidden rounded-lg border border-surface-line text-sm">
          {['linear', 'binary'].map((a) => (
            <button
              key={a}
              onClick={() => { setAlgo(a); setStepIdx(0); setPlaying(false); }}
              className={`px-3 py-1.5 font-medium capitalize transition ${algo === a ? 'bg-accent text-white' : 'bg-white text-ink-mute hover:bg-surface-sunken'}`}
            >
              {a}
            </button>
          ))}
        </div>
        <VizInput value={tInput} onChange={setTInput} placeholder="target" onEnter={start} />
        <VizButton tone="primary" onClick={start}><Search size={14} /> Search</VizButton>
        <VizButton onClick={() => setStepIdx((s) => Math.min(s + 1, steps.length - 1))} disabled={done}>
          <SkipForward size={14} /> Step
        </VizButton>
        <VizButton onClick={() => setPlaying((p) => !p)} disabled={target === 0}>
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </VizButton>
        <VizButton onClick={reset}><RotateCcw size={14} /> Reset</VizButton>
        <VizButton onClick={shuffle}>Shuffle</VizButton>
      </div>

      <div className="rounded-xl border border-surface-line bg-surface-sunken/60 p-4">
        <div className="flex flex-wrap items-end justify-center gap-1.5">
          {arr.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`grid h-12 w-12 place-items-center rounded-lg border text-sm font-semibold transition-all duration-300 ${cellColor(i)}`}>
                {v}
              </div>
              <span className="text-[10px] text-ink-faint">{i}</span>
            </div>
          ))}
        </div>
        {algo === 'binary' && (
          <p className="mt-2 text-center text-[11px] text-ink-faint">Binary search needs a sorted array (shown ascending).</p>
        )}
        <p className="mt-2 text-center text-xs text-ink-mute">{status}</p>
      </div>
    </div>
  );
}
