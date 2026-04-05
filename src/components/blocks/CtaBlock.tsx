import { ArrowRight, Sparkles } from 'lucide-react';
import { getBgClass, getPaddingClass, getWidthClass, getTextColors } from '@/lib/blockStyles';

const VARIANT_MAP: Record<string, string> = {
  gradient: 'bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/20',
  glass:    'bg-white/3 backdrop-blur-sm border border-white/8',
  dark:     'bg-gray-900 border border-white/5',
};

const VARIANT_MAP_LIGHT: Record<string, string> = {
  gradient: 'bg-gradient-to-br from-blue-100 to-violet-100 border border-blue-200',
  glass:    'bg-white/80 backdrop-blur-sm border border-gray-200',
  dark:     'bg-gray-100 border border-gray-200',
};

export default function CtaBlock({ props }: { props: Record<string, unknown> }) {
  const p = props as {
    title: string; subtitle: string; ctaLabel: string; ctaSecondaryLabel: string;
    variant: string;
    bg?: string; paddingY?: string; contentWidth?: string;
  };

  const bgClass = getBgClass(p.bg);
  const paddingClass = getPaddingClass(p.paddingY);
  const widthClass = getWidthClass(p.contentWidth ?? 'narrow');
  const tc = getTextColors(p.bg);
  const isLight = tc.h === 'text-gray-900';
  const variantClass = (isLight ? VARIANT_MAP_LIGHT[p.variant] : VARIANT_MAP[p.variant]) ?? (isLight ? VARIANT_MAP_LIGHT.gradient : VARIANT_MAP.gradient);

  return (
    <section className={`${bgClass} ${paddingClass} px-8`}>
      <div className={`${widthClass} text-center`}>
        <div className={`rounded-3xl p-12 ${variantClass}`}>
          <h2 className={`text-4xl font-bold ${tc.h} mb-4`}>{p.title}</h2>
          <p className={`${tc.body} mb-8`}>{p.subtitle}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:opacity-90 transition-opacity">
              <Sparkles className="w-4 h-4" /> {p.ctaLabel}
            </button>
            {p.ctaSecondaryLabel && (
              <button className={`flex items-center gap-2 px-7 py-3 rounded-xl border ${tc.border} ${tc.h} font-semibold hover:opacity-80 transition-opacity`}>
                {p.ctaSecondaryLabel} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
