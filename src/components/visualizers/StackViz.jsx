import { useState } from 'react';
import { Plus, Minus, Eye, Trash2, ArrowDown } from 'lucide-react';
import { VizButton, VizInput, VizStage } from './vizui.jsx';

export default function StackViz() {
  const [stack, setStack] = useState([3, 7, 5]);
  const [val, setVal] = useState('');
  const [peeked, setPeeked] = useState(false);
  const [msg, setMsg] = useState('Stack initialized with 3 elements.');

  const push = () => {
    if (val === '') return;
    setStack((s) => [...s, val]);
    setMsg(`push(${val}) → added to top.`);
    setVal('');
    setPeeked(false);
  };
  const pop = () => {
    if (!stack.length) return setMsg('Stack is empty — cannot pop!');
    const top = stack[stack.length - 1];
    setStack((s) => s.slice(0, -1));
    setMsg(`pop() → removed ${top} from top.`);
    setPeeked(false);
  };
  const peek = () => {
    if (!stack.length) return setMsg('Stack is empty — nothing to peek.');
    setPeeked(true);
    setMsg(`peek() → top element is ${stack[stack.length - 1]}.`);
  };
  const clear = () => { setStack([]); setMsg('Stack cleared.'); setPeeked(false); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <VizInput value={val} onChange={setVal} placeholder="value" onEnter={push} />
        <VizButton tone="primary" onClick={push}><Plus size={14} /> Push</VizButton>
        <VizButton tone="danger" onClick={pop}><Minus size={14} /> Pop</VizButton>
        <VizButton tone="teal" onClick={peek}><Eye size={14} /> Peek</VizButton>
        <VizButton onClick={clear}><Trash2 size={14} /> Clear</VizButton>
      </div>

      <VizStage hint={msg}>
        <div className="flex flex-col items-center">
          {stack.length > 0 && (
            <div className="mb-1 flex items-center gap-1 text-[11px] font-medium text-accent">
              <ArrowDown size={12} /> TOP
            </div>
          )}
          <div className="flex w-44 flex-col-reverse gap-1.5">
            {stack.length === 0 && (
              <div className="grid h-12 place-items-center rounded-lg border-2 border-dashed border-surface-line text-xs text-ink-faint">
                empty stack
              </div>
            )}
            {stack.map((item, i) => {
              const isTop = i === stack.length - 1;
              return (
                <div
                  key={i}
                  className={`grid h-12 animate-pop-in place-items-center rounded-lg border text-sm font-semibold transition ${
                    isTop && peeked
                      ? 'border-teal bg-teal/15 text-teal ring-2 ring-teal/30'
                      : isTop
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-surface-line bg-white text-ink-soft'
                  }`}
                >
                  {item}
                  <span className="absolute right-[-2.6rem] hidden text-[10px] text-ink-faint sm:inline">[{i}]</span>
                </div>
              );
            })}
          </div>
          <div className="mt-1 h-1 w-44 rounded-full bg-ink-soft/30" />
          <span className="mt-1 text-[11px] text-ink-faint">base</span>
        </div>
      </VizStage>
    </div>
  );
}
