import { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, SkipForward, Shuffle, RotateCcw } from 'lucide-react';
import { VizButton } from './vizui.jsx';

// ---- step generators: each step = { arr, compare:[i,j], swap:bool, sorted:[idx...] } ----
function bubbleSteps(input) {
  const a = [...input];
  const steps = [];
  const sorted = [];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      steps.push({ arr: [...a], compare: [j, j + 1], swap: false, sorted: [...sorted] });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ arr: [...a], compare: [j, j + 1], swap: true, sorted: [...sorted] });
      }
    }
    sorted.unshift(n - 1 - i);
  }
  sorted.unshift(0);
  steps.push({ arr: [...a], compare: [], swap: false, sorted: [...Array(n).keys()] });
  return steps;
}

function quickSteps(input) {
  const a = [...input];
  const steps = [];
  const sorted = [];
  const qs = (lo, hi) => {
    if (lo >= hi) {
      if (lo === hi) sorted.push(lo);
      return;
    }
    const pivot = a[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      steps.push({ arr: [...a], compare: [j, hi], swap: false, sorted: [...sorted], pivot: hi });
      if (a[j] < pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        steps.push({ arr: [...a], compare: [i, j], swap: true, sorted: [...sorted], pivot: hi });
        i++;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    sorted.push(i);
    steps.push({ arr: [...a], compare: [i, hi], swap: true, sorted: [...sorted], pivot: i });
    qs(lo, i - 1);
    qs(i + 1, hi);
  };
  qs(0, a.length - 1);
  steps.push({ arr: [...a], compare: [], swap: false, sorted: [...Array(a.length).keys()] });
  return steps;
}

const randArr = () => Array.from({ length: 9 }, () => Math.floor(Math.random() * 90) + 8);

export default function SortViz() {
  const [algo, setAlgo] = useState('bubble');
  const [base, setBase] = useState(randArr);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(280);
  const timer = useRef(null);

  const steps = useMemo(
    () => (algo === 'bubble' ? bubbleSteps(base) : quickSteps(base)),
    [algo, base]
  );
  const cur = steps[Math.min(stepIdx, steps.length - 1)];
  const done = stepIdx >= steps.length - 1;
  const maxBar = Math.max(...cur.arr);

  useEffect(() => {
    if (!playing) return;
    if (done) { setPlaying(false); return; }
    timer.current = setTimeout(() => setStepIdx((s) => s + 1), speed);
    return () => clearTimeout(timer.current);
  }, [playing, stepIdx, speed, done]);

  const reset = () => { setStepIdx(0); setPlaying(false); };
  const shuffle = () => { setBase(randArr()); setStepIdx(0); setPlaying(false); };
  const switchAlgo = (a) => { setAlgo(a); setStepIdx(0); setPlaying(false); };

  const barColor = (i) => {
    if (cur.sorted?.includes(i)) return 'bg-ok';
    if (cur.pivot === i) return 'bg-warn';
    if (cur.compare?.includes(i)) return cur.swap ? 'bg-bad' : 'bg-accent';
    return 'bg-ink-faint/50';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex overflow-hidden rounded-lg border border-surface-line text-sm">
          {['bubble', 'quick'].map((a) => (
            <button
              key={a}
              onClick={() => switchAlgo(a)}
              className={`px-3 py-1.5 font-medium capitalize transition ${algo === a ? 'bg-accent text-white' : 'bg-white text-ink-mute hover:bg-surface-sunken'}`}
            >
              {a} sort
            </button>
          ))}
        </div>
        <VizButton tone="primary" onClick={() => (done ? reset() : setPlaying((p) => !p))}>
          {playing ? <Pause size={14} /> : <Play size={14} />} {done ? 'Replay' : playing ? 'Pause' : 'Play'}
        </VizButton>
        <VizButton onClick={() => setStepIdx((s) => Math.min(s + 1, steps.length - 1))} disabled={done}>
          <SkipForward size={14} /> Step
        </VizButton>
        <VizButton onClick={reset}><RotateCcw size={14} /> Reset</VizButton>
        <VizButton onClick={shuffle}><Shuffle size={14} /> Shuffle</VizButton>
        <label className="ml-1 flex items-center gap-2 text-xs text-ink-mute">
          Speed
          <input
            type="range" min="60" max="600" step="20"
            value={640 - speed}
            onChange={(e) => setSpeed(640 - Number(e.target.value))}
            className="accent-accent"
          />
        </label>
      </div>

      <div className="rounded-xl border border-surface-line bg-surface-sunken/60 p-4">
        <div className="flex h-52 items-end justify-center gap-2">
          {cur.arr.map((v, i) => (
            <div key={i} className="flex w-9 flex-col items-center gap-1">
              <div
                className={`w-full rounded-t transition-all duration-150 ${barColor(i)}`}
                style={{ height: `${(v / maxBar) * 170 + 14}px` }}
              />
              <span className="text-[11px] font-medium text-ink-mute">{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-ink-mute">
          <Legend c="bg-accent" t="comparing" />
          <Legend c="bg-bad" t="swapping" />
          {algo === 'quick' && <Legend c="bg-warn" t="pivot" />}
          <Legend c="bg-ok" t="sorted" />
          <span className="ml-2">Step {Math.min(stepIdx + 1, steps.length)} / {steps.length}</span>
        </div>
      </div>
    </div>
  );
}

function Legend({ c, t }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-sm ${c}`} /> {t}
    </span>
  );
}
