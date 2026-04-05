'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutTemplate, Star, Sparkles, ArrowRight, Globe, Check } from 'lucide-react';
import AppShell from '@/components/ui/AppShell';
import Modal from '@/components/ui/Modal';
import { TEMPLATES } from '@/lib/defaults';
import { useEditorStore } from '@/store/useEditorStore';
import { Template } from '@/types';

const CATEGORIES = [
  { id: 'all', label: 'Tous' },
  { id: 'saas', label: 'SaaS' },
  { id: 'startup', label: 'Startup' },
  { id: 'agency', label: 'Agence' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'blank', label: 'Vierge' },
];

const GRADIENT_MAP: Record<string, string> = {
  saas: 'from-blue-600/30 via-violet-600/20 to-transparent',
  startup: 'from-emerald-600/30 via-teal-600/20 to-transparent',
  agency: 'from-violet-600/30 via-pink-600/20 to-transparent',
  portfolio: 'from-amber-600/30 via-orange-600/20 to-transparent',
  restaurant: 'from-rose-600/30 via-red-600/20 to-transparent',
  ecommerce: 'from-cyan-600/30 via-blue-600/20 to-transparent',
  blank: 'from-white/5 to-transparent',
};

function TemplateCard({ template, onUse }: { template: Template; onUse: (t: Template) => void }) {
  const gradient = GRADIENT_MAP[template.category] ?? GRADIENT_MAP.blank;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="glass rounded-2xl overflow-hidden group"
    >
      {/* Preview area */}
      <div className={`h-44 bg-gradient-to-br ${gradient} relative flex items-end p-4`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Globe className="w-10 h-10 text-white/10" />
        </div>
        {/* Blocks preview simulation */}
        <div className="absolute inset-x-6 inset-y-6 flex flex-col gap-1.5 opacity-30">
          <div className="h-5 bg-white/30 rounded w-3/4" />
          <div className="h-3 bg-white/20 rounded w-full" />
          <div className="h-3 bg-white/20 rounded w-5/6" />
          <div className="flex gap-2 mt-1">
            <div className="h-6 bg-white/40 rounded-lg flex-1" />
            <div className="h-6 bg-white/20 rounded-lg flex-1" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-1.5 z-10">
          {template.popular && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/80 text-white text-xs font-medium">
              <Star className="w-2.5 h-2.5" /> Populaire
            </span>
          )}
          {template.new && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/80 text-white text-xs font-medium">Nouveau</span>
          )}
        </div>

        {/* Use button on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={() => onUse(template)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            Utiliser <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-white text-sm">{template.name}</h3>
          <span className="text-xs text-white/30 capitalize px-2 py-0.5 bg-white/5 rounded-full">
            {template.category}
          </span>
        </div>
        <p className="text-xs text-white/40 leading-relaxed">{template.description}</p>
        <div className="flex items-center gap-1 mt-3 text-xs text-white/30">
          <LayoutTemplate className="w-3 h-3" />
          {template.pages[0]?.blocks.length ?? 0} sections
        </div>
      </div>
    </motion.div>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const { addProject, setCurrentProject } = useEditorStore();
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState<Template | null>(null);
  const [projectName, setProjectName] = useState('');

  const filtered = TEMPLATES.filter((t) => category === 'all' || t.category === category);

  function handleUse(t: Template) {
    setSelected(t);
    setProjectName(t.name);
  }

  function handleCreate() {
    if (!selected || !projectName.trim()) return;
    const project = addProject(projectName.trim(), selected.id);
    setCurrentProject(project.id);
    router.push(`/editor/${project.id}`);
  }

  return (
    <AppShell>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Templates</h1>
              <p className="text-sm text-white/40 mt-1">{TEMPLATES.length} templates disponibles</p>
            </div>
            <button
              onClick={() => router.push('/generate')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-white/8 text-white/70 hover:text-white text-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              Générer avec l&apos;IA
            </button>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  category === cat.id
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((t) => (
              <TemplateCard key={t.id} template={t} onUse={handleUse} />
            ))}
          </div>
        </div>
      </div>

      {/* Use Template Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Utiliser "${selected?.name}"`}>
        <div className="space-y-4">
          <p className="text-sm text-white/50">{selected?.description}</p>
          <div>
            <label className="block text-sm text-white/60 mb-2">Nom du projet</label>
            <input
              autoFocus
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/60 text-sm"
            />
          </div>
          {selected && (
            <div className="bg-white/3 rounded-xl p-3 text-xs text-white/40">
              <p className="font-medium text-white/60 mb-1.5">Ce template inclut :</p>
              <ul className="space-y-1">
                {selected.pages[0]?.blocks.slice(0, 6).map((b) => (
                  <li key={b.id} className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-400" /> Section {b.type}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button onClick={() => setSelected(null)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/60 text-sm hover:bg-white/8 transition-colors">Annuler</button>
            <button
              onClick={handleCreate}
              disabled={!projectName.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors disabled:opacity-40"
            >
              Créer le projet <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
