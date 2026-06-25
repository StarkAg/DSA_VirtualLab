import { useState } from 'react';
import { Plus, Trash2, ArrowRight, CornerDownRight } from 'lucide-react';
import { VizButton, VizInput, VizStage } from './vizui.jsx';

let uid = 100;

export default function LinkedListViz() {
  const [nodes, setNodes] = useState([
    { id: 1, v: 5 }, { id: 2, v: 10 }, { id: 3, v: 15 },
  ]);
  const [val, setVal] = useState('');
  const [msg, setMsg] = useState('List head → 5 → 10 → 15 → NULL');

  const insertHead = () => {
    if (val === '') return;
    setNodes((n) => [{ id: ++uid, v: val }, ...n]);
    setMsg(`Inserted ${val} at head (O(1)).`);
    setVal('');
  };
  const insertTail = () => {
    if (val === '') return;
    setNodes((n) => [...n, { id: ++uid, v: val }]);
    setMsg(`Inserted ${val} at tail (O(n)).`);
    setVal('');
  };
  const deleteVal = () => {
    if (val === '') return;
    const idx = nodes.findIndex((n) => String(n.v) === String(val));
    if (idx === -1) return setMsg(`${val} not found in the list.`);
    setNodes((n) => n.filter((_, i) => i !== idx));
    setMsg(`Deleted first node with value ${val}.`);
    setVal('');
  };
  const clear = () => { setNodes([]); setMsg('List is empty (head → NULL).'); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <VizInput value={val} onChange={setVal} placeholder="value" onEnter={insertTail} />
        <VizButton tone="primary" onClick={insertHead}><CornerDownRight size={14} /> Head</VizButton>
        <VizButton tone="teal" onClick={insertTail}><Plus size={14} /> Tail</VizButton>
        <VizButton tone="danger" onClick={deleteVal}><Trash2 size={14} /> Delete</VizButton>
        <VizButton onClick={clear}>Clear</VizButton>
      </div>

      <VizStage hint={msg}>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-md bg-ink/5 px-2 py-1 text-[11px] font-medium text-ink-mute">head</span>
          <ArrowRight size={14} className="text-ink-faint" />
          {nodes.map((node, i) => (
            <div key={node.id} className="flex items-center gap-1.5">
              <div className="flex animate-pop-in overflow-hidden rounded-lg border border-surface-line bg-white shadow-sm">
                <span className="grid h-12 w-12 place-items-center text-sm font-semibold text-accent">{node.v}</span>
                <span className="grid h-12 w-7 place-items-center border-l border-surface-line bg-surface-sunken text-[10px] text-ink-faint">•</span>
              </div>
              <ArrowRight size={14} className="text-ink-faint" />
            </div>
          ))}
          <span className="rounded-md border border-surface-line px-2 py-1 text-[11px] font-medium text-ink-faint">NULL</span>
        </div>
      </VizStage>
    </div>
  );
}
