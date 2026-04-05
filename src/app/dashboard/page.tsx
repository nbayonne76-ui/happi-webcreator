'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, MoreVertical, Pencil, Copy, Trash2,
  Globe, Clock, Zap, LayoutTemplate, Sparkles, ArrowRight,
} from 'lucide-react';
import AppShell from '@/components/ui/AppShell';
import Modal from '@/components/ui/Modal';
import { useEditorStore } from '@/store/useEditorStore';
import { TEMPLATES } from '@/lib/defaults';

const CATEGORY_COLORS: Record<string, string> = {
  saas: 'from-blue-500/20 to-violet-500/20 border-blue-500/20',
  agency: 'from-violet-500/20 to-pink-500/20 border-violet-500/20',
  startup: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/20',
  portfolio: 'from-amber-500/20 to-orange-500/20 border-amber-500/20',
  restaurant: 'from-rose-500/20 to-red-500/20 border-rose-500/20',
  ecommerce: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/20',
  blank: 'from-white/5 to-white/3 border-white/10',
};

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'À l\'instant';
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

export default function DashboardPage() {
  const router = useRouter();
  const { projects, addProject, deleteProject, duplicateProject, renameProject, setCurrentProject } = useEditorStore();

  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectTemplate, setNewProjectTemplate] = useState('saas-landing');
  const [renameValue, setRenameValue] = useState('');

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleCreate() {
    if (!newProjectName.trim()) return;
    const project = addProject(newProjectName.trim(), newProjectTemplate);
    setCreateOpen(false);
    setNewProjectName('');
    setCurrentProject(project.id);
    router.push(`/editor/${project.id}`);
  }

  function handleOpen(projectId: string) {
    setCurrentProject(projectId);
    router.push(`/editor/${projectId}`);
  }

  function handleRename() {
    if (!renameOpen || !renameValue.trim()) return;
    renameProject(renameOpen, renameValue.trim());
    setRenameOpen(null);
    setRenameValue('');
  }

  return (
    <AppShell>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Mes projets</h1>
              <p className="text-sm text-white/40 mt-1">{projects.length} site{projects.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/generate')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-white/70 hover:text-white text-sm transition-all hover:bg-white/8"
              >
                <Sparkles className="w-4 h-4 text-violet-400" />
                Générer avec l&apos;IA
              </button>
              <button
                onClick={() => { setCreateOpen(true); setNewProjectName(''); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nouveau projet
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/8 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          {projects.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/20 flex items-center justify-center">
                <Globe className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Créez votre premier site</h2>
                <p className="text-white/40 text-sm max-w-xs">Choisissez un template ou laissez l&apos;IA générer votre site en quelques secondes.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setCreateOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" /> Nouveau projet
                </button>
                <button
                  onClick={() => router.push('/generate')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass hover:bg-white/8 text-white font-semibold text-sm transition-all"
                >
                  <Sparkles className="w-4 h-4 text-violet-400" /> Générer avec l&apos;IA
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* New project card */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCreateOpen(true)}
                className="glass rounded-2xl p-6 flex flex-col items-center justify-center gap-3 min-h-[180px] border-dashed hover:border-blue-500/40 hover:bg-white/4 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-blue-500/15 flex items-center justify-center transition-colors">
                  <Plus className="w-5 h-5 text-white/40 group-hover:text-blue-400 transition-colors" />
                </div>
                <span className="text-sm text-white/40 group-hover:text-white/70 transition-colors">Nouveau projet</span>
              </motion.button>

              {/* Project cards */}
              <AnimatePresence>
                {filtered.map((project, i) => {
                  const gradientClass = CATEGORY_COLORS[project.templateId.split('-')[0]] ?? CATEGORY_COLORS.blank;
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.04 }}
                      className="relative glass rounded-2xl overflow-hidden group"
                    >
                      {/* Thumbnail */}
                      <div
                        className={`h-36 bg-gradient-to-br ${gradientClass} border-b border-white/5 flex items-center justify-center cursor-pointer`}
                        onClick={() => handleOpen(project.id)}
                      >
                        <div className="text-center">
                          <Globe className="w-8 h-8 text-white/20 mx-auto mb-2" />
                          <span className="text-xs text-white/30 capitalize">{project.templateId.replace('-', ' ')}</span>
                        </div>
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">
                            <Pencil className="w-3.5 h-3.5" /> Éditer
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-white text-sm truncate">{project.name}</h3>
                            <div className="flex items-center gap-1.5 mt-1 text-xs text-white/30">
                              <Clock className="w-3 h-3" />
                              {timeAgo(project.updatedAt)}
                              <span className="mx-1">·</span>
                              <span>{project.pages.length} page{project.pages.length !== 1 ? 's' : ''}</span>
                            </div>
                          </div>

                          {/* Menu */}
                          <div className="relative shrink-0">
                            <button
                              onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === project.id ? null : project.id); }}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-all"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            <AnimatePresence>
                              {menuOpen === project.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                  className="absolute right-0 top-8 w-44 glass rounded-xl py-1 z-20 shadow-2xl"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {[
                                    { icon: Pencil, label: 'Éditer', action: () => { handleOpen(project.id); setMenuOpen(null); } },
                                    { icon: Copy, label: 'Dupliquer', action: () => { duplicateProject(project.id); setMenuOpen(null); } },
                                    { icon: Pencil, label: 'Renommer', action: () => { setRenameValue(project.name); setRenameOpen(project.id); setMenuOpen(null); } },
                                    { icon: Trash2, label: 'Supprimer', action: () => { deleteProject(project.id); setMenuOpen(null); }, danger: true },
                                  ].map(({ icon: Icon, label, action, danger }) => (
                                    <button
                                      key={label}
                                      onClick={action}
                                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-white/5 ${danger ? 'text-red-400' : 'text-white/70 hover:text-white'}`}
                                    >
                                      <Icon className="w-3.5 h-3.5" /> {label}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Click outside menu */}
      {menuOpen && <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />}

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Nouveau projet" width="max-w-lg">
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-white/60 mb-2">Nom du projet</label>
            <input
              autoFocus
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="Mon super site..."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-blue-500/60 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-3">Template de départ</label>
            <div className="grid grid-cols-3 gap-2">
              {TEMPLATES.filter((t) => t.id !== 'blank').slice(0, 6).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setNewProjectTemplate(t.id)}
                  className={`p-3 rounded-xl border text-xs transition-all text-left ${
                    newProjectTemplate === t.id
                      ? 'border-blue-500/60 bg-blue-500/10 text-blue-300'
                      : 'border-white/8 bg-white/3 text-white/50 hover:border-white/20 hover:text-white/80'
                  }`}
                >
                  <LayoutTemplate className="w-4 h-4 mb-1.5 opacity-60" />
                  {t.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setNewProjectTemplate('blank')}
              className={`w-full mt-2 p-2.5 rounded-xl border text-xs transition-all text-center ${
                newProjectTemplate === 'blank'
                  ? 'border-blue-500/60 bg-blue-500/10 text-blue-300'
                  : 'border-dashed border-white/10 text-white/30 hover:border-white/20 hover:text-white/60'
              }`}
            >
              Page vierge
            </button>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={() => setCreateOpen(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/60 text-sm hover:bg-white/8 transition-colors">
              Annuler
            </button>
            <button
              onClick={handleCreate}
              disabled={!newProjectName.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors disabled:opacity-40"
            >
              Créer <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Modal>

      {/* Rename Modal */}
      <Modal open={!!renameOpen} onClose={() => setRenameOpen(null)} title="Renommer le projet">
        <div className="space-y-4">
          <input
            autoFocus
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/60 text-sm"
          />
          <div className="flex gap-3">
            <button onClick={() => setRenameOpen(null)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/60 text-sm hover:bg-white/8 transition-colors">Annuler</button>
            <button onClick={handleRename} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors">Renommer</button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
