import { Star } from 'lucide-react';
import { getBgClass, getPaddingClass, getWidthClass, getTextColors } from '@/lib/blockStyles';

export default function TestimonialsBlock({ props }: { props: Record<string, unknown> }) {
  const p = props as {
    badge: string; title: string;
    items: { name: string; role: string; company: string; avatar: string; text: string }[];
    bg?: string; paddingY?: string; contentWidth?: string;
  };

  const bgClass = getBgClass(p.bg);
  const paddingClass = getPaddingClass(p.paddingY);
  const widthClass = getWidthClass(p.contentWidth);
  const tc = getTextColors(p.bg);
  const isLight = tc.h === 'text-gray-900';

  return (
    <section className={`${bgClass} ${paddingClass} px-8`}>
      <div className={widthClass}>
        <div className="text-center mb-14">
          {p.badge && (
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
              {p.badge}
            </span>
          )}
          <h2 className={`text-4xl font-bold ${tc.h}`}>{p.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(p.items ?? []).map((item, i) => (
            <div key={i} className={`rounded-2xl p-6 border ${tc.border} ${isLight ? 'bg-white shadow-sm' : 'bg-white/3'}`}>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className={`${tc.body} text-sm leading-relaxed mb-4`}>&ldquo;{item.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {item.avatar || item.name?.slice(0, 2)}
                </div>
                <div>
                  <p className={`text-sm font-medium ${tc.h}`}>{item.name}</p>
                  <p className={`text-xs ${tc.faint}`}>{item.role}, {item.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
