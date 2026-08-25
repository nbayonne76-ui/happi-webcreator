'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowRight, Loader2, Check, ChevronRight,
  Globe, Zap, LayoutTemplate, Palette, AlertCircle, Wand2,
} from 'lucide-react';
import AppShell from '@/components/ui/AppShell';
import { useEditorStore } from '@/store/useEditorStore';
import { createBlock } from '@/lib/defaults';
import { Block, BlockType } from '@/types';
import { nanoid } from '@/lib/nanoid';

// ─── Suggestions par secteur ──────────────────────────────────────────────────

const SUGGESTIONS = [
  { label: 'SaaS', prompt: 'Un SaaS de gestion de projets en équipe avec pricing mensuel, fonctionnalités collaboratives et témoignages clients' },
  { label: 'Agence', prompt: 'Une agence de design créative parisienne spécialisée en branding et identité visuelle pour startups' },
  { label: 'Startup', prompt: 'Une startup fintech qui révolutionne les paiements B2B en Europe avec IA intégrée' },
  { label: 'Portfolio', prompt: 'Un portfolio pour un photographe de mode et portrait basé à Paris avec galerie et contact' },
  { label: 'Restaurant', prompt: 'Un restaurant gastronomique japonais fusion à Lyon avec menu dégustation et réservation en ligne' },
  { label: 'App Mobile', prompt: 'Une app mobile fitness de coaching personnalisé par IA avec plans d\'entraînement et suivi nutritionnel' },
];

// ─── Fallback client-side (si pas d'API key) ─────────────────────────────────

function parseIntentFallback(prompt: string): { blocks: BlockType[]; name: string; templateId: string } {
  const lower = prompt.toLowerCase();
  const blocks: BlockType[] = ['navbar', 'hero'];
  if (lower.includes('stat') || lower.includes('chiffre')) blocks.push('stats');
  if (lower.includes('feature') || lower.includes('fonctionnalit') || lower.includes('service')) blocks.push('features');
  if (lower.includes('logo') || lower.includes('partenaire')) blocks.push('logowall');
  if (lower.includes('temoignage') || lower.includes('avis')) blocks.push('testimonials');
  if (lower.includes('prix') || lower.includes('tarif') || lower.includes('pricing')) blocks.push('pricing');
  if (lower.includes('faq') || lower.includes('question')) blocks.push('faq');
  blocks.push('cta', 'footer');
  let templateId = 'saas-landing';
  if (lower.includes('restaurant') || lower.includes('food')) templateId = 'restaurant';
  else if (lower.includes('portfolio') || lower.includes('photographe')) templateId = 'portfolio';
  else if (lower.includes('agence') || lower.includes('studio')) templateId = 'agency';
  else if (lower.includes('startup')) templateId = 'startup';
  return { blocks, name: 'Site — Généré par IA', templateId };
}

// ─── Steps UI ─────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 'analyze',   label: 'Analyse de votre description...', icon: Sparkles,       duration: 800  },
  { id: 'structure', label: 'Architecture de la page...',       icon: LayoutTemplate, duration: 600  },
  { id: 'content',   label: 'Génération du contenu avec IA...', icon: Wand2,          duration: 3000 },
  { id: 'style',     label: 'Application du style...',          icon: Palette,        duration: 500  },
  { id: 'done',      label: 'Site prêt !',                      icon: Check,          duration: 0    },
];

type GenerationStep = 'idle' | 'generating' | 'done' | 'error';

