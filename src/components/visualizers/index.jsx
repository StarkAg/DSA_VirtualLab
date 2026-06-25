import StackViz from './StackViz.jsx';
import QueueViz from './QueueViz.jsx';
import LinkedListViz from './LinkedListViz.jsx';
import SortViz from './SortViz.jsx';
import SearchViz from './SearchViz.jsx';

const MAP = {
  stack: StackViz,
  queue: QueueViz,
  linkedlist: LinkedListViz,
  sorting: SortViz,
  searching: SearchViz,
};

export default function Visualizer({ kind }) {
  const Comp = MAP[kind];
  if (!Comp) return <p className="text-sm text-ink-mute">No visualization available.</p>;
  return <Comp />;
}
