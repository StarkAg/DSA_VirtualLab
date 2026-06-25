// eLab-style slate→teal gradient header bar that sits on top of cards.
export default function SectionHeader({ title, right }) {
  return (
    <div className="section-bar">
      <div className="flex items-center gap-2 relative z-10">
        <span className="h-2 w-2 rounded-full bg-white/80" />
        <h2>{title}</h2>
      </div>
      <div className="ml-auto flex items-center gap-2 relative z-10">
        {right}
        <span className="hidden sm:flex items-center gap-1.5 ml-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
      </div>
    </div>
  );
}