export default function GeneratePage() {
  const router = useRouter();
  const { addProject, setCurrentProject } = useEditorStore();

  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<GenerationStep>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [usedFallback, setUsedFallback] = useState(false);

  async function handleGenerate() {
    if (!prompt.trim() || status === 'generating') return;
    setStatus('generating');
    setCurrentStep(0);
    setCompletedSteps([]);
    setErrorMsg('');
    setUsedFallback(false);

    // Steps 0-1 run while we prepare
    setCurrentStep(0);
    await new Promise((r) => setTimeout(r, STEPS[0].duration));
    setCompletedSteps([0]);
    setCurrentStep(1);
    await new Promise((r) => setTimeout(r, STEPS[1].duration));
    setCompletedSteps([0, 1]);

    // Step 2 — real AI call
    setCurrentStep(2);

    let blockDefs: { type: string; props: Record<string, unknown> }[] = [];
    let projectName = 'Site — Généré par IA';
    let templateId  = 'saas-landing';

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        // Fallback to keyword parsing if API unavailable
        if (data.error?.includes('non configurée') || res.status === 503) {
          setUsedFallback(true);
          const fallback = parseIntentFallback(prompt);
          blockDefs = fallback.blocks.map((type) => ({ type, props: createBlock(type).props }));
          projectName = fallback.name;
          templateId  = fallback.templateId;
        } else {
          throw new Error(data.error || 'Erreur API');
        }
      } else {
        blockDefs  = data.blocks ?? [];
        projectName = data.name ?? projectName;
        templateId  = data.templateId ?? templateId;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      // Non-503 errors: show error
      setStatus('error');
      setErrorMsg(msg);
      return;
    }

    await new Promise((r) => setTimeout(r, 500));
    setCompletedSteps([0, 1, 2]);

    // Step 3 — apply style
    setCurrentStep(3);
    await new Promise((r) => setTimeout(r, STEPS[3].duration));
    setCompletedSteps([0, 1, 2, 3]);

    // Build blocks — always use 'blank' to avoid template blocks being added too
    const blocks: Block[] = blockDefs.map((bd) => ({
      id:    nanoid(),
      type:  bd.type as BlockType,
      // Merge AI-generated props over default props so missing fields are filled
      props: { ...createBlock(bd.type as BlockType).props, ...(bd.props ?? {}) },
    }));

    // Create empty project, then populate with AI-generated blocks only
    const project = addProject(projectName, 'blank');
    // Update templateId for dashboard thumbnail color without adding template blocks
    useEditorStore.setState((s) => ({
      projects: s.projects.map((p) =>
        p.id === project.id ? { ...p, templateId } : p
      ),
    }));
    const store  = useEditorStore.getState();
    const pageId = store.projects.find((p) => p.id === project.id)?.pages[0]?.id;
    if (pageId) {
      blocks.forEach((block) => store.addBlock(project.id, pageId, block));
    }

    setCurrentStep(4);
    setCompletedSteps([0, 1, 2, 3, 4]);
    setStatus('done');

    await new Promise((r) => setTimeout(r, 1500));
    setCurrentProject(project.id);
    router.push(`/editor/${project.id}`);
  }

  return (
    <AppShell>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Générer avec l&apos;IA</h1>
          </div>
          <p className="text-sm text-white/40 mt-1 ml-11">
            Décrivez votre activité — Claude génère un site complet avec textes, stats et témoignages réels.
          </p>
        </div>

        <div className="flex-1 overflow-auto flex items-start justify-center p-8">
          <div className="w-full max-w-2xl">

            {/* Input */}
            <div className="glass rounded-2xl p-6 mb-6">
              <label className="block text-sm text-white/60 mb-3">Décrivez votre site web</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleGenerate(); }}
                placeholder="Ex: Un SaaS B2B de gestion des dépenses pour PME avec intégration bancaire automatique, pricing par équipe et onboarding guidé..."
                rows={5}
                disabled={status === 'generating'}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 text-sm leading-relaxed resize-none transition-colors disabled:opacity-50"
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-white/25">{prompt.length} car. · Ctrl+Enter pour générer</span>
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

            {/* Progress */}
            <AnimatePresence>
              {status === 'generating' || status === 'done' ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl p-6 mb-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white">Génération en cours</h3>
                    {usedFallback && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        Mode hors-ligne
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    {STEPS.map((step, i) => {
                      const StepIcon  = step.icon;
                      const isDone    = completedSteps.includes(i) || (status === 'done' && i === STEPS.length - 1);
                      const isActive  = currentStep === i && !isDone;
                      return (
                        <motion.div key={step.id} initial={{ opacity: 0.3 }} animate={{ opacity: isDone || isActive ? 1 : 0.3 }} className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isDone ? 'bg-emerald-500/20' : isActive ? 'bg-violet-500/20' : 'bg-white/5'}`}>
                            {isActive ? <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin" /> : isDone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <StepIcon className="w-3.5 h-3.5 text-white/20" />}
                          </div>
                          <span className={`text-sm ${isDone ? 'text-emerald-400' : isActive ? 'text-white' : 'text-white/30'}`}>{step.label}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                  {status === 'done' && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                      <p className="text-emerald-400 font-semibold text-sm">✓ Site généré avec succès !</p>
                      <p className="text-white/40 text-xs mt-1">Redirection vers l&apos;éditeur...</p>
                    </motion.div>
                  )}
                </motion.div>
              ) : status === 'error' ? (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5 mb-6 border border-red-500/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-400 mb-1">Erreur de génération</p>
                      <p className="text-xs text-white/50">{errorMsg}</p>
                      <button onClick={() => setStatus('idle')} className="mt-3 text-xs text-white/40 hover:text-white transition-colors underline">Réessayer</button>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Suggestions */}
            {status === 'idle' && (
              <>
                <p className="text-xs text-white/30 mb-3 uppercase tracking-wider font-medium">Exemples par secteur</p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setPrompt(s.prompt)}
                      className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl glass hover:bg-white/6 text-left transition-all group"
                    >
                      <div>
                        <span className="text-xs font-semibold text-violet-400 block mb-0.5">{s.label}</span>
                        <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors line-clamp-2">{s.prompt}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>

                {/* Feature badges */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Wand2,          title: 'Claude IA',        desc: 'Contenu 100% réel généré' },
                    { icon: LayoutTemplate, title: '10+ sections',     desc: 'Structurées intelligemment' },
                    { icon: Globe,          title: '100% éditable',    desc: 'Personnalisez tout ensuite' },
                    { icon: Sparkles,       title: 'Textes adaptés',   desc: 'Selon votre secteur' },
                    { icon: Zap,            title: '< 10 secondes',    desc: 'Génération rapide' },
                    { icon: Palette,        title: 'Design pro',       desc: 'Templates haute-conversion' },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="glass rounded-xl p-4 text-center">
                      <Icon className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-white">{title}</p>
                      <p className="text-[10px] text-white/40 mt-0.5">{desc}</p>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-white/20 text-center mt-4 flex items-center justify-center gap-1.5">
                  <ArrowRight className="w-3 h-3" />
                  Nécessite une clé <code className="bg-white/5 px-1 rounded">ANTHROPIC_API_KEY</code> dans <code className="bg-white/5 px-1 rounded">.env.local</code>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
