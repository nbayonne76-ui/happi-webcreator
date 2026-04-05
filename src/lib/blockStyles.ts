// ─── Background presets ───────────────────────────────────────────────────────

export interface BgOption {
  value: string;
  label: string;
  class: string;
  swatch: string; // CSS color/gradient string for the preview swatch
  isLight: boolean;
}

export const BG_OPTIONS: BgOption[] = [
  // Dark backgrounds
  { value: 'gray-950',    label: 'Noir',          class: 'bg-gray-950',    swatch: '#030712',  isLight: false },
  { value: 'gray-900',    label: 'Anthracite',     class: 'bg-gray-900',    swatch: '#111827',  isLight: false },
  { value: 'black',       label: 'Noir pur',       class: 'bg-black',       swatch: '#000000',  isLight: false },
  { value: 'slate-900',   label: 'Ardoise',        class: 'bg-slate-900',   swatch: '#0F172A',  isLight: false },
  { value: 'blue-950',    label: 'Bleu nuit',      class: 'bg-blue-950',    swatch: '#172554',  isLight: false },
  { value: 'violet-950',  label: 'Violet nuit',    class: 'bg-violet-950',  swatch: '#2E1065',  isLight: false },
  { value: 'emerald-950', label: 'Vert nuit',      class: 'bg-emerald-950', swatch: '#022C22',  isLight: false },
  { value: 'rose-950',    label: 'Rose nuit',      class: 'bg-rose-950',    swatch: '#4C0519',  isLight: false },
  // Light backgrounds
  { value: 'white',       label: 'Blanc',          class: 'bg-white',       swatch: '#FFFFFF',  isLight: true },
  { value: 'gray-50',     label: 'Gris clair',     class: 'bg-gray-50',     swatch: '#F9FAFB',  isLight: true },
  { value: 'blue-50',     label: 'Bleu clair',     class: 'bg-blue-50',     swatch: '#EFF6FF',  isLight: true },
  { value: 'violet-50',   label: 'Violet clair',   class: 'bg-violet-50',   swatch: '#F5F3FF',  isLight: true },
  // Gradients
  { value: 'grad-blue',    label: 'Dégradé bleu',   class: 'bg-gradient-to-br from-gray-950 via-blue-950/40 to-gray-950',    swatch: 'linear-gradient(135deg,#030712 0%,#1e3a5f 50%,#030712 100%)',    isLight: false },
  { value: 'grad-purple',  label: 'Dégradé violet', class: 'bg-gradient-to-br from-gray-950 via-violet-950/40 to-gray-950',  swatch: 'linear-gradient(135deg,#030712 0%,#3b0764 50%,#030712 100%)',    isLight: false },
  { value: 'grad-emerald', label: 'Dégradé vert',   class: 'bg-gradient-to-br from-gray-950 via-emerald-950/40 to-gray-950', swatch: 'linear-gradient(135deg,#030712 0%,#022c22 50%,#030712 100%)',    isLight: false },
  { value: 'grad-sunset',  label: 'Sunset',         class: 'bg-gradient-to-br from-rose-950 via-orange-950/60 to-gray-950',  swatch: 'linear-gradient(135deg,#4c0519 0%,#431407 50%,#030712 100%)',    isLight: false },
];

export const PADDING_OPTIONS = [
  { value: 'none', label: 'Aucun' },
  { value: 'sm',   label: 'Petit' },
  { value: 'md',   label: 'Normal' },
  { value: 'lg',   label: 'Grand' },
  { value: 'xl',   label: 'Très grand' },
] as const;

export const WIDTH_OPTIONS = [
  { value: 'narrow', label: 'Étroit' },
  { value: 'boxed',  label: 'Encadré' },
  { value: 'wide',   label: 'Large' },
  { value: 'full',   label: 'Plein écran' },
] as const;

// ─── Lookup maps ──────────────────────────────────────────────────────────────

const BG_CLASS_MAP: Record<string, string> = Object.fromEntries(
  BG_OPTIONS.map((o) => [o.value, o.class]),
);
const LIGHT_SET = new Set<string>(BG_OPTIONS.filter((o) => o.isLight).map((o) => o.value));

const PADDING_CLASS_MAP: Record<string, string> = {
  none: 'py-0',
  sm:   'py-8',
  md:   'py-16',
  lg:   'py-24',
  xl:   'py-32',
};

const WIDTH_CLASS_MAP: Record<string, string> = {
  narrow: 'max-w-3xl mx-auto',
  boxed:  'max-w-6xl mx-auto',
  wide:   'max-w-7xl mx-auto',
  full:   'w-full',
};

// ─── Getters ──────────────────────────────────────────────────────────────────

export function getBgClass(bg?: string): string {
  return BG_CLASS_MAP[bg ?? 'gray-950'] ?? 'bg-gray-950';
}

export function getPaddingClass(paddingY?: string): string {
  return PADDING_CLASS_MAP[paddingY ?? 'md'] ?? 'py-16';
}

export function getWidthClass(contentWidth?: string): string {
  return WIDTH_CLASS_MAP[contentWidth ?? 'boxed'] ?? 'max-w-6xl mx-auto';
}

export function isLightBg(bg?: string): boolean {
  return LIGHT_SET.has(bg ?? 'gray-950');
}

// ─── Adaptive text colors ─────────────────────────────────────────────────────

export interface TextColors {
  h:      string; // headings
  body:   string; // body / paragraph
  muted:  string; // secondary text
  faint:  string; // very faint labels
  border: string; // border utility class
  card:   string; // card background
  divide: string; // divide utility class
}

export function getTextColors(bg?: string): TextColors {
  if (isLightBg(bg)) {
    return {
      h:      'text-gray-900',
      body:   'text-gray-600',
      muted:  'text-gray-500',
      faint:  'text-gray-400',
      border: 'border-gray-200',
      card:   'bg-gray-100',
      divide: 'divide-gray-200',
    };
  }
  return {
    h:      'text-white',
    body:   'text-white/50',
    muted:  'text-white/40',
    faint:  'text-white/25',
    border: 'border-white/8',
    card:   'bg-white/3',
    divide: 'divide-white/8',
  };
}
