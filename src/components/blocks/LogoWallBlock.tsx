export default function LogoWallBlock({ props }: { props: Record<string, unknown> }) {
  const p = props as { title: string; items: string[] };
  const doubled = [...(p.items ?? []), ...(p.items ?? [])];
  return (
    <section className="py-12 px-8 bg-gray-950 border-y border-white/5">
      <div className="max-w-5xl mx-auto">
        {p.title && <p className="text-center text-sm text-white/30 mb-8">{p.title}</p>}
        <div className="relative overflow-hidden">
          <div className="flex gap-6 w-max" style={{ animation: 'marquee 25s linear infinite' }}>
            {doubled.map((item, i) => (
              <span key={i} className="px-5 py-2 rounded-full bg-white/5 border border-white/8 text-sm text-white/50 font-medium whitespace-nowrap">
                {item}
              </span>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-950 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-950 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
