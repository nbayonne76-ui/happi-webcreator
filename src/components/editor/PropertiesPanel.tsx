'use client';

import { useState } from 'react';
import { X, ChevronDown, ChevronRight, Palette, Type, Layout, Plus, Trash2 } from 'lucide-react';
import { useEditorStore, useSelectedBlock, useCurrentProject } from '@/store/useEditorStore';
import { BG_OPTIONS, PADDING_OPTIONS, WIDTH_OPTIONS } from '@/lib/blockStyles';

// ─── Reusable form atoms ───────────────────────────────────────────────────────

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

function NumberInput({ value, onChange, min, max }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <input
      type="number" min={min} max={max} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
    />
  );
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

// ─── Layout panel (universal — every block) ───────────────────────────────────

function LayoutPanel({ props, onChange }: { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }) {
  const bg = (props.bg as string) ?? 'gray-950';

  return (
    <Section title="Mise en page">
      {/* Background color picker */}
      <Field label="Couleur de fond">
        <div className="space-y-2">
          {/* Dark */}
          <p className="text-[10px] text-white/25 uppercase tracking-wider">Sombres</p>
          <div className="flex flex-wrap gap-2">
            {BG_OPTIONS.filter((o) => !o.isLight && !o.value.startsWith('grad')).map((opt) => (
              <button
                key={opt.value}
                title={opt.label}
                onClick={() => onChange({ bg: opt.value })}
                className={`w-7 h-7 rounded-lg border-2 transition-all shrink-0 ${bg === opt.value ? 'border-blue-400 scale-110' : 'border-transparent hover:border-white/30'}`}
                style={{ background: opt.swatch }}
              />
            ))}
          </div>
          {/* Light */}
          <p className="text-[10px] text-white/25 uppercase tracking-wider">Clairs</p>
          <div className="flex flex-wrap gap-2">
            {BG_OPTIONS.filter((o) => o.isLight).map((opt) => (
              <button
                key={opt.value}
                title={opt.label}
                onClick={() => onChange({ bg: opt.value })}
                className={`w-7 h-7 rounded-lg border-2 transition-all shrink-0 ${bg === opt.value ? 'border-blue-400 scale-110' : 'border-white/20 hover:border-white/50'}`}
                style={{ background: opt.swatch }}
              />
            ))}
          </div>
          {/* Gradients */}
          <p className="text-[10px] text-white/25 uppercase tracking-wider">Dégradés</p>
          <div className="flex flex-wrap gap-2">
            {BG_OPTIONS.filter((o) => o.value.startsWith('grad')).map((opt) => (
              <button
                key={opt.value}
                title={opt.label}
                onClick={() => onChange({ bg: opt.value })}
                className={`w-7 h-7 rounded-lg border-2 transition-all shrink-0 ${bg === opt.value ? 'border-blue-400 scale-110' : 'border-transparent hover:border-white/30'}`}
                style={{ background: opt.swatch }}
              />
            ))}
          </div>
          {/* Current label */}
          <p className="text-xs text-white/40 mt-1">
            {BG_OPTIONS.find((o) => o.value === bg)?.label ?? bg}
          </p>
        </div>
      </Field>

      {/* Padding */}
      <Field label="Espacement vertical">
        <div className="flex gap-1.5 flex-wrap">
          {PADDING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ paddingY: opt.value })}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                (props.paddingY ?? 'md') === opt.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Field>

      {/* Content width */}
      <Field label="Largeur du contenu">
        <div className="flex gap-1.5 flex-wrap">
          {WIDTH_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ contentWidth: opt.value })}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                (props.contentWidth ?? 'boxed') === opt.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Field>
    </Section>
  );
}

// ─── Block-specific editors ────────────────────────────────────────────────────

