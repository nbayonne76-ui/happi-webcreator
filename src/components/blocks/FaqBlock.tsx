'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqBlock({ props }: { props: Record<string, unknown> }) {
  const p = props as { badge: string; title: string; items: { question: string; answer: string }[] };
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-20 px-8 bg-gray-950">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          {p.badge && <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-medium mb-4">{p.badge}</span>}
          <h2 className="text-4xl font-bold text-white">{p.title}</h2>
        </div>
        <div className="space-y-3">
          {(p.items ?? []).map((item, i) => (
            <div key={i} className="bg-white/3 rounded-xl overflow-hidden border border-white/5">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                <span className="font-medium text-white/90">{item.question}</span>
                <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-white/50 border-t border-white/5 pt-3 leading-relaxed">{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
