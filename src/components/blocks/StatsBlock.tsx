export default function StatsBlock({ props }: { props: Record<string, unknown> }) {
  const p = props as { items: { value: string; label: string; sublabel?: string }[]; variant: string };
  return (
    <section className="py-12 px-8 bg-gray-950 border-y border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className={`grid grid-cols-2 ${p.variant === 'grid' ? 'md:grid-cols-2' : 'md:grid-cols-4'} gap-0 divide-x divide-white/8`}>
          {(p.items ?? []).map((item, i) => (
            <div key={i} className="text-center py-6 px-4">
              <div className="text-3xl font-extrabold text-white mb-1">{item.value}</div>
              <div className="text-sm text-white/50">{item.label}</div>
              {item.sublabel && <div className="text-xs text-white/30 mt-0.5">{item.sublabel}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