function HeroProperties({ props, onChange }: { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }) {
  const p = props as Record<string, string | boolean | { value: string; label: string }[]>;
  const stats = (p.stats as { value: string; label: string }[]) ?? [];
  return (
    <>
      <Section title="Contenu">
        <Field label="Badge"><TextInput value={p.badge as string ?? ''} onChange={(v) => onChange({ badge: v })} placeholder="✦ Nouveau" /></Field>
        <Field label="Titre principal"><TextInput value={p.title as string ?? ''} onChange={(v) => onChange({ title: v })} /></Field>
        <Field label="Titre en dégradé"><TextInput value={p.titleGradient as string ?? ''} onChange={(v) => onChange({ titleGradient: v })} /></Field>
        <Field label="Sous-titre"><TextInput value={p.subtitle as string ?? ''} onChange={(v) => onChange({ subtitle: v })} multiline /></Field>
      </Section>
      <Section title="Boutons">
        <Field label="CTA Principal"><TextInput value={p.ctaLabel as string ?? ''} onChange={(v) => onChange({ ctaLabel: v })} /></Field>
        <Field label="CTA Secondaire"><TextInput value={p.ctaSecondaryLabel as string ?? ''} onChange={(v) => onChange({ ctaSecondaryLabel: v })} /></Field>
      </Section>
      <Section title="Fond animé">
        <Field label="Style des blobs">
          <Select
            value={(p.backgroundVariant as string) ?? 'mesh-blue'}
            onChange={(v) => onChange({ backgroundVariant: v })}
            options={[
              { value: 'mesh-blue',   label: 'Bleu' },
              { value: 'mesh-purple', label: 'Violet' },
              { value: 'mesh-green',  label: 'Vert' },
              { value: 'dark',        label: 'Neutre' },
              { value: 'gradient',    label: 'Dégradé' },
            ]}
          />
        </Field>
        <Toggle value={!!(props.showStats)} onChange={(v) => onChange({ showStats: v })} label="Afficher les stats" />
      </Section>
      {!!(props.showStats) && (
        <Section title="Stats" defaultOpen={false}>
          {stats.map((s, i) => (
            <div key={i} className="flex gap-2">
              <TextInput value={s.value} onChange={(v) => {
                const next = [...stats]; next[i] = { ...next[i], value: v }; onChange({ stats: next });
              }} placeholder="10k+" />
              <TextInput value={s.label} onChange={(v) => {
                const next = [...stats]; next[i] = { ...next[i], label: v }; onChange({ stats: next });
              }} placeholder="Label" />
            </div>
          ))}
        </Section>
      )}
      <LayoutPanel props={props} onChange={onChange} />
    </>
  );
}

