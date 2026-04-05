import { ArrowRight, Sparkles } from 'lucide-react';
import { getBgClass, getPaddingClass, getTextColors } from '@/lib/blockStyles';

const BLOB_MAP: Record<string, { c1: string; c2: string }> = {
  'mesh-blue':   { c1: '#3B82F6', c2: '#06B6D4' },
  'mesh-purple': { c1: '#8B5CF6', c2: '#EC4899' },
  'mesh-green':  { c1: '#10B981', c2: '#06B6D4' },
  'dark':        { c1: '#374151', c2: '#1F2937' },
  'gradient':    { c1: '#3B82F6', c2: '#8B5CF6' },
};

export default function HeroBlock({ props }: { props: Record<string, unknown> }) {
  const p = props as {
    badge: string; title: string; titleGradient: string; subtitle: string;
    ctaLabel: string; ctaSecondaryLabel: string; backgroundVariant: string;
    showStats: boolean; stats: { value: string; label: string }[];
    bg?: string; paddingY?: string;
  };

  const bgClass = getBgClass(p.bg);
  const paddingClass = getPaddingClass(p.paddingY ?? 'lg');
  const blobs = BLOB_MAP[p.backgroundVariant] ?? BLOB_MAP['mesh-blue'];
  const tc = getTextColors(p.bg);

  return (
    <section className={`relative overflow-hidden ${bgClass} ${paddingClass} px-8`}>
      {/* Animated blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', top: '-10%', left: '-5%', width: 500, height: 500,
          borderRadius: '50%', background: `radial-gradient(circle, ${blobs.c1} 0%, transparent 70%)`,
          opacity: 0.12, filter: 'blur(80px)',
          animation: 'blob-float 18s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-5%', right: '-5%', width: 400, height: 400,
          borderRadius: '50%', background: `radial-gradient(circle, ${blobs.c2} 0%, transparent 70%)`,
          opacity: 0.09, filter: 'blur(80px)',
          animation: 'blob-float 22s ease-in-out infinite',
          animationDelay: '-8s',
        }} />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {p.badge && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" /> {p.badge}
          </span>
        )}
        <h1 className={`text-5xl md:text-6xl font-extrabold leading-tight mb-5 ${tc.h}`}>
          {p.title}{' '}
          <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
            {p.titleGradient}
          </span>
        </h1>
        <p className={`text-lg ${tc.body} max-w-2xl mx-auto mb-10 leading-relaxed`}>{p.subtitle}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20">
            <Sparkles className="w-4 h-4" /> {p.ctaLabel || 'Commencer'}
          </button>
          {p.ctaSecondaryLabel && (
            <button className={`flex items-center gap-2 px-7 py-3.5 rounded-xl border ${tc.border} ${tc.h} font-semibold hover:opacity-80 transition-opacity`}>
              {p.ctaSecondaryLabel} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {p.showStats && p.stats?.length > 0 && (
          <div className={`inline-grid grid-cols-2 sm:grid-cols-4 gap-0 rounded-2xl overflow-hidden border ${tc.border} ${tc.card} backdrop-blur-sm divide-x ${tc.divide} divide-y sm:divide-y-0 mx-auto`}>
            {p.stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center py-4 px-6">
                <span className={`text-xl font-bold ${tc.h}`}>{s.value}</span>
                <span className={`text-xs ${tc.faint} mt-0.5`}>{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
