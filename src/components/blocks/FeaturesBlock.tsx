import { Zap, Shield, Globe, Sparkles, BarChart3, Puzzle, Star, Heart, Lock, Cpu, Mail, Phone } from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Zap, Shield, Globe, Sparkles, BarChart3, Puzzle, Star, Heart, Lock, Cpu, Mail, Phone,
};

const CARD_STYLES: Record<string, string> = {
  glass: 'bg-white/3 backdrop-blur-sm border border-white/7 hover:border-white/15',
  border: 'border border-white/10 hover:border-blue-500/40',
  filled: 'bg-white/5 hover:bg-white/8',
};

const COL_MAP: Record<number, string> = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' };

export default function FeaturesBlock({ props }: { props: Record<string, unknown> }) {
  const p = props as {
    badge: string; title: string; subtitle: string;
    columns: number; cardStyle: string;
    items: { icon: string; title: string; description: string }[];
  };
  const cardClass = CARD_STYLES[p.cardStyle] ?? CARD_STYLES.glass;
  const colClass = COL_MAP[p.columns] ?? COL_MAP[3];

  return (
    <section className="py-20 px-8 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          {p.badge && (
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
              {p.badge}
            </span>
          )}
          <h2 className="text-4xl font-bold text-white mb-4">{p.title}</h2>
          {p.subtitle && <p className="text-white/50 max-w-2xl mx-auto">{p.subtitle}</p>}
        </div>
        <div className={`grid grid-cols-1 ${colClass} gap-5`}>
          {(p.items ?? []).map((item, i) => {
            const Icon = ICON_MAP[item.icon] ?? Zap;
            return (
              <div key={i} className={`rounded-2xl p-6 transition-all ${cardClass}`}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