function NavbarProperties({ props, onChange }: { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }) {
  const p = props as { logo: string; links: { label: string; href: string }[]; ctaLabel: string; transparent: boolean };
  const links = p.links ?? [];
  return (
    <>
      <Section title="Logo">
        <Field label="Nom du site"><TextInput value={p.logo ?? ''} onChange={(v) => onChange({ logo: v })} /></Field>
      </Section>
      <Section title="Navigation">
        {links.map((link, i) => (
          <div key={i} className="flex items-center gap-2">
            <TextInput value={link.label} onChange={(v) => {
              const next = [...links]; next[i] = { ...next[i], label: v }; onChange({ links: next });
            }} placeholder="Label" />
            <TextInput value={link.href} onChange={(v) => {
              const next = [...links]; next[i] = { ...next[i], href: v }; onChange({ links: next });
            }} placeholder="#section" />
            <button
              onClick={() => onChange({ links: links.filter((_, j) => j !== i) })}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-all shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange({ links: [...links, { label: 'Lien', href: '#' }] })}
          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Ajouter un lien
        </button>
      </Section>
      <Section title="CTA">
        <Field label="Label CTA"><TextInput value={p.ctaLabel ?? ''} onChange={(v) => onChange({ ctaLabel: v })} /></Field>
      </Section>
      <Section title="Style">
        <Toggle value={!!p.transparent} onChange={(v) => onChange({ transparent: v })} label="Navigation transparente" />
      </Section>
      <Section title="Fond">
        <Field label="Couleur de fond">
          <div className="flex flex-wrap gap-2">
            {BG_OPTIONS.filter((o) => !o.value.startsWith('grad')).map((opt) => (
              <button
                key={opt.value}
                title={opt.label}
                onClick={() => onChange({ bg: opt.value })}
                className={`w-7 h-7 rounded-lg border-2 transition-all shrink-0 ${
                  ((props.bg as string) ?? 'gray-950') === opt.value
                    ? 'border-blue-400 scale-110'
                    : 'border-transparent hover:border-white/30'
                }`}
                style={{ background: opt.swatch }}
              />
            ))}
          </div>
        </Field>
      </Section>
    </>
  );
}

function FeaturesProperties({ props, onChange }: { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }) {
  const p = props as { badge: string; title: string; subtitle: string; columns: number; cardStyle: string; items: { icon: string; title: string; description: string }[] };
  const items = p.items ?? [];
  const ICONS = ['Zap', 'Shield', 'Globe', 'Sparkles', 'BarChart3', 'Puzzle', 'Star', 'Heart', 'Lock', 'Cpu', 'Mail', 'Phone'];
  return (
    <>
      <Section title="En-tête">
        <Field label="Badge"><TextInput value={p.badge ?? ''} onChange={(v) => onChange({ badge: v })} /></Field>
        <Field label="Titre"><TextInput value={p.title ?? ''} onChange={(v) => onChange({ title: v })} /></Field>
        <Field label="Sous-titre"><TextInput value={p.subtitle ?? ''} onChange={(v) => onChange({ subtitle: v })} multiline /></Field>
      </Section>
      <Section title="Mise en page">
        <Field label="Colonnes">
          <Select value={String(p.columns ?? 3)} onChange={(v) => onChange({ columns: parseInt(v) })} options={[
            { value: '2', label: '2 colonnes' },
            { value: '3', label: '3 colonnes' },
            { value: '4', label: '4 colonnes' },
          ]} />
        </Field>
        <Field label="Style carte">
          <Select value={p.cardStyle ?? 'glass'} onChange={(v) => onChange({ cardStyle: v })} options={[
            { value: 'glass',  label: 'Glassmorphism' },
            { value: 'border', label: 'Avec bordure' },
            { value: 'filled', label: 'Remplie' },
          ]} />
        </Field>
      </Section>
      <Section title={`Éléments (${items.length})`} defaultOpen={false}>
        {items.map((item, i) => (
          <div key={i} className="space-y-2 p-3 bg-white/3 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Élément {i + 1}</span>
              <button
                onClick={() => onChange({ items: items.filter((_, j) => j !== i) })}
                className="w-6 h-6 rounded flex items-center justify-center text-white/20 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <Field label="Icône">
              <Select value={item.icon ?? 'Zap'} onChange={(v) => {
                const next = [...items]; next[i] = { ...next[i], icon: v }; onChange({ items: next });
              }} options={ICONS.map((ic) => ({ value: ic, label: ic }))} />
            </Field>
            <Field label="Titre"><TextInput value={item.title} onChange={(v) => {
              const next = [...items]; next[i] = { ...next[i], title: v }; onChange({ items: next });
            }} /></Field>
            <Field label="Description"><TextInput value={item.description} onChange={(v) => {
              const next = [...items]; next[i] = { ...next[i], description: v }; onChange({ items: next });
            }} multiline /></Field>
          </div>
        ))}
        <button
          onClick={() => onChange({ items: [...items, { icon: 'Zap', title: 'Nouveau', description: 'Description...' }] })}
          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Ajouter un élément
        </button>
      </Section>
      <LayoutPanel props={props} onChange={onChange} />
    </>
  );
}

function StatsProperties({ props, onChange }: { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }) {
  const p = props as { items: { value: string; label: string; sublabel?: string }[]; variant: string };
  const items = p.items ?? [];
  return (
    <>
      <Section title="Style">
        <Field label="Disposition">
          <Select value={p.variant ?? 'row'} onChange={(v) => onChange({ variant: v })} options={[
            { value: 'row',  label: 'Ligne' },
            { value: 'grid', label: 'Grille 2×2' },
          ]} />
        </Field>
      </Section>
      <Section title={`Statistiques (${items.length})`}>
        {items.map((item, i) => (
          <div key={i} className="space-y-2 p-3 bg-white/3 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Stat {i + 1}</span>
              <button onClick={() => onChange({ items: items.filter((_, j) => j !== i) })} className="w-6 h-6 rounded flex items-center justify-center text-white/20 hover:text-rose-400 transition-colors">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <Field label="Valeur"><TextInput value={item.value} onChange={(v) => { const n = [...items]; n[i] = { ...n[i], value: v }; onChange({ items: n }); }} placeholder="10k+" /></Field>
            <Field label="Label"><TextInput value={item.label} onChange={(v) => { const n = [...items]; n[i] = { ...n[i], label: v }; onChange({ items: n }); }} /></Field>
            <Field label="Sous-label"><TextInput value={item.sublabel ?? ''} onChange={(v) => { const n = [...items]; n[i] = { ...n[i], sublabel: v }; onChange({ items: n }); }} /></Field>
          </div>
        ))}
        <button onClick={() => onChange({ items: [...items, { value: '0', label: 'Nouvelle stat' }] })} className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Ajouter
        </button>
      </Section>
      <LayoutPanel props={props} onChange={onChange} />
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
            { value: 'glass',    label: 'Glass' },
            { value: 'dark',     label: 'Sombre' },
          ]} />
        </Field>
      </Section>
      <LayoutPanel props={props} onChange={onChange} />
    </>
  );
}

