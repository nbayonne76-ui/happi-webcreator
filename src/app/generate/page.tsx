'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowRight, Loader2, Check, ChevronRight,
  Globe, Zap, LayoutTemplate, Palette,
} from 'lucide-react';
import AppShell from '@/components/ui/AppShell';
import { useEditorStore } from '@/store/useEditorStore';
import { createBlock } from '@/lib/defaults';
import { Block, BlockType } from '@/types';
import { nanoid } from '@/lib/nanoid';

// ─── Prompt suggestions ───────────────────────────────────────────────────────

const SUGGESTIONS = [
  'Un SaaS de gestion de projets avec pricing et FAQ',
  'Un site vitrine pour une agence de design créative',
  'Une landing page pour une application mobile fitness',
  'Un portfolio pour un photographe freelance',
  'Un site pour un restaurant gastronomique à Paris',
  'Une startup fintech avec section stats et témoignages',
];

// ─── Intent parser (simulated AI) ────────────────────────────────────────────

function parseIntent(prompt: string): { blocks: BlockType[]; name: string; category: string } {
  const lower = prompt.toLowerCase();
  const blocks: BlockType[] = ['navbar'];

  // Always starts with a hero
  blocks.push('hero');

  // Detect content based on keywords
  if (lower.includes('stat') || lower.includes('chiffre') || lower.includes('client')) blocks.push('stats');
  if (lower.includes('feature') || lower.includes('fonctionnalit') || lower.includes('service')) blocks.push('features');
  if (lower.includes('logo') || lower.includes('partenaire') || lower.includes('confiance')) blocks.push('logowall');
  if (lower.includes('temoignage') || lower.includes('avis') || lower.includes('client')) blocks.push('testimonials');
  if (lower.includes('prix') || lower.includes('tarif') || lower.includes('pricing') || lower.includes('abonnement')) blocks.push('pricing');
  if (lower.includes('faq') || lower.includes('question')) blocks.push('faq');

  // Always end with CTA + footer
  blocks.push('cta');
  blocks.push('footer');

  // Detect category for name generation
  let category = 'website';
  if (lower.includes('saas') || lower.includes('logiciel') || lower.includes('app')) category = 'SaaS';
  else if (lower.includes('agence') || lower.includes('studio') || lower.includes('créatif')) category = 'Agence';
  else if (lower.includes('portfolio') || lower.includes('photographe') || lower.includes('designer')) category = 'Portfolio';
  else if (lower.includes('restaurant') || lower.includes('café') || lower.includes('food')) category = 'Restaurant';
  else if (lower.includes('startup') || lower.includes('fintech') || lower.includes('tech')) category = 'Startup';

  const name = `${category} — Généré par IA`;
  return { blocks, name, category };
}

// ─── Generation steps ─────────────────────────────────────────────────────────

const STEPS = [
  { id: 'analyze', label: 'Analyse de votre description...', icon: Sparkles, duration: 1200 },
  { id: 'structure', label: 'Création de la structure...', icon: LayoutTemplate, duration: 1000 },
  { id: 'content', label: 'Génération du contenu...', icon: Zap, duration: 1400 },
  { id: 'style', label: 'Application du style...', icon: Palette, duration: 800 },
  { id: 'done', label: 'Site prêt !', icon: Check, duration: 0 },
];

type GenerationStep = 'idle' | 'generating' | 'done';

