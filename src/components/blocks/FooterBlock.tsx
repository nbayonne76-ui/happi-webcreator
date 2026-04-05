import { Zap } from 'lucide-react';

export default function FooterBlock({ props }: { props: Record<string, unknown> }) {
  const p = props as { logo: string; description: string; columns: { title: string; links: { label: string; href: string }[] }[]; showStatus: boolean; copyright: string };
  return (
    <footer className="bg-gray-950 border-t border-white/5 py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white">{p.logo}</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">{p.description}</p>
          </div>
          {(p.columns ?? []).map((col, i) => (
            <div key={i}>
              <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {(col.links ?? []).map((link, j) => (
                  <li key={j}><a href={link.href} className="text-sm text-white/40 hover:text-white/80 transition-colors">{link.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/30">
          <p>{p.copyright}</p>
          {p.showStatus && (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Tous les systèmes opérationnels
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
