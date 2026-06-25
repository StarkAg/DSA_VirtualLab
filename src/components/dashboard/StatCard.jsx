export default function StatCard({ label, value, icon: Icon, sub }) {
  return (
    <div className="card flex items-center justify-between p-4">
      <div className="min-w-0">
        <p className="stat-label">{label}</p>
        <p className="mt-1 truncate font-display text-2xl font-bold text-ink">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-ink-mute">{sub}</p>}
      </div>
      {Icon && (
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-sunken text-ink-mute">
          <Icon size={20} />
        </span>
      )}
    </div>
  );
}