function PricingProperties({ props, onChange }: { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }) {
  const p = props as { badge: string; title: string; subtitle: string; plans: { label: string; title: string; monthlyPrice: number; color: string; popular: boolean; features: string[] }[] };
  const plans = p.plans ?? [];
  return (
    <>
      <Section title="En-tête">
        <Field label="Badge"><TextInput value={p.badge ?? ''} onChange={(v) => onChange({ badge: v })} /></Field>
        <Field label="Titre"><TextInput value={p.title ?? ''} onChange={(v) => onChange({ title: v })} /></Field>
        <Field label="Sous-titre"><TextInput value={p.subtitle ?? ''} onChange={(v) => onChange({ subtitle: v })} multiline /></Field>
      </Section>
      <Section title={`Plans (${plans.length})`} defaultOpen={false}>
        {plans.map((plan, i) => (
          <div key={i} className="space-y-2 p-3 bg-white/3 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Plan {i + 1}</span>
              <button onClick={() => onChange({ plans: plans.filter((_, j) => j !== i) })} className="w-6 h-6 rounded flex items-center justify-center text-white/20 hover:text-rose-400 transition-colors">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <Field label="Nom du plan"><TextInput value={plan.label} onChange={(v) => { const n = [...plans]; n[i] = { ...n[i], label: v }; onChange({ plans: n }); }} /></Field>
            <Field label="Description"><TextInput value={plan.title} onChange={(v) => { const n = [...plans]; n[i] = { ...n[i], title: v }; onChange({ plans: n }); }} /></Field>
            <Field label="Prix/mois (€)"><NumberInput value={plan.monthlyPrice} onChange={(v) => { const n = [...plans]; n[i] = { ...n[i], monthlyPrice: v }; onChange({ plans: n }); }} min={0} /></Field>
            <Field label="Couleur">
              <Select value={plan.color} onChange={(v) => { const n = [...plans]; n[i] = { ...n[i], color: v }; onChange({ plans: n }); }} options={[
                { value: 'blue',   label: 'Bleu' },
                { value: 'green',  label: 'Vert' },
                { value: 'purple', label: 'Violet' },
              ]} />
            </Field>
            <Toggle value={plan.popular} onChange={(v) => { const n = [...plans]; n[i] = { ...n[i], popular: v }; onChange({ plans: n }); }} label="Populaire" />
          </div>
        ))}
        <button onClick={() => onChange({ plans: [...plans, { label: 'Nouveau', title: 'Plan', monthlyPrice: 0, annualPrice: 0, color: 'blue', popular: false, features: [] }] })} className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Ajouter un plan
        </button>
      </Section>
      <LayoutPanel props={props} onChange={onChange} />
    </>
  );
}

