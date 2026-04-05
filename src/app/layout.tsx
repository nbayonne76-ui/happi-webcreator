import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Happi Web Creator — Créez des sites web en quelques minutes',
  description: 'Éditeur visuel de sites web avec génération IA, templates premium et déploiement instantané.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.className}>
      <body className="bg-gray-950 text-white antialiased h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
