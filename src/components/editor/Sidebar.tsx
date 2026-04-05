'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Plus, ChevronRight, Trash2, Copy, GripVertical,
  Layout, Type, Image, AlignLeft, Minus, FileText,
} from 'lucide-react';
import { useEditorStore, useCurrentBlocks, useCurrentProject } from '@/store/useEditorStore';
import { createBlock } from '@/lib/defaults';
import { BlockType } from '@/types';

// ─── Block catalog ────────────────────────────────────────────────────────────

const BLOCK_CATALOG: { group: string; items: { type: BlockType; label: string; icon: typeof Layout; description: string }[] }[] = [
  {
    group: 'Structure',
    items: [
      { type: 'navbar', label: 'Navbar', icon: AlignLeft, description: 'Barre de navigation' },
      { type: 'footer', label: 'Footer', icon: AlignLeft, description: 'Pied de page' },
      { type: 'divider', label: 'Séparateur', icon: Minus, description: 'Ligne de séparation' },
    ],
  },
  {
    group: 'Sections',
    items: [
      { type: 'hero', label: 'Hero', icon: Layout, description: 'Section principale' },
      { type: 'features', label: 'Fonctionnalités', icon: Layout, description: 'Grille de features' },
      { type: 'stats', label: 'Statistiques', icon: Layout, description: 'Chiffres clés' },
      { type: 'testimonials', label: 'Témoignages', icon: Layout, description: 'Avis clients' },
      { type: 'logowall', label: 'Logo Wall', icon: Layout, description: 'Logos partenaires' },
      { type: 'before-after', label: 'Avant/Après', icon: Layout, description: 'Comparaison' },
    ],
  },
  {
    group: 'Conversion',
    items: [
      { type: 'cta', label: 'CTA', icon: Layout, description: 'Call to action' },
      { type: 'pricing', label: 'Tarifs', icon: Layout, description: 'Plans tarifaires' },
      { type: 'faq', label: 'FAQ', icon: Layout, description: 'Questions fréquentes' },
    ],
  },
  {
    group: 'Contenu',
    items: [
      { type: 'text', label: 'Texte', icon: Type, description: 'Bloc de texte libre' },
      { type: 'image', label: 'Image', icon: Image, description: 'Image ou illustration' },
    ],
  },
];

// ─── Sidebar ─────────────────────────────────────────────────────────────────

type Tab = 'blocks' | 'layers';

export default function Sidebar() {
  const [tab, setTab] = useState<Tab>('blocks');
  const { currentProjectId, currentPageId, selectedBlockId, selectBlock, addBlock, removeBlock, duplicateBlock } = useEditorStore();
  const blocks = useCurrentBlocks();
  const project = useCurrentProject();

  function handleAddBlock(type: BlockType) {
    if (!currentProjectId || !currentPageId) return;
    const block = createBlock(type);
    addBlock(currentProjectId, currentPageId, block);
    selectBlock(block.id);
  }

  return (
    <aside className="w-[260px] border-r border-white/5 flex flex-col h-full shrink-0 bg-gray-950/80">
      {/* Tabs */}
      <div className="flex border-b border-white/5 px-2 pt-2 gap-1">
        {([['blocks', Plus, 'Sections'], ['layers', Layers, 'Calques']] as const).map(([id, Icon, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
              tab === id ? 'bg-white/8 text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {tab === 'blocks' ? (
            <motion.div
              key="blocks"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="p-3 space-y-4"
            >
              {BLOCK_CATALOG.map((group) => (
                <div key={group.group}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 px-1 mb-2">
                    {group.group}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {group.items.map(({ type, label, icon: Icon, description }) => (
                      <button
                        key={type}
                        onClick={() => handleAddBlock(type)}
                        title={description}
                        className="flex flex-col items-start gap-1.5 p-2.5 rounded-xl bg-white/3 hover:bg-white/8 border border-white/5 hover:border-white/15 transition-all group text-left"
                      >
                        <div className="w-6 h-6 rounded-lg bg-white/5 group-hover:bg-blue-500/15 flex items-center justify-center transition-colors">
                          <Icon className="w-3.5 h-3.5 text-white/40 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <span className="text-[11px] text-white/60 group-hover:text-white/90 transition-colors leading-tight">
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="layers"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
              className="p-2"
            >
              {/* Pages */}
              <div className="mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 px-2 mb-2">Pages</p>
                {project?.pages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => useEditorStore.getState().setCurrentPage(page.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all ${
                      useEditorStore.getState().currentPageId === page.id
                        ? 'bg-blue-500/15 text-blue-300'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <FileText className="w-3 h-3" />
                    {page.name}
                  </button>
                ))}
              </div>

              {/* Blocks list */}
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 px-2 mb-2">
                Sections ({blocks.length})
              </p>
              {blocks.length === 0 && (
                <p className="text-xs text-white/25 px-2 py-4 text-center">Aucune section</p>
              )}
              <div className="space-y-0.5">
                {blocks.map((block, i) => {
                  const isSelected = selectedBlockId === block.id;
                  return (
                    <div
                      key={block.id}
                      onClick={() => selectBlock(isSelected ? null : block.id)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer group transition-all ${
                        isSelected ? 'bg-blue-500/15 text-blue-300' : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <GripVertical className="w-3 h-3 opacity-30 cursor-grab shrink-0" />
                      <ChevronRight className="w-3 h-3 opacity-30 shrink-0" />
                      <span className="text-xs flex-1 truncate capitalize">{block.type}</span>
                      <span className="text-[10px] opacity-20">{i + 1}</span>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); if (currentProjectId && currentPageId) duplicateBlock(currentProjectId, currentPageId, block.id); }}
                          className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                          <Copy className="w-2.5 h-2.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); if (currentProjectId && currentPageId) removeBlock(currentProjectId, currentPageId, block.id); }}
                          className="w-5 h-5 rounded flex items-center justify-center hover:bg-red-500/20 text-red-400 transition-colors"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