function FaqProperties({ props, onChange }: { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }) {
  const p = props as { badge: string; title: string; items: { question: string; answer: string }[] };
  const items = p.items ?? [];
  return (
    <>
      <Section title="En-tête">
        <Field label="Badge"><TextInput value={p.badge ?? ''} onChange={(v) => onChange({ badge: v })} /></Field>
        <Field label="Titre"><TextInput value={p.title ?? ''} onChange={(v) => onChange({ title: v })} /></Field>
      </Section>
      <Section title={`Questions (${items.length})`} defaultOpen={false}>
        {items.map((item, i) => (
          <div key={i} className="space-y-2 p-3 bg-white/3 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Q{i + 1}</span>
              <button onClick={() => onChange({ items: items.filter((_, j) => j !== i) })} className="w-6 h-6 rounded flex items-center justify-center text-white/20 hover:text-rose-400 transition-colors">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <Field label="Question"><TextInput value={item.question} onChange={(v) => { const n = [...items]; n[i] = { ...n[i], question: v }; onChange({ items: n }); }} /></Field>
            <Field label="Réponse"><TextInput value={item.answer} onChange={(v) => { const n = [...items]; n[i] = { ...n[i], answer: v }; onChange({ items: n }); }} multiline /></Field>
          </div>
        ))}
        <button onClick={() => onChange({ items: [...items, { question: 'Nouvelle question ?', answer: 'Votre réponse ici.' }] })} className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Ajouter une question
        </button>
      </Section>
      <LayoutPanel props={props} onChange={onChange} />
    </>
  );
}

function TestimonialsProperties({ props, onChange }: { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }) {
  const p = props as { badge: string; title: string; items: { name: string; role: string; company: string; avatar: string; text: string }[] };
  const items = p.items ?? [];
  return (
    <>
      <Section title="En-tête">
        <Field label="Badge"><TextInput value={p.badge ?? ''} onChange={(v) => onChange({ badge: v })} /></Field>
        <Field label="Titre"><TextInput value={p.title ?? ''} onChange={(v) => onChange({ title: v })} /></Field>
      </Section>
      <Section title={`Témoignages (${items.length})`} defaultOpen={false}>
        {items.map((item, i) => (
          <div key={i} className="space-y-2 p-3 bg-white/3 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">#{i + 1}</span>
              <button onClick={() => onChange({ items: items.filter((_, j) => j !== i) })} className="w-6 h-6 rounded flex items-center justify-center text-white/20 hover:text-rose-400 transition-colors">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <Field label="Nom"><TextInput value={item.name} onChange={(v) => { const n = [...items]; n[i] = { ...n[i], name: v }; onChange({ items: n }); }} /></Field>
            <Field label="Rôle"><TextInput value={item.role} onChange={(v) => { const n = [...items]; n[i] = { ...n[i], role: v }; onChange({ items: n }); }} /></Field>
            <Field label="Entreprise"><TextInput value={item.company} onChange={(v) => { const n = [...items]; n[i] = { ...n[i], company: v }; onChange({ items: n }); }} /></Field>
            <Field label="Texte"><TextInput value={item.text} onChange={(v) => { const n = [...items]; n[i] = { ...n[i], text: v }; onChange({ items: n }); }} multiline /></Field>
          </div>
        ))}
        <button onClick={() => onChange({ items: [...items, { name: 'Nouveau', role: 'Rôle', company: 'Entreprise', avatar: '', text: 'Excellent produit !' }] })} className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Ajouter
        </button>
      </Section>
      <LayoutPanel props={props} onChange={onChange} />
    </>
  );
}