export default function GeneratePage() {
  const router = useRouter();
  const { addProject, setCurrentProject } = useEditorStore();

  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<GenerationStep>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  async function handleGenerate() {
    if (!prompt.trim() || status === 'generating') return;
    setStatus('generating');
    setCurrentStep(0);
    setCompletedSteps([]);

    // Simulate generation steps
    for (let i = 0; i < STEPS.length - 1; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, STEPS[i].duration));
      setCompletedSteps((prev) => [...prev, i]);
    }

    // Parse prompt and create project
    const { blocks: blockTypes, name } = parseIntent(prompt);
    const blocks: Block[] = blockTypes.map((type) => ({ ...createBlock(type), id: nanoid() }));

    const project = addProject(name, 'blank');
    // Override with generated blocks
    const { projects } = useEditorStore.getState();
    const pageId = projects.find((p) => p.id === project.id)?.pages[0]?.id;
    if (pageId) {
      blocks.forEach((block) => {
        useEditorStore.getState().addBlock(project.id, pageId, block);
      });
    }

    setCurrentStep(STEPS.length - 1);
    setCompletedSteps(STEPS.slice(0, -1).map((_, i) => i));
    setStatus('done');

    // Auto-redirect after 1.5s
    await new Promise((r) => setTimeout(r, 1500));
    setCurrentProject(project.id);
    router.push(`/editor/${project.id}`);
  }

  return (
    <AppShell>
      <div className="h-full flex flex-col">
        <div className="px-8 pt-8 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Générer avec l&apos;IA</h1>
          </div>
          <p className="text-sm text-white/40 mt-1 ml-11">Décrivez votre site en quelques mots, l&apos;IA construit tout.</p>
        </div>

        <div className="flex-1 overflow-auto flex items-start justify-center p-8">
          <div className="w-full max-w-2xl">
            {/* Input area */}
            <div className="glass rounded-2xl p-6 mb-6">
              <label className="block text-sm text-white/60 mb-3">
                Décrivez votre site web
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Un SaaS de gestion de projets avec une section fonctionnalités, des témoignages clients et des tarifs mensuels..."
                rows={5}
                disabled={status === 'generating'}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 text-sm leading-relaxed resize-none transition-colors disabled:opacity-50"
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-white/25">{prompt.length} caractères</span>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || status === 'generating'}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold text-sm transition-all disabled:opacity-40 shadow-lg shadow-violet-500/20"
                >
                  {status === 'generating' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Génération...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Générer le site</>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Generation progress */}
            <AnimatePresence>
              {status !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl p-6 mb-6"
                >
                  <h3 className="text-sm font-semibold text-white mb-4">Progression</h3>
                  <div className="space-y-3">
                    {STEPS.map((step, i) => {
                      const StepIcon = step.icon;
                      const isDone = completedSteps.includes(i) || (status === 'done' && i === STEPS.length - 1);
                      const isActive = currentStep === i && !isDone;

                      return (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0.3 }}
                          animate={{ opacity: isDone || isActive ? 1 : 0.3 }}
                          className="flex items-center gap-3"
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isDone ? 'bg-emerald-500/20' : isActive ? 'bg-violet-500/20' : 'bg-white/5'
                          }`}>
                            {isActive ? (
                              <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin" />
                            ) : isDone ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <StepIcon className="w-3.5 h-3.5 text-white/20" />
                            )}
                          </div>
                          <span className={`text-sm ${isDone ? 'text-emerald-400' : isActive ? 'text-white' : 'text-white/30'}`}>
                            {step.label}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {status === 'done' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center"
                    >
                      <p className="text-emerald-400 font-semibold text-sm">✓ Site généré avec succès !</p>
                      <p className="text-white/40 text-xs mt-1">Redirection vers l&apos;éditeur...</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Suggestions */}
            {status === 'idle' && (
              <div>
                <p className="text-xs text-white/30 mb-3 uppercase tracking-wider font-medium">Exemples de prompts</p>
                <div className="space-y-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setPrompt(s)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl glass hover:bg-white/6 text-left transition-all group"
                    >
                      <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">{s}</span>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Info cards */}
            {status === 'idle' && (
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { icon: Zap, title: '< 5 secondes', desc: 'Génération instantanée' },
                  { icon: LayoutTemplate, title: '10+ sections', desc: 'Structurées auto.' },
                  { icon: Globe, title: '100% éditable', desc: 'Personnalisez tout' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="glass rounded-xl p-4 text-center">
                    <Icon className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-white">{title}</p>
                    <p className="text-[10px] text-white/40 mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
