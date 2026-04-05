import { ArrowRight, Sparkles } from 'lucide-react';

const VARIANT_MAP: Record<string, string> = {
  gradient: 'bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/20',
  glass: 'bg-white/3 backdrop-blur-sm border border-white/8',
  dark: 'bg-gray-900 border border-white/5',
};

export default function CtaBlock({ props }: { props: Record<string, unknown> }) {
  const p = props as { title: string; subtitle: string; ctaLabel: string; ctaSecondaryLabel: string; variant: string };
  return (
    <section className="py-20 px-8 bg-gray-950">
      <div className="max-w-3xl mx-auto text-center">
        <div className={`rounded-3xl p-12 ${VARIANT_MAP[p.variant] ?? VARIANT_MAP.gradient}`}>
          <h2 className="text-4xl font-bold text-white mb-4">{p.title}</h2>
          <p className="text-white/50 mb-8">{p.subtitle}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold">
              <Sparkles className="w-4 h-4" /> {p.ctaLabel}
            </button>
            {p.ctaSecondaryLabel && (
              <button className="flex items-center gap-2 px-7 py-3 rounded-xl bg-white/8 text-white font-semibold">
                {p.ctaSecondaryLabel} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
