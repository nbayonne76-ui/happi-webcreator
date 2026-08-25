'use client';

import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, MousePointer2 } from 'lucide-react';
import { useEditorStore, useCurrentBlocks, useCurrentProject } from '@/store/useEditorStore';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import { DevicePreview, ThemeColor } from '@/types';

// ─── Primary color → CSS gradient variables ───────────────────────────────────

const ACCENT_MAP: Record<ThemeColor, { from: string; to: string; solid: string }> = {
  blue:    { from: '#2563EB', to: '#7C3AED', solid: '#2563EB' },
  violet:  { from: '#7C3AED', to: '#EC4899', solid: '#7C3AED' },
  emerald: { from: '#10B981', to: '#06B6D4', solid: '#10B981' },
  rose:    { from: '#F43F5E', to: '#FB923C', solid: '#F43F5E' },
  amber:   { from: '#F59E0B', to: '#EF4444', solid: '#F59E0B' },
  cyan:    { from: '#06B6D4', to: '#3B82F6', solid: '#06B6D4' },
};

const DEVICE_WIDTHS: Record<DevicePreview, string> = {
  desktop: 'w-full',
  tablet:  'w-[768px]',
  mobile:  'w-[390px]',
};

export default function Canvas() {
  const selectedBlockId     = useEditorStore((s) => s.selectedBlockId);
  const selectBlock         = useEditorStore((s) => s.selectBlock);
  const devicePreview       = useEditorStore((s) => s.devicePreview);
  const showGrid            = useEditorStore((s) => s.showGrid);
  const showOutlines        = useEditorStore((s) => s.showOutlines);
  const setActivePanel      = useEditorStore((s) => s.setActivePanel);
  const setInsertAfterIndex = useEditorStore((s) => s.setInsertAfterIndex);
  const blocks    = useCurrentBlocks();
  const project   = useCurrentProject();
  const canvasRef = useRef<HTMLDivElement>(null);

  const fontFamily  = project?.theme?.fontFamily ?? 'Inter';
  const primaryColor = (project?.theme?.primaryColor ?? 'blue') as ThemeColor;
  const accent = ACCENT_MAP[primaryColor] ?? ACCENT_MAP.blue;

  function handleCanvasClick(e: React.MouseEvent) {
    if (e.target === canvasRef.current) selectBlock(null);
  }

  function handleInsertAfter(index: number, e: React.MouseEvent) {
    e.stopPropagation();
    setInsertAfterIndex(index);
    setActivePanel('blocks');
  }

  const widthClass = DEVICE_WIDTHS[devicePreview];

  return (
    <div
      ref={canvasRef}
      className={`flex-1 overflow-auto bg-gray-900 flex flex-col items-center ${showGrid ? 'canvas-grid' : ''}`}
      onClick={handleCanvasClick}
    >
      {/* Device frame */}
      <div
        className={`${widthClass} min-h-full bg-gray-950 transition-all duration-300 relative shadow-2xl ${
          devicePreview !== 'desktop' ? 'my-8 rounded-2xl overflow-hidden shadow-black/50 ring-1 ring-white/10' : ''
        }`}
        style={{
          fontFamily: `'${fontFamily}', -apple-system, BlinkMacSystemFont, sans-serif`,
          '--accent-from': accent.from,
          '--accent-to':   accent.to,
          '--accent':      accent.solid,
        } as React.CSSProperties}
      >
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-dashed border-white/15 flex items-center justify-center">
              <MousePointer2 className="w-7 h-7 text-white/20" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white/50 mb-2">Canvas vide</h3>
              <p className="text-sm text-white/25 max-w-xs">
                Ajoutez des sections depuis le panneau de gauche pour commencer à construire votre page.
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {blocks.map((block, index) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="relative group"
              >
                <BlockRenderer
                  block={block}
                  selected={selectedBlockId === block.id}
                  onSelect={() => selectBlock(selectedBlockId === block.id ? null : block.id)}
                  showOutlines={showOutlines}
                />

                {/* Insert-after button — appears between sections on hover */}
                <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                  <button
                    onClick={(e) => handleInsertAfter(index, e)}
                    title={`Insérer une section après ${block.type}`}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-lg transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Insérer ici
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {devicePreview !== 'desktop' && (
        <div className="py-3 text-xs text-white/25 capitalize">
          {devicePreview} — {devicePreview === 'tablet' ? '768px' : '390px'}
        </div>
      )}
    </div>
  );
}
