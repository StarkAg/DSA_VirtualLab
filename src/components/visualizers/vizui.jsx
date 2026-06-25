// Shared UI bits for visualizers to keep a consistent academic look.
export function VizButton({ children, onClick, disabled, tone = 'default' }) {
  const tones = {
    default: 'bg-surface text-ink-soft border-surface-line hover:bg-surface-sunken',
    primary: 'bg-accent text-white border-accent hover:bg-accent-dark',
    danger: 'bg-bad/10 text-bad border-bad/30 hover:bg-bad/20',
    teal: 'bg-teal/10 text-teal border-teal/30 hover:bg-teal/20',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

export function VizInput({ value, onChange, placeholder, onEnter, className = '' }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
      placeholder={placeholder}
      className={`w-24 rounded-lg border border-surface-line bg-white px-3 py-1.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 ${className}`}
    />
  );
}

export function VizStage({ children, hint }) {
  return (
    <div className="rounded-xl border border-surface-line bg-surface-sunken/60 p-4">
      <div className="flex min-h-[200px] items-center justify-center overflow-x-auto">{children}</div>
      {hint && <p className="mt-3 text-center text-xs text-ink-mute">{hint}</p>}
    </div>
  );
}
