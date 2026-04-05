'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Plus, ChevronRight, Trash2, Copy, GripVertical,
  Layout, Type, Image, AlignLeft, Minus, FileText,
  PencilLine, Check, X, ChevronUp, ChevronDown,
} from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditorStore, useCurrentBlocks, useCurrentProject } from '@/store/useEditorStore';
import { createBlock } from '@/lib/defaults';
import { BlockType, Block } from '@/types';

// ─── Block catalog ────────────────────────────────────────────────────────────

const BLOCK_CATALOG: { group: string; items: { type: BlockType; label: string; icon: typeof Layout; description: string }[] }[] = [
  {
    group: 'Structure',
    items: [
      { type: 'navbar',  label: 'Navbar',      icon: AlignLeft, description: 'Barre de navigation' },
      { type: 'footer',  label: 'Footer',       icon: AlignLeft, description: 'Pied de page' },
      { type: 'divider', label: 'Séparateur',   icon: Minus,     description: 'Ligne de séparation' },
    ],
  },
  {
    group: 'Sections',
    items: [
      { type: 'hero',         label: 'Hero',          icon: Layout, description: 'Section principale' },
      { type: 'features',     label: 'Fonctionnalités', icon: Layout, description: 'Grille de features' },
      { type: 'stats',        label: 'Statistiques',  icon: Layout, description: 'Chiffres clés' },
      { type: 'testimonials', label: 'Témoignages',   icon: Layout, description: 'Avis clients' },
      { type: 'logowall',     label: 'Logo Wall',     icon: Layout, description: 'Logos partenaires' },
    ],
  },
  {
    group: 'Conversion',
    items: [
      { type: 'cta',     label: 'CTA',    icon: Layout, description: 'Call to action' },
      { type: 'pricing', label: 'Tarifs', icon: Layout, description: 'Plans tarifaires' },
      { type: 'faq',     label: 'FAQ',    icon: Layout, description: 'Questions fréquentes' },
    ],
  },
  {
    group: 'Contenu',
    items: [
      { type: 'text',  label: 'Texte', icon: Type,  description: 'Bloc de texte libre' },
      { type: 'image', label: 'Image', icon: Image, description: 'Image ou illustration' },
    ],
  },
];

const BLOCK_LABELS: Record<string, string> = {
  navbar: 'Navigation', hero: 'Héro', features: 'Fonctionnalités', stats: 'Stats',
  cta: 'CTA', pricing: 'Tarifs', faq: 'FAQ', testimonials: 'Témoignages',
  logowall: 'Logo Wall', footer: 'Pied de page', text: 'Texte', image: 'Image',
  divider: 'Séparateur',
};

// ─── Sortable block row ───────────────────────────────────────────────────────

