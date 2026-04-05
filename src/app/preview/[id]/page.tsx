'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X, Monitor, Tablet, Smartphone, ExternalLink } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import { Block, DevicePreview } from '@/types';

const DEVICE_WIDTHS: Record<DevicePreview, string> = {
  desktop: 'w-full',
  tablet:  'w-[768px]',
  mobile:  'w-[390px]',
};

const DEVICES: { id: DevicePreview; icon: typeof Monitor; label: string }[] = [
  { id: 'desktop', icon: Monitor,    label: 'Bureau (100%)' },
  { id: 'tablet',  icon: Tablet,     label: 'Tablette (768px)' },
  { id: 'mobile',  icon: Smartphone, label: 'Mobile (390px)' },
];

export default function PreviewPage() {
  const params  = useParams();
  const router  = useRouter();
  const id      = params.id as string;

  const { projects } = useEditorStore();
  const [device, setDevice] = useState<DevicePreview>('desktop');
  const [pageIndex, setPageIndex] = useState(0);

  const project = projects.find((p) => p.id === id);

  useEffect(() => {
    if (!project) router.replace('/dashboard');
  }, [project, router]);

  if (!project) return null;

  const page = project.pages[pageIndex];
  const blocks: Block[] = page?.blocks ?? [];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Preview toolbar */}
      <div className="h-12 bg-gray-950 border-b border-white/8 flex items-center px-4 gap-3 shrink-0 z-50">
        {/* Back to editor */}
        <button
          onClick={() => router.push(`/editor/${id}`)}
          title="Retour à l'éditeur"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-white/10" />

        {/* Project name */}
        <span className="text-sm font-medium text-white/60 truncate max-w-40">{project.name}</span>

        {/* Page tabs */}
        {project.pages.length > 1 && (
          <>
            <div className="w-px h-5 bg-white/10" />
            <div className="flex items-center gap-1">
              {project.pages.map((pg, i) => (
                <button
                  key={pg.id}
                  onClick={() => setPageIndex(i)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    i === pageIndex ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {pg.name}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="flex-1" />

        {/* Device switcher */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-white/5 border border-white/8">
          {DEVICES.map(({ id: d, icon: Icon, label }) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              title={label}
              className={`w-8 h-7 rounded-lg flex items-center justify-center transition-all ${
                device === d ? 'bg-white/12 text-white' : 'text-white/30 hover:text-white/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-white/10" />

        {/* Open in new tab */}
        <button
          onClick={() => window.open(`/preview/${id}`, '_blank')}
          title="Ouvrir dans un nouvel onglet"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Preview canvas */}
      <div className="flex-1 overflow-auto flex justify-center bg-gray-900/80 py-6">
        <div
          className={`${DEVICE_WIDTHS[device]} bg-gray-950 min-h-full transition-all duration-300 relative ${
            device !== 'desktop' ? 'rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10' : ''
          }`}
        >
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-3">
              <p className="text-white/20 text-sm">Page vide — ajoutez des sections dans l&apos;éditeur</p>
              <button
                onClick={() => router.push(`/editor/${id}`)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold"
              >
                Retour à l&apos;éditeur
              </button>
            </div>
          ) : (
            blocks.map((block) => (
              <BlockRenderer
                key={block.id}
                block={block}
                selected={false}
                onSelect={() => {}}
                showOutlines={false}
              />
            ))
          )}
        </div>
      </div>

      {/* Device label */}
      {device !== 'desktop' && (
        <div className="py-2 text-center text-xs text-white/25">
          {device === 'tablet' ? '768px — Tablette' : '390px — Mobile'}
        </div>
      )}
    </div>
  );
}
