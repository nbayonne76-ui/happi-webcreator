'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LayoutTemplate, Sparkles, Settings, Globe, Zap } from 'lucide-react';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Projets' },
  { href: '/templates', icon: LayoutTemplate, label: 'Templates' },
  { href: '/generate', icon: Sparkles, label: 'IA Générer' },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar */}
      <aside className="w-16 flex flex-col items-center py-4 gap-1 border-r border-white/5 bg-gray-950 shrink-0">
        {/* Logo */}
        <Link href="/dashboard" className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mb-4 shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </Link>

        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                active
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-white/30 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
            </Link>
          );
        })}

        <div className="flex-1" />

        <Link
          href="/settings"
          title="Paramètres"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-all"
        >
          <Settings className="w-5 h-5" />
        </Link>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
