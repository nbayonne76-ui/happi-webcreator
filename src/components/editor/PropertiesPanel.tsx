'use client';

import { useState } from 'react';
import { X, ChevronDown, ChevronRight, Palette, Type, Layout } from 'lucide-react';
import { useEditorStore, useSelectedBlock, useCurrentProject } from '@/store/useEditorStore';

// ─── Reusable form components ─────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] text-white/40 uppercase tracking-wider font-medium">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, multiline }: {
  value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean;
}) {
  const cls = 'w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors resize-none';
  return multiline
    ? <textarea className={cls} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} />
    : <input className={cls} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />;
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/60">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-9 h-5 rounded-full transition-colors ${value ? 'bg-blue-500' : 'bg-white/10'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors appearance-none"
    >
      {options.map((o) => <option key={o.value} value={o.value} className="bg-gray-900">{o.label}</option>)}
    </select>
  );
}

function Section({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white/40 hover:text-white/60 transition-colors"
      >
        {title}
        {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>
      {open && <div className="px-4 pb-4 space-y-4">{children}</div>}
    </div>
  );
}

// ─── Block-specific property editors ─────────────────────────────────────────

function HeroProperties({ props, onChange }: { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }) {
  const p = props as Record<string, string>;
  return (
    <>
      <Section title="Contenu">
        <Field label="Badge"><TextInput value={p.badge ?? ''} onChange={(v) => onChange({ badge: v })} placeholder="✦ Nouveau" /></Field>
        <Field label="Titre principal"><TextInput value={p.title ?? ''} onChange={(v) => onChange({ title: v })} /></Field>
        <Field label="Titre en dégradé"><TextInput value={p.titleGradient ?? ''} onChange={(v) => onChange({ titleGradient: v })} /></Field>
        <Field label="Sous-titre"><TextInput value={p.subtitle ?? ''} onChange={(v) => onChange({ subtitle: v })} multiline /></Field>
      </Section>
      <Section title="Boutons">
        <Field label="CTA Principal"><TextInput value={p.ctaLabel ?? ''} onChange={(v) => onChange({ ctaLabel: v })} /></Field>
        <Field label="CTA Secondaire"><TextInput value={p.ctaSecondaryLabel ?? ''} onChange={(v) => onChange({ ctaSecondaryLabel: v })} /></Field>
      </Section>
      <Section title="Fond">
        <Field label="Variante">
          <Select
            value={(p.backgroundVariant as string) ?? 'mesh-blue'}
            onChange={(v) => onChange({ backgroundVariant: v })}
            options={[
              { value: 'mesh-blue', label: 'Mesh Bleu' },
              { value: 'mesh-purple', label: 'Mesh Violet' },
              { value: 'mesh-green', label: 'Mesh Vert' },
              { value: 'dark', label: 'Sombre' },
              { value: 'gradient', label: 'Dégradé' },
            ]}
          />
        </Field>
        <Toggle value={!!(props.showStats)} onChange={(v) => onChange({ showStats: v })} label="Afficher les stats" />
      </Section>
    </>
  );
}

function FeaturesProperties({ props, onChange }: { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }) {
  const p = props as Record<string, string>;
  return (
    <>
      <Section title="En-tête">
        <Field label="Badge"><TextInput value={p.badge ?? ''} onChange={(v) => onChange({ badge: v })} /></Field>
        <Field label="Titre"><TextInput value={p.title ?? ''} onChange={(v) => onChange({ title: v })} /></Field>
        <Field label="Sous-titre"><TextInput value={p.subtitle ?? ''} onChange={(v) => onChange({ subtitle: v })} multiline /></Field>
      </Section>
      <Section title="Mise en page">
        <Field label="Colonnes">
          <Select value={String(props.columns ?? 3)} onChange={(v) => onChange({ columns: parseInt(v) })} options={[
            { value: '2', label: '2 colonnes' },
            { value: '3', label: '3 colonnes' },
            { value: '4', label: '4 colonnes' },
          ]} />
        </Field>
        <Field label="Style carte">
          <Select value={(p.cardStyle as string) ?? 'glass'} onChange={(v) => onChange({ cardStyle: v })} options={[
            { value: 'glass', label: 'Glassmorphism' },
            { value: 'border', label: 'Avec bordure' },
            { value: 'filled', label: 'Remplie' },
          ]} />
        </Field>
      </Section>
    </>
  );
}

function NavbarProperties({ props, onChange }: { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }) {
  const p = props as Record<string, string | boolean>;
  return (
    <>
      <Section title="Logo">
        <Field label="Texte du logo"><TextInput value={p.logo as string ?? ''} onChange={(v) => onChange({ logo: v })} /></Field>
      </Section>
      <Section title="CTA">
        <Field label="Label CTA"><TextInput value={p.ctaLabel as string ?? ''} onChange={(v) => onChange({ ctaLabel: v })} /></Field>
        <Field label="Lien CTA"><TextInput value={p.ctaHref as string ?? '#'} onChange={(v) => onChange({ ctaHref: v })} /></Field>
      </Section>
      <Section title="Style">
        <Toggle value={!!p.transparent} onChange={(v) => onChange({ transparent: v })} label="Navigation transparente" />
      </Section>
    </>
  );
}

function CtaProperties({ props, onChange }: { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }) {
  const p = props as Record<string, string>;
  return (
    <>
      <Section title="Contenu">
        <Field label="Titre"><TextInput value={p.title ?? ''} onChange={(v) => onChange({ title: v })} /></Field>
        <Field label="Sous-titre"><TextInput value={p.subtitle ?? ''} onChange={(v) => onChange({ subtitle: v })} multiline /></Field>
        <Field label="CTA Principal"><TextInput value={p.ctaLabel ?? ''} onChange={(v) => onChange({ ctaLabel: v })} /></Field>
        <Field label="CTA Secondaire"><TextInput value={p.ctaSecondaryLabel ?? ''} onChange={(v) => onChange({ ctaSecondaryLabel: v })} /></Field>
      </Section>
      <Section title="Style">
        <Field label="Variante">
          <Select value={p.variant ?? 'gradient'} onChange={(v) => onChange({ variant: v })} options={[
            { value: 'gradient', label: 'Dégradé' },
            { value: 'glass', label: 'Glass' },
            { value: 'dark', label: 'Sombre' },
          ]} />
        </Field>
      </Section>
    </>
  );
}

function FaqProperties({ props, onChange }: { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }) {
  const p = props as { badge: string; title: string; items: { question: string; answer: string }[] };
  return (
    <>
      <Section title="En-tête">
        <Field label="Badge"><TextInput value={p.badge ?? ''} onChange={(v) => onChange({ badge: v })} /></Field>
        <Field label="Titre"><TextInput value={p.title ?? ''} onChange={(v) => onChange({ title: v })} /></Field>
      </Section>
      <Section title="Questions" defaultOpen={false}>
        {(p.items ?? []).map((item, i) => (
          <div key={i} className="space-y-2 p-3 bg-white/3 rounded-xl">
            <Field label={`Q${i + 1}`}><TextInput value={item.question} onChange={(v) => {
              const items = [...(p.items ?? [])];
              items[i] = { ...items[i], question: v };
              onChange({ items });
            }} /></Field>
            <Field label="Réponse"><TextInput value={item.answer} onChange={(v) => {
              const items = [...(p.items ?? [])];
              items[i] = { ...items[i], answer: v };
              onChange({ items });
            }} multiline /></Field>
          </div>
        ))}
      </Section>
    </>
  );
}

function TextProperties({ props, onChange }: { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }) {
  const p = props as Record<string, string>;
  return (
    <>
      <Section title="Contenu">
        <Field label="Texte"><TextInput value={p.content ?? ''} onChange={(v) => onChange({ content: v })} multiline /></Field>
      </Section>
      <Section title="Style">
        <Field label="Alignement">
          <Select value={p.align ?? 'left'} onChange={(v) => onChange({ align: v })} options={[
            { value: 'left', label: 'Gauche' },
            { value: 'center', label: 'Centre' },
            { value: 'right', label: 'Droite' },
          ]} />
        </Field>
        <Field label="Taille">
          <Select value={p.size ?? 'md'} onChange={(v) => onChange({ size: v })} options={[
            { value: 'sm', label: 'Petit' },
            { value: 'md', label: 'Moyen' },
            { value: 'lg', label: 'Grand' },
            { value: 'xl', label: 'Très grand' },
          ]} />
        </Field>
      </Section>
    </>
  );
}

function GenericProperties({ blockType }: { blockType: string }) {
  return (
    <div className="p-4 text-sm text-white/40 text-center py-8">
      <Layout className="w-6 h-6 mx-auto mb-2 opacity-30" />
      Propriétés pour « {blockType} »<br />
      <span className="text-xs">Bientôt disponible</span>
    </div>
  );
}

// ─── Theme panel ──────────────────────────────────────────────────────────────

const COLORS = ['blue', 'violet', 'emerald', 'rose', 'amber', 'cyan'] as const;
const FONTS = ['Inter', 'Geist', 'Poppins', 'DM Sans', 'Outfit', 'Syne'];
const COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-500', violet: 'bg-violet-500', emerald: 'bg-emerald-500',
  rose: 'bg-rose-500', amber: 'bg-amber-500', cyan: 'bg-cyan-500',
};

