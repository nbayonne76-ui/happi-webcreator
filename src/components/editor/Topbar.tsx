'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Undo2, Redo2, Monitor, Tablet, Smartphone, Eye, Globe,
  ChevronDown, Zap, Grid3x3, SquareDashedBottom, Download,
} from 'lucide-react';
import { useEditorStore, useCurrentProject } from '@/store/useEditorStore';
import { DevicePreview } from '@/types';
import { exportProjectToHtml } from '@/lib/exportHtml';

const DEVICES: { id: DevicePreview; icon: typeof Monitor; label: string }[] = [
  { id: 'desktop', icon: Monitor,    label: 'Bureau' },
  { id: 'tablet',  icon: Tablet,     label: 'Tablette' },
  { id: 'mobile',  icon: Smartphone, label: 'Mobile' },
];

export default function Topbar() {
  const project = useCurrentProject();
  const {
    currentProjectId,
    devicePreview, setDevicePreview,
    undo, redo, canUndo, canRedo,
    showGrid, toggleGrid,
    showOutlines, toggleOutlines,
  } = useEditorStore();

  function handleExport() {
    if (!project) return;
    exportProjectToHtml(project);
  }

  function handlePreview() {
    if (!currentProjectId) return;
    window.open(`/preview/${currentProjectId}`, '_blank');
  }

  return (
    <div className="h-[52px] border-b border-white/5 glass flex items-center px-4 gap-3 shrink-0 z-30">
      {/* Logo + back */}
      <Link href="/dashboard" className="flex items-center gap-2 mr-2 shrink-0" title="Tableau de bord">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
      </Link>

      {/* Project name */}
      <div className="flex items-center gap-1 text-sm text-white/60 hover:text-white cursor-pointer transition-colors group mr-2">
        <span className="font-medium truncate max-w-36">{project?.name ?? 'Projet'}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
      </div>

      <div className="w-px h-5 bg-white/10" />

      {/* Undo / Redo */}
      <div className="flex items-center gap-0.5">
        <button onClick={undo} disabled={!canUndo()} title="Annuler (Ctrl+Z)"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all disabled:opacity-20 disabled:cursor-not-allowed">
          <Undo2 className="w-4 h-4" />
        </button>
        <button onClick={redo} disabled={!canRedo()} title="Rétablir (Ctrl+Y)"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all disabled:opacity-20 disabled:cursor-not-allowed">
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      <div className="w-px h-5 bg-white/10" />

      {/* View options */}
      <div className="flex items-center gap-0.5">
        <button onClick={toggleGrid} title="Grille"
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${showGrid ? 'text-blue-400 bg-blue-500/15' : 'text-white/40 hover:text-white hover:bg-white/8'}`}>
          <Grid3x3 className="w-4 h-4" />
        </button>
        <button onClick={toggleOutlines} title="Contours des sections"
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${showOutlines ? 'text-blue-400 bg-blue-500/15' : 'text-white/40 hover:text-white hover:bg-white/8'}`}>
          <SquareDashedBottom className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1" />

      {/* Device preview */}
      <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-white/5 border border-white/8">
        {DEVICES.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setDevicePreview(id)} title={label}
            className={`w-8 h-7 rounded-lg flex items-center justify-center transition-all ${devicePreview === id ? 'bg-white/12 text-white' : 'text-white/30 hover:text-white/60'}`}>
            <Icon className="w-3.5 h-3.5" />
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-white/10" />

      {/* Preview */}
      <button
        onClick={handlePreview}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-hover text-white/60 hover:text-white text-sm transition-all"
        title="Aperçu plein écran (nouvel onglet)"
      >
        <Eye className="w-4 h-4" />
        Aperçu
      </button>

      {/* Export HTML */}
      <button
        onClick={handleExport}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/8 text-sm transition-all"
        title="Exporter en HTML statique"
      >
        <Download className="w-4 h-4" />
        Exporter
      </button>

      {/* Publish */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
      >
        <Globe className="w-3.5 h-3.5" />
        Publier
      </motion.button>
    </div>
  );
}
