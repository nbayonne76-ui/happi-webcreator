import { Check } from 'lucide-react';
import { getBgClass, getPaddingClass, getWidthClass, getTextColors } from '@/lib/blockStyles';

const COLOR_MAP: Record<string, { border: string; badge: string; btn: string }> = {
  blue:   { border: 'border-blue-500/30',    badge: 'bg-blue-500/20 text-blue-300',       btn: 'bg-blue-600 hover:bg-blue-500' },
  green:  { border: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-300', btn: 'bg-gradient-to-r from-emerald-500 to-teal-500' },
  purple: { border: 'border-violet-500/30',  badge: 'bg-violet-500/20 text-violet-300',   btn: 'bg-violet-600 hover:bg-violet-500' },
};

export default function PricingBlock({ props }: { props: Record<string, unknown> }) {
  const p = props as {
    badge: string; title: string; subtitle: string;
    plans: { label: string; title: string; monthlyPrice: number; color: string; popular: boolean; features: string[] }[];
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
            <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-4">
              {p.badge}
            </span>
          )}
          <h2 className={`text-4xl font-bold ${tc.h} mb-3`}>{p.title}</h2>
          {p.subtitle && <p className={tc.body}>{p.subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(p.plans ?? []).map((plan, i) => {
            const c = COLOR_MAP[plan.color] ?? COLOR_MAP.blue;
            return (
              <div key={i} className={`relative rounded-2xl p-6 border ${isLight ? 'bg-white' : 'bg-white/3'} ${c.border} ${plan.popular ? 'scale-105' : ''}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold">
                    ⭐ Populaire
                  </span>
                )}
                <div className="mb-5">
                  <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${c.badge}`}>{plan.label}</span>
                  <p className={`${tc.body} text-sm mt-2`}>{plan.title}</p>
                </div>
                <div className="mb-6">
                  <span className={`text-4xl font-extrabold ${tc.h}`}>{plan.monthlyPrice}€</span>
                  <span className={`${tc.faint} text-sm`}>/mois</span>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {(plan.features ?? []).map((f, j) => (
                    <li key={j} className={`flex items-start gap-2 text-sm ${tc.body}`}>
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 ${c.btn}`}>Commencer</button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
