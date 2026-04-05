import { Menu, Zap } from 'lucide-react';

export default function NavbarBlock({ props }: { props: Record<string, unknown> }) {
  const p = props as { logo: string; links: { label: string; href: string }[]; ctaLabel: string; transparent: boolean };
  return (
    <nav className={`flex items-center justify-between px-8 py-4 ${p.transparent ? 'bg-transparent' : 'bg-gray-950/80 backdrop-blur-sm border-b border-white/5'}`}>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-bold text-white">{p.logo || 'MonSite'}</span>
      </div>
      <div className="hidden md:flex items-center gap-6">
        {(p.links ?? []).map((link, i) => (
          <span key={i} className="text-sm text-white/60 hover:text-white cursor-pointer transition-colors">{link.label}</span>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden md:block text-sm text-white/40 cursor-pointer hover:text-white transition-colors">Connexion</span>
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold">
          {p.ctaLabel || 'Commencer'}
        </button>
        <Menu className="md:hidden w-5 h-5 text-white/60" />
      </div>
    </nav>
  );
}