function ThemePanel() {
  const project = useCurrentProject();
  const { updateTheme, currentProjectId } = useEditorStore();
  if (!project || !currentProjectId) return null;

  return (
    <>
      <Section title="Couleur principale">
        <div className="flex gap-2 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => updateTheme(currentProjectId, { primaryColor: c })}
              className={`w-8 h-8 rounded-lg ${COLOR_MAP[c]} ${project.theme.primaryColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-950' : ''} transition-all`}
            />
          ))}
        </div>
      </Section>
      <Section title="Typographie">
        <Field label="Police">
          <Select
            value={project.theme.fontFamily}
            onChange={(v) => updateTheme(currentProjectId, { fontFamily: v })}
            options={FONTS.map((f) => ({ value: f, label: f }))}
          />
        </Field>
      </Section>
      <Section title="Bordures">
        <Field label="Arrondi">
          <Select
            value={project.theme.borderRadius}
            onChange={(v) => updateTheme(currentProjectId, { borderRadius: v as 'none' | 'sm' | 'md' | 'lg' | 'full' })}
            options={[
              { value: 'none', label: 'Aucun' },
              { value: 'sm', label: 'Petit' },
              { value: 'md', label: 'Moyen' },
              { value: 'lg', label: 'Grand' },
              { value: 'full', label: 'Complet' },
            ]}
          />
        </Field>
      </Section>
    </>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

