import { Menu, Zap } from 'lucide-react';
import { getBgClass, getTextColors } from '@/lib/blockStyles';

export default function NavbarBlock({ props }: { props: Record<string, unknown> }) {
  const p = props as {
    logo: string;
    links: { label: string; href: string }[];
    ctaLabel: string;
    transparent: boolean;
    bg?: string;
  };

  const bgClass = getBgClass(p.bg);
  const tc = getTextColors(p.bg);
  const isLight = tc.h === 'text-gray-900';

  // Tailwind doesn't evaluate template literals — use static classes based on theme
  const linkClass   = isLight ? 'text-gray-500 hover:text-gray-900' : 'text-white/60 hover:text-white';
  const loginClass  = isLight ? 'text-gray-400 hover:text-gray-900' : 'text-white/40 hover:text-white';
  const logoClass   = isLight ? 'text-gray-900' : 'text-white';
  const menuClass   = isLight ? 'text-gray-500' : 'text-white/60';
  const borderClass = isLight ? 'border-gray-200' : 'border-white/5';

  return (
    <nav className={`flex items-center justify-between px-8 py-4 ${
      p.transparent ? 'bg-transparent' : `${bgClass} backdrop-blur-sm border-b ${borderClass}`
    }`}>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <span className={`font-bold ${logoClass}`}>{p.logo || 'MonSite'}</span>
      </div>
      <div className="hidden md:flex items-center gap-6">
        {(p.links ?? []).map((link, i) => (
          <span key={i} className={`text-sm cursor-pointer transition-colors ${linkClass}`}>{link.label}</span>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className={`hidden md:block text-sm cursor-pointer transition-colors ${loginClass}`}>Connexion</span>
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors">
          {p.ctaLabel || 'Commencer'}
        </button>
        <Menu className={`md:hidden w-5 h-5 ${menuClass}`} />
      </div>
    </nav>
  );
}
