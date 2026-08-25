'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getBgClass, getPaddingClass, getWidthClass, getTextColors } from '@/lib/blockStyles';

export default function FaqBlock({ props }: { props: Record<string, unknown> }) {
  const p = props as {
    badge: string; title: string; items: { question: string; answer: string }[];
    bg?: string; paddingY?: string; contentWidth?: string;
  };
  const [open, setOpen] = useState<number | null>(0);

  const bgClass      = getBgClass(p.bg);
  const paddingClass = getPaddingClass(p.paddingY);
  const widthClass   = getWidthClass(p.contentWidth ?? 'narrow');
  const tc           = getTextColors(p.bg);
  const isLight      = tc.h === 'text-gray-900';

  return (
    <section className={`${bgClass} ${paddingClass} px-8`}>
      <div className={widthClass}>
        <div className="text-center mb-12">
          {p.badge && (
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
              style={{ background: `color-mix(in srgb, var(--accent, #2563EB) 12%, transparent)`, border: `1px solid color-mix(in srgb, var(--accent, #2563EB) 25%, transparent)`, color: `var(--accent, #60A5FA)` }}>
              {p.badge}
            </span>
          )}
          <h2 className={`text-4xl font-bold ${tc.h}`}>{p.title}</h2>
        </div>
        <div className="space-y-3">
          {(p.items ?? []).map((item, i) => (
            <div key={i} className={`rounded-xl overflow-hidden border ${tc.border} ${isLight ? 'bg-white' : 'bg-white/3'}`}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className={`w-full flex items-center justify-between px-5 py-4 text-left ${tc.h}`}
              >
                <span className="font-medium">{item.question}</span>
                <ChevronDown className={`w-5 h-5 ${tc.muted} transition-transform shrink-0 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className={`px-5 pb-4 text-sm ${tc.body} border-t ${tc.border} pt-3 leading-relaxed`}>
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