type PanelTab = 'properties' | 'theme';

export default function PropertiesPanel() {
  const [tab, setTab] = useState<PanelTab>('properties');
  const block = useSelectedBlock();
  const { selectBlock, currentProjectId, currentPageId, updateBlock } = useEditorStore();

  function handleChange(partialProps: Record<string, unknown>) {
    if (!block || !currentProjectId || !currentPageId) return;
    updateBlock(currentProjectId, currentPageId, block.id, partialProps);
  }

  return (
    <aside className="w-[280px] border-l border-white/5 flex flex-col h-full shrink-0 bg-gray-950/80">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
        <div className="flex gap-1">
          {([['properties', Layout, 'Propriétés'], ['theme', Palette, 'Thème']] as const).map(([id, Icon, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tab === id ? 'bg-white/8 text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
        {block && (
          <button
            onClick={() => selectBlock(null)}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'theme' ? (
          <ThemePanel />
        ) : block ? (
          <div>
            {/* Block label */}
            <div className="px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-500/15 flex items-center justify-center">
                  <Type className="w-3 h-3 text-blue-400" />
                </div>
                <span className="text-sm font-medium text-white capitalize">{block.type}</span>
                <span className="text-xs text-white/25 ml-auto font-mono">{block.id.slice(0, 6)}</span>
              </div>
            </div>

            {/* Block-specific editor */}
            {block.type === 'hero' && <HeroProperties props={block.props} onChange={handleChange} />}
            {block.type === 'features' && <FeaturesProperties props={block.props} onChange={handleChange} />}
            {block.type === 'navbar' && <NavbarProperties props={block.props} onChange={handleChange} />}
            {block.type === 'cta' && <CtaProperties props={block.props} onChange={handleChange} />}
            {block.type === 'faq' && <FaqProperties props={block.props} onChange={handleChange} />}
            {block.type === 'text' && <TextProperties props={block.props} onChange={handleChange} />}
            {!['hero', 'features', 'navbar', 'cta', 'faq', 'text'].includes(block.type) && (
              <GenericProperties blockType={block.type} />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-6">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <Layout className="w-5 h-5 text-white/20" />
            </div>
            <p className="text-xs text-white/30 leading-relaxed">
              Sélectionnez une section<br />pour modifier ses propriétés
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
