// ─── Block Types ────────────────────────────────────────────────────────────

export type BlockType =
  | 'navbar'
  | 'hero'
  | 'features'
  | 'stats'
  | 'cta'
  | 'pricing'
  | 'faq'
  | 'testimonials'
  | 'logowall'
  | 'before-after'
  | 'text'
  | 'image'
  | 'video'
  | 'divider'
  | 'footer';

export type DevicePreview = 'desktop' | 'tablet' | 'mobile';
export type ThemeColor = 'blue' | 'violet' | 'emerald' | 'rose' | 'amber' | 'cyan';

// ─── Block Props ─────────────────────────────────────────────────────────────

export interface NavbarProps {
  logo: string;
  links: { label: string; href: string }[];
  ctaLabel: string;
  ctaHref: string;
  transparent: boolean;
}

export interface HeroProps {
  badge: string;
  title: string;
  titleGradient: string;
  subtitle: string;
  ctaLabel: string;
  ctaSecondaryLabel: string;
  backgroundVariant: 'mesh-blue' | 'mesh-purple' | 'mesh-green' | 'dark' | 'gradient';
  showStats: boolean;
  stats: { value: string; label: string }[];
}

export interface FeaturesProps {
  badge: string;
  title: string;
  subtitle: string;
  columns: 2 | 3 | 4;
  items: { icon: string; title: string; description: string }[];
  cardStyle: 'glass' | 'border' | 'filled';
}

export interface StatsProps {
  items: { value: string; label: string; sublabel?: string }[];
  variant: 'row' | 'grid';
}

export interface CtaProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaSecondaryLabel: string;
  variant: 'gradient' | 'glass' | 'dark';
}

export interface PricingProps {
  badge: string;
  title: string;
  subtitle: string;
  billingToggle: boolean;
  plans: {
    label: string;
    title: string;
    monthlyPrice: number;
    annualPrice: number;
    color: string;
    popular: boolean;
    features: string[];
  }[];
}

export interface FaqProps {
  badge: string;
  title: string;
  items: { question: string; answer: string }[];
}

export interface TestimonialsProps {
  badge: string;
  title: string;
  items: { name: string; role: string; company: string; avatar: string; text: string }[];
}

export interface LogoWallProps {
  title: string;
  items: string[];
}

export interface TextProps {
  content: string;
  align: 'left' | 'center' | 'right';
  size: 'sm' | 'md' | 'lg' | 'xl';
}

export interface ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  rounded: boolean;
  shadow: boolean;
}

export interface FooterProps {
  logo: string;
  description: string;
  columns: { title: string; links: { label: string; href: string }[] }[];
  showStatus: boolean;
  copyright: string;
}

export type BlockProps =
  | NavbarProps
  | HeroProps
  | FeaturesProps
  | StatsProps
  | CtaProps
  | PricingProps
  | FaqProps
  | TestimonialsProps
  | LogoWallProps
  | TextProps
  | ImageProps
  | FooterProps;

// ─── Block ───────────────────────────────────────────────────────────────────

export interface Block {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export interface PageSeo {
  title: string;
  description: string;
  slug: string;
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  blocks: Block[];
  seo?: PageSeo;
}

// ─── Project ─────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description: string;
  templateId: string;
  theme: {
    primaryColor: ThemeColor;
    fontFamily: string;
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
    darkMode: boolean;
  };
  pages: Page[];
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Template ────────────────────────────────────────────────────────────────

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'saas' | 'agency' | 'portfolio' | 'ecommerce' | 'restaurant' | 'startup' | 'blank';
  thumbnail: string;
  preview: string;
  pages: Page[];
  popular: boolean;
  new: boolean;
}

// ─── Editor State ────────────────────────────────────────────────────────────

export interface HistoryEntry {
  blocks: Block[];
}