function SortableBlockRow({ block, index, total }: { block: Block; index: number; total: number }) {
  const { selectedBlockId, selectBlock, currentProjectId, currentPageId, duplicateBlock, removeBlock, moveBlock } = useEditorStore();
  const isSelected = selectedBlockId === block.id;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  function move(dir: 'up' | 'down') {
    if (!currentProjectId || !currentPageId) return;
    moveBlock(currentProjectId, currentPageId, index, dir === 'up' ? index - 1 : index + 1);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => selectBlock(isSelected ? null : block.id)}
      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer group transition-all select-none ${
        isSelected ? 'bg-blue-500/15 text-blue-300' : 'text-white/50 hover:text-white hover:bg-white/5'
      } ${isDragging ? 'ring-1 ring-blue-500/50 bg-blue-500/10' : ''}`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="w-4 h-4 flex items-center justify-center opacity-20 hover:opacity-60 cursor-grab active:cursor-grabbing transition-opacity shrink-0"
      >
        <GripVertical className="w-3 h-3" />
      </button>

      <ChevronRight className="w-3 h-3 opacity-30 shrink-0" />
      <span className="text-xs flex-1 truncate">{BLOCK_LABELS[block.type] ?? block.type}</span>
      <span className="text-[10px] opacity-20 shrink-0">{index + 1}</span>

      {/* Actions visible on hover */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          title="Monter"
          onClick={(e) => { e.stopPropagation(); move('up'); }}
          disabled={index === 0}
          className="w-4 h-4 flex items-center justify-center hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronUp className="w-2.5 h-2.5" />
        </button>
        <button
          title="Descendre"
          onClick={(e) => { e.stopPropagation(); move('down'); }}
          disabled={index === total - 1}
          className="w-4 h-4 flex items-center justify-center hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronDown className="w-2.5 h-2.5" />
        </button>
        <button
          title="Dupliquer"
          onClick={(e) => { e.stopPropagation(); if (currentProjectId && currentPageId) duplicateBlock(currentProjectId, currentPageId, block.id); }}
          className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <Copy className="w-2.5 h-2.5" />
        </button>
        <button
          title="Supprimer"
          onClick={(e) => { e.stopPropagation(); if (currentProjectId && currentPageId) removeBlock(currentProjectId, currentPageId, block.id); }}
          className="w-5 h-5 rounded flex items-center justify-center hover:bg-red-500/20 text-red-400 transition-colors"
        >
          <Trash2 className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Page row with inline rename ──────────────────────────────────────────────

function PageRow({ page, isCurrent }: { page: { id: string; name: string; slug: string }; isCurrent: boolean }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(page.name);
  const { currentProjectId, currentPageId, renamePage, removePage } = useEditorStore();

  function confirm() {
    if (draft.trim() && currentProjectId) renamePage(currentProjectId, page.id, draft.trim());
    setEditing(false);
  }

  return (
    <div
      onClick={() => { if (!editing) useEditorStore.getState().setCurrentPage(page.id); }}
      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer group transition-all ${
        isCurrent ? 'bg-blue-500/15 text-blue-300' : 'text-white/50 hover:text-white hover:bg-white/5'
      }`}
    >
      <FileText className="w-3 h-3 shrink-0 opacity-60" />
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') confirm(); if (e.key === 'Escape') setEditing(false); }}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 bg-transparent text-xs outline-none border-b border-blue-400/60 text-white"
        />
      ) : (
        <span className="text-xs flex-1 truncate">{page.name}</span>
      )}
      <div className={`flex items-center gap-0.5 transition-opacity ${editing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        {editing ? (
          <>
            <button onClick={(e) => { e.stopPropagation(); confirm(); }} className="w-5 h-5 rounded flex items-center justify-center text-emerald-400 hover:bg-emerald-500/10 transition-colors"><Check className="w-2.5 h-2.5" /></button>
            <button onClick={(e) => { e.stopPropagation(); setEditing(false); }} className="w-5 h-5 rounded flex items-center justify-center text-white/30 hover:bg-white/10 transition-colors"><X className="w-2.5 h-2.5" /></button>
          </>
        ) : (
          <>
            <button onClick={(e) => { e.stopPropagation(); setDraft(page.name); setEditing(true); }} className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/10 transition-colors"><PencilLine className="w-2.5 h-2.5" /></button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const project = useEditorStore.getState().projects.find((p) => p.id === currentProjectId);
                if (!currentProjectId || !project || project.pages.length <= 1) return;
                removePage(currentProjectId, page.id);
              }}
              className="w-5 h-5 rounded flex items-center justify-center hover:bg-red-500/20 text-red-400 transition-colors"
            >
              <Trash2 className="w-2.5 h-2.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main sidebar ─────────────────────────────────────────────────────────────

type Tab = 'blocks' | 'layers';

export default function Sidebar() {
  const [tab, setTab] = useState<Tab>('blocks');
  const { currentProjectId, currentPageId, selectBlock, addBlock, addPage } = useEditorStore();
  const blocks = useCurrentBlocks();
  const project = useCurrentProject();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  function handleAddBlock(type: BlockType) {
    if (!currentProjectId || !currentPageId) return;
    const block = createBlock(type);
    addBlock(currentProjectId, currentPageId, block);
    selectBlock(block.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !currentProjectId || !currentPageId) return;
    const fromIndex = blocks.findIndex((b) => b.id === active.id);
    const toIndex   = blocks.findIndex((b) => b.id === over.id);
    if (fromIndex !== -1 && toIndex !== -1) {
      useEditorStore.getState().moveBlock(currentProjectId, currentPageId, fromIndex, toIndex);
    }
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
            <motion.div key="blocks" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.15 }} className="p-3 space-y-4">
              {BLOCK_CATALOG.map((group) => (
                <div key={group.group}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 px-1 mb-2">{group.group}</p>
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
                        <span className="text-[11px] text-white/60 group-hover:text-white/90 transition-colors leading-tight">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="layers" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.15 }} className="p-2">

              {/* Pages */}
              <div className="mb-3">
                <div className="flex items-center justify-between px-2 mb-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">Pages ({project?.pages.length ?? 0})</p>
                  <button
                    onClick={() => {
                      if (!currentProjectId) return;
                      const name = `Page ${(project?.pages.length ?? 0) + 1}`;
                      addPage(currentProjectId, name);
                    }}
                    title="Nouvelle page"
                    className="w-5 h-5 rounded flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                {project?.pages.map((page) => (
                  <PageRow
                    key={page.id}
                    page={page}
                    isCurrent={useEditorStore.getState().currentPageId === page.id}
                  />
                ))}
              </div>

              {/* Blocks (sortable) */}
              <div className="flex items-center justify-between px-2 mb-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">Sections ({blocks.length})</p>
              </div>

              {blocks.length === 0 ? (
                <p className="text-xs text-white/25 px-2 py-4 text-center">Aucune section</p>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-0.5">
                      {blocks.map((block, i) => (
                        <SortableBlockRow key={block.id} block={block} index={i} total={blocks.length} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
