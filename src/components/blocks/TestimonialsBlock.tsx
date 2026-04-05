import { Star } from 'lucide-react';

export default function TestimonialsBlock({ props }: { props: Record<string, unknown> }) {
  const p = props as { badge: string; title: string; items: { name: string; role: string; company: string; avatar: string; text: string }[] };
  return (
    <section className="py-20 px-8 bg-gray-950">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          {p.badge && <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">{p.badge}</span>}
          <h2 className="text-4xl font-bold text-white">{p.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(p.items ?? []).map((item, i) => (
            <div key={i} className="bg-white/3 rounded-2xl p-6 border border-white/8">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-4">&ldquo;{item.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {item.avatar || item.name.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="text-xs text-white/40">{item.role}, {item.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