function LogoWallProperties({ props, onChange }: { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }) {
  const p = props as { title: string; items: string[] };
  const items = p.items ?? [];
  return (
    <>
      <Section title="Contenu">
        <Field label="Titre de section"><TextInput value={p.title ?? ''} onChange={(v) => onChange({ title: v })} /></Field>
      </Section>
      <Section title={`Logos / Marques (${items.length})`}>
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <TextInput value={item} onChange={(v) => {
              const n = [...items]; n[i] = v; onChange({ items: n });
            }} placeholder="Nom de la marque" />
            <button onClick={() => onChange({ items: items.filter((_, j) => j !== i) })} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-rose-400 transition-colors shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <button onClick={() => onChange({ items: [...items, 'Nouveau'] })} className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Ajouter une marque
        </button>
      </Section>
      <LayoutPanel props={props} onChange={onChange} />
    </>
  );
}

function FooterProperties({ props, onChange }: { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }) {
  const p = props as { logo: string; description: string; columns: { title: string; links: { label: string; href: string }[] }[]; showStatus: boolean; copyright: string };
  const columns = p.columns ?? [];
  return (
    <>
      <Section title="Identité">
        <Field label="Logo / Nom"><TextInput value={p.logo ?? ''} onChange={(v) => onChange({ logo: v })} /></Field>
        <Field label="Description"><TextInput value={p.description ?? ''} onChange={(v) => onChange({ description: v })} multiline /></Field>
      </Section>
      <Section title="Copyright">
        <Field label="Texte"><TextInput value={p.copyright ?? ''} onChange={(v) => onChange({ copyright: v })} /></Field>
        <Toggle value={!!p.showStatus} onChange={(v) => onChange({ showStatus: v })} label="Indicateur de statut" />
      </Section>
      <Section title={`Colonnes (${columns.length})`} defaultOpen={false}>
        {columns.map((col, i) => (
          <div key={i} className="space-y-2 p-3 bg-white/3 rounded-xl">
            <div className="flex items-center justify-between">
              <Field label="Titre de colonne">
                <TextInput value={col.title} onChange={(v) => { const n = [...columns]; n[i] = { ...n[i], title: v }; onChange({ columns: n }); }} />
              </Field>
              <button onClick={() => onChange({ columns: columns.filter((_, j) => j !== i) })} className="w-6 h-6 rounded flex items-center justify-center text-white/20 hover:text-rose-400 transition-colors ml-2 mt-5 shrink-0">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            {col.links.map((link, j) => (
              <div key={j} className="flex gap-2 items-center">
                <TextInput value={link.label} onChange={(v) => {
                  const n = [...columns]; n[i] = { ...n[i], links: n[i].links.map((l, k) => k === j ? { ...l, label: v } : l) }; onChange({ columns: n });
                }} placeholder="Label" />
                <button onClick={() => {
                  const n = [...columns]; n[i] = { ...n[i], links: n[i].links.filter((_, k) => k !== j) }; onChange({ columns: n });
                }} className="w-6 h-6 rounded flex items-center justify-center text-white/20 hover:text-rose-400 transition-colors shrink-0">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button onClick={() => {
              const n = [...columns]; n[i] = { ...n[i], links: [...n[i].links, { label: 'Lien', href: '#' }] }; onChange({ columns: n });
            }} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
              <Plus className="w-3 h-3" /> Ajouter un lien
            </button>
          </div>
        ))}
        <button onClick={() => onChange({ columns: [...columns, { title: 'Nouvelle colonne', links: [] }] })} className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Ajouter une colonne
        </button>
      </Section>
      <Section title="Fond">
        <Field label="Couleur de fond">
          <div className="flex flex-wrap gap-2">
            {BG_OPTIONS.filter((o) => !o.value.startsWith('grad')).map((opt) => (
              <button key={opt.value} title={opt.label} onClick={() => onChange({ bg: opt.value })}
                className={`w-7 h-7 rounded-lg border-2 transition-all shrink-0 ${((props.bg as string) ?? 'gray-950') === opt.value ? 'border-blue-400 scale-110' : 'border-transparent hover:border-white/30'}`}
                style={{ background: opt.swatch }} />
            ))}
          </div>
        </Field>
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
            { value: 'left',   label: 'Gauche' },
            { value: 'center', label: 'Centre' },
            { value: 'right',  label: 'Droite' },
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
      <LayoutPanel props={props} onChange={onChange} />
    </>
  );
}

// ─── Theme panel ──────────────────────────────────────────────────────────────

const THEME_COLORS = ['blue', 'violet', 'emerald', 'rose', 'amber', 'cyan'] as const;
const THEME_COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-500', violet: 'bg-violet-500', emerald: 'bg-emerald-500',
  rose: 'bg-rose-500', amber: 'bg-amber-500', cyan: 'bg-cyan-500',
};
const FONTS = ['Inter', 'Geist', 'Poppins', 'DM Sans', 'Outfit', 'Syne'];

function ThemePanel() {
  const project = useCurrentProject();
  const { updateTheme, currentProjectId } = useEditorStore();
  if (!project || !currentProjectId) return null;

  return (
    <>
      <Section title="Couleur principale">
        <div className="flex gap-2 flex-wrap">
          {THEME_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => updateTheme(currentProjectId, { primaryColor: c })}
              className={`w-8 h-8 rounded-lg ${THEME_COLOR_MAP[c]} ${project.theme.primaryColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-950' : ''} transition-all`}
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
              { value: 'sm',   label: 'Petit' },
              { value: 'md',   label: 'Moyen' },
              { value: 'lg',   label: 'Grand' },
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

const BLOCK_LABELS: Record<string, string> = {
  navbar: 'Navigation', hero: 'Héro', features: 'Fonctionnalités', stats: 'Statistiques',
  cta: 'Call to Action', pricing: 'Tarifs', faq: 'FAQ', testimonials: 'Témoignages',
  logowall: 'Mur de logos', footer: 'Pied de page', text: 'Texte',
};

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
                <span className="text-sm font-medium text-white">{BLOCK_LABELS[block.type] ?? block.type}</span>
                <span className="text-xs text-white/25 ml-auto font-mono">{block.id.slice(0, 6)}</span>
              </div>
            </div>

            {/* Block editors */}
            {block.type === 'hero'         && <HeroProperties         props={block.props} onChange={handleChange} />}
            {block.type === 'navbar'       && <NavbarProperties       props={block.props} onChange={handleChange} />}
            {block.type === 'features'     && <FeaturesProperties     props={block.props} onChange={handleChange} />}
            {block.type === 'stats'        && <StatsProperties        props={block.props} onChange={handleChange} />}
            {block.type === 'cta'          && <CtaProperties          props={block.props} onChange={handleChange} />}
            {block.type === 'pricing'      && <PricingProperties      props={block.props} onChange={handleChange} />}
            {block.type === 'faq'          && <FaqProperties          props={block.props} onChange={handleChange} />}
            {block.type === 'testimonials' && <TestimonialsProperties props={block.props} onChange={handleChange} />}
            {block.type === 'logowall'     && <LogoWallProperties     props={block.props} onChange={handleChange} />}
            {block.type === 'footer'       && <FooterProperties       props={block.props} onChange={handleChange} />}
            {block.type === 'text'         && <TextProperties         props={block.props} onChange={handleChange} />}
            {!Object.keys(BLOCK_LABELS).includes(block.type) && (
              <div className="p-4 text-sm text-white/40 text-center py-8">
                <Layout className="w-6 h-6 mx-auto mb-2 opacity-30" />
                Propriétés pour « {block.type} »<br />
                <span className="text-xs">Bientôt disponible</span>
              </div>
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
