import { useState } from 'react';
import { Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { VizButton, VizInput, VizStage } from './vizui.jsx';

export default function QueueViz() {
  const [queue, setQueue] = useState([4, 8, 2]);
  const [val, setVal] = useState('');
  const [flash, setFlash] = useState(null); // {type:'front'|'rear', i}
  const [msg, setMsg] = useState('Queue initialized with 3 elements.');

  const enqueue = () => {
    if (val === '') return;
    setQueue((q) => [...q, val]);
    setFlash({ type: 'rear' });
    setMsg(`enqueue(${val}) → added at rear.`);
    setVal('');
  };
  const dequeue = () => {
    if (!queue.length) return setMsg('Queue is empty — cannot dequeue!');
    const front = queue[0];
    setQueue((q) => q.slice(1));
    setFlash({ type: 'front' });
    setMsg(`dequeue() → removed ${front} from front.`);
  };
  const clear = () => { setQueue([]); setMsg('Queue cleared.'); setFlash(null); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <VizInput value={val} onChange={setVal} placeholder="value" onEnter={enqueue} />
        <VizButton tone="primary" onClick={enqueue}><Plus size={14} /> Enqueue</VizButton>
        <VizButton tone="danger" onClick={dequeue}><Minus size={14} /> Dequeue</VizButton>
        <VizButton onClick={clear}><Trash2 size={14} /> Clear</VizButton>
      </div>

      <VizStage hint={msg}>
        <div className="flex flex-col items-center">
          <div className="mb-2 flex w-full max-w-md justify-between px-1 text-[11px] font-medium">
            <span className="text-ok">FRONT</span>
            <span className="text-warn">REAR</span>
          </div>
          <div className="flex items-center gap-1.5">
            {queue.length === 0 && (
              <div className="grid h-12 w-40 place-items-center rounded-lg border-2 border-dashed border-surface-line text-xs text-ink-faint">
                empty queue
              </div>
            )}
            {queue.map((item, i) => {
              const isFront = i === 0;
              const isRear = i === queue.length - 1;
              return (
                <div key={i} className="flex items-center gap-1.5">
                  <div
                    className={`grid h-12 w-12 animate-pop-in place-items-center rounded-lg border text-sm font-semibold ${
                      isFront ? 'border-ok bg-ok/10 text-ok' : isRear ? 'border-warn bg-warn/10 text-warn' : 'border-surface-line bg-white text-ink-soft'
                    }`}
                  >
                    {item}
                  </div>
                  {i < queue.length - 1 && <ArrowRight size={14} className="text-ink-faint" />}
                </div>
              );
            })}
          </div>
        </div>
      </VizStage>
    </div>
  );
}
