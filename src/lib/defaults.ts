import { Block, Project, Template } from '@/types';
import { nanoid } from './nanoid';

// ─── Default block props ──────────────────────────────────────────────────────

export const DEFAULT_BLOCK_PROPS: Record<string, Record<string, unknown>> = {
  navbar: {
    logo: 'MonSite',
    links: [
      { label: 'Accueil', href: '#' },
      { label: 'Fonctionnalités', href: '#features' },
      { label: 'Tarifs', href: '#pricing' },
    ],
    ctaLabel: 'Commencer',
    ctaHref: '#',
    transparent: true,
  },
  hero: {
    badge: '✦ Nouveau',
    title: 'Créez quelque chose',
    titleGradient: "d'extraordinaire",
    subtitle: 'Votre description ici. Expliquez ce que vous faites et pourquoi c\'est important.',
    ctaLabel: 'Commencer gratuitement',
    ctaSecondaryLabel: 'Voir la démo',
    backgroundVariant: 'mesh-blue',
    showStats: true,
    stats: [
      { value: '10k+', label: 'Utilisateurs' },
      { value: '99%', label: 'Satisfaction' },
      { value: '24/7', label: 'Support' },
      { value: '< 1s', label: 'Chargement' },
    ],
  },
  features: {
    badge: 'Fonctionnalités',
    title: 'Tout ce dont vous avez besoin',
    subtitle: 'Une suite complète d\'outils pour votre succès.',
    columns: 3,
    cardStyle: 'glass',
    items: [
      { icon: 'Zap', title: 'Ultra rapide', description: 'Performances optimisées pour une expérience fluide.' },
      { icon: 'Shield', title: 'Sécurisé', description: 'Vos données protégées avec les meilleurs standards.' },
      { icon: 'Globe', title: 'Global', description: 'Disponible partout dans le monde, en temps réel.' },
      { icon: 'Sparkles', title: 'IA intégrée', description: 'Des suggestions intelligentes pour vous faire gagner du temps.' },
      { icon: 'BarChart3', title: 'Analytics', description: 'Suivez vos performances avec des tableaux de bord clairs.' },
      { icon: 'Puzzle', title: 'Intégrations', description: 'Connectez vos outils favoris en quelques clics.' },
    ],
  },
  stats: {
    items: [
      { value: '10 000+', label: 'Clients actifs', sublabel: 'dans le monde' },
      { value: '99.9%', label: 'Uptime garanti' },
      { value: '< 30s', label: 'Mise en ligne' },
      { value: '200+', label: 'Intégrations' },
    ],
    variant: 'row',
  },
  cta: {
    title: 'Prêt à vous lancer ?',
    subtitle: 'Rejoignez des milliers d\'utilisateurs qui font confiance à notre plateforme.',
    ctaLabel: 'Commencer maintenant',
    ctaSecondaryLabel: 'En savoir plus',
    variant: 'gradient',
  },
  pricing: {
    badge: 'Tarifs',
    title: 'Simple et transparent',
    subtitle: 'Aucun frais caché. Annulez à tout moment.',
    billingToggle: true,
    plans: [
      {
        label: 'Starter',
        title: 'Pour démarrer',
        monthlyPrice: 29,
        annualPrice: 24,
        color: 'blue',
        popular: false,
        features: ['1 projet', '10 pages', 'Domaine inclus', 'SSL automatique', 'Support email'],
      },
      {
        label: 'Pro',
        title: 'Pour les pros',
        monthlyPrice: 59,
        annualPrice: 49,
        color: 'green',
        popular: true,
        features: ['5 projets', 'Pages illimitées', 'Domaines custom', 'CDN premium', 'Support prioritaire'],
      },
      {
        label: 'Agency',
        title: 'Pour les agences',
        monthlyPrice: 149,
        annualPrice: 124,
        color: 'purple',
        popular: false,
        features: ['Projets illimités', 'White-label', 'API access', 'Équipe', 'Support 24/7'],
      },
    ],
  },
  faq: {
    badge: 'FAQ',
    title: 'Questions fréquentes',
    items: [
      { question: 'Comment commencer ?', answer: 'Créez un compte, choisissez un template et commencez à personnaliser en quelques minutes.' },
      { question: 'Puis-je utiliser mon propre domaine ?', answer: 'Oui, tous les plans incluent la possibilité de connecter votre domaine personnalisé.' },
      { question: 'Y a-t-il un essai gratuit ?', answer: 'Oui, 14 jours d\'essai gratuit sans carte de crédit requise.' },
      { question: 'Comment fonctionne le support ?', answer: 'Notre équipe est disponible par email, chat et téléphone selon votre plan.' },
    ],
  },
  testimonials: {
    badge: 'Témoignages',
    title: 'Ils nous font confiance',
    items: [
      { name: 'Marie Dupont', role: 'CEO', company: 'TechCorp', avatar: 'MD', text: 'Incroyable outil, a transformé notre façon de travailler. Je recommande vivement !' },
      { name: 'Pierre Martin', role: 'Designer', company: 'Studio X', avatar: 'PM', text: 'Interface intuitive, résultats professionnels. Exactement ce dont j\'avais besoin.' },
      { name: 'Sophie Leroy', role: 'Fondatrice', company: 'StartupABC', avatar: 'SL', text: 'Lancé mon site en 30 minutes. Le SEO est excellent et les performances au top.' },
    ],
  },
  logowall: {
    title: 'Ils nous font confiance',
    items: ['Google', 'Apple', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Spotify', 'Airbnb'],
  },
  text: {
    content: 'Votre texte ici. Double-cliquez pour modifier.',
    align: 'left',
    size: 'md',
  },
  image: {
    src: '',
    alt: 'Image',
    caption: '',
    align: 'center',
    maxWidth: '100%',
    rounded: true,
    shadow: true,
  },
  divider: {
    style: 'line',
    width: 'md',
    spacing: 'md',
    bg: 'gray-950',
  },
  footer: {
    logo: 'MonSite',
    description: 'La plateforme pour créer des sites web professionnels en quelques minutes.',
    columns: [
      { title: 'Produit', links: [{ label: 'Fonctionnalités', href: '#' }, { label: 'Tarifs', href: '#' }, { label: 'Templates', href: '#' }] },
      { title: 'Entreprise', links: [{ label: 'À propos', href: '#' }, { label: 'Blog', href: '#' }, { label: 'Contact', href: '#' }] },
      { title: 'Légal', links: [{ label: 'Confidentialité', href: '#' }, { label: 'CGU', href: '#' }] },
    ],
    showStatus: true,
    copyright: `© ${new Date().getFullYear()} MonSite. Tous droits réservés.`,
  },
};

// ─── Create a new block ───────────────────────────────────────────────────────

export function createBlock(type: string): Block {
  return {
    id: nanoid(),
    type: type as Block['type'],
    props: { ...(DEFAULT_BLOCK_PROPS[type] ?? {}) },
  };
}

/** Create a block with prop overrides merged on top of defaults */
function blockWith(type: string, overrides: Record<string, unknown>): Block {
  return {
    id: nanoid(),
    type: type as Block['type'],
    props: { ...(DEFAULT_BLOCK_PROPS[type] ?? {}), ...overrides },
  };
}

// ─── Per-template primary color mapping ──────────────────────────────────────

const TEMPLATE_PRIMARY: Record<string, string> = {
  'saas-landing': 'blue',
  'agency':       'violet',
  'startup':      'emerald',
  'portfolio':    'cyan',
  'restaurant':   'amber',
  'blank':        'blue',
};

// ─── Templates ───────────────────────────────────────────────────────────────

export const TEMPLATES: Template[] = [
  {
    id: 'blank',
    name: 'Page vierge',
    description: 'Commencez de zéro avec une page vide.',
    category: 'blank',
    thumbnail: '',
    preview: '',
    popular: false,
    new: false,
    pages: [{ id: nanoid(), name: 'Accueil', slug: '/', blocks: [] }],
  },

  // ── SaaS Landing — dark blue, high-tech ──────────────────────────────────
  {
    id: 'saas-landing',
    name: 'SaaS Landing',
    description: 'Landing page complète pour un produit SaaS.',
    category: 'saas',
    thumbnail: '',
    preview: '',
    popular: true,
    new: false,
    pages: [
      {
        id: nanoid(),
        name: 'Accueil',
        slug: '/',
        blocks: [
          blockWith('navbar', { bg: 'gray-950', transparent: true }),
          blockWith('hero',   { bg: 'grad-blue', backgroundVariant: 'mesh-blue' }),
          blockWith('stats',  { bg: 'gray-900' }),
          blockWith('features', { bg: 'gray-950', cardStyle: 'glass' }),
          blockWith('testimonials', { bg: 'gray-900' }),
          blockWith('pricing', { bg: 'gray-950' }),
          blockWith('faq',    { bg: 'gray-900' }),
          blockWith('cta',    { bg: 'grad-blue', variant: 'gradient' }),
          blockWith('footer', { bg: 'black' }),
        ],
      },
    ],
  },

  // ── Agency — dark slate, violet accent ───────────────────────────────────
  {
    id: 'agency',
    name: 'Agence',
    description: 'Présentation élégante pour une agence créative.',
    category: 'agency',
    thumbnail: '',
    preview: '',
    popular: true,
    new: false,
    pages: [
      {
        id: nanoid(),
        name: 'Accueil',
        slug: '/',
        blocks: [
          blockWith('navbar',  { bg: 'slate-900', transparent: false }),
          blockWith('hero',    { bg: 'grad-purple', backgroundVariant: 'mesh-blue',
            badge: '✦ Agence créative',
            title: 'Des expériences',
            titleGradient: 'qui marquent les esprits',
            subtitle: "Nous concevons des identités visuelles et des sites web qui captivent votre audience et font rayonner votre marque.",
          }),
          blockWith('logowall', { bg: 'black', title: 'Ils nous font confiance' }),
          blockWith('features', { bg: 'slate-900', cardStyle: 'glass',
            badge: 'Notre approche', title: 'Créativité & Performance',
          }),
          blockWith('testimonials', { bg: 'black' }),
          blockWith('cta',     { bg: 'grad-purple', variant: 'gradient',
            title: 'Parlons de votre projet',
            subtitle: "Décrivez-nous votre vision. Nous la réalisons.",
            ctaLabel: 'Prendre contact',
          }),
          blockWith('footer',  { bg: 'black' }),
        ],
      },
    ],
  },

  // ── Startup — emerald accent, mixed dark ─────────────────────────────────
  {
    id: 'startup',
    name: 'Startup',
    description: 'Lancez votre startup avec une page percutante.',
    category: 'startup',
    thumbnail: '',
    preview: '',
    popular: false,
    new: true,
    pages: [
      {
        id: nanoid(),
        name: 'Accueil',
        slug: '/',
        blocks: [
          blockWith('navbar',   { bg: 'gray-950', transparent: true }),
          blockWith('hero',     { bg: 'grad-emerald', backgroundVariant: 'mesh-blue',
            badge: '🚀 En version bêta',
            title: 'La solution qui',
            titleGradient: 'change la donne',
            subtitle: "Automatisez, optimisez, développez. Notre plateforme vous aide à passer à la vitesse supérieure dès le premier jour.",
          }),
          blockWith('features', { bg: 'gray-950', cardStyle: 'gradient',
            badge: 'Pourquoi nous ?', title: 'Conçu pour scaler',
          }),
          blockWith('pricing',  { bg: 'gray-900' }),
          blockWith('faq',      { bg: 'gray-950' }),
          blockWith('footer',   { bg: 'black' }),
        ],
      },
    ],
  },

  // ── Portfolio — light cyan, clean & minimal ───────────────────────────────
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Mettez en valeur vos réalisations.',
    category: 'portfolio',
    thumbnail: '',
    preview: '',
    popular: false,
    new: true,
    pages: [
      {
        id: nanoid(),
        name: 'Accueil',
        slug: '/',
        blocks: [
          blockWith('navbar', { bg: 'white', transparent: false }),
          blockWith('hero',   { bg: 'blue-50', backgroundVariant: 'none',
            badge: '✦ Designer & Développeur',
            title: 'Bonjour, je suis',
            titleGradient: 'créateur de sites',
            subtitle: "Je conçois des expériences web élégantes et performantes. Chaque projet est une nouvelle opportunité de repousser les limites du design.",
            ctaLabel: 'Voir mes projets',
            ctaSecondaryLabel: 'Me contacter',
            showStats: true,
            stats: [
              { value: '50+', label: 'Projets' },
              { value: '8 ans', label: "d'expérience" },
              { value: '100%', label: 'Clients satisfaits' },
              { value: '5★', label: 'Note moyenne' },
            ],
          }),
          blockWith('features', { bg: 'gray-50', cardStyle: 'outline',
            badge: 'Compétences', title: 'Ce que je fais',
            items: [
              { icon: 'Palette', title: 'UI/UX Design', description: 'Interfaces intuitives et identités visuelles mémorables.' },
              { icon: 'Code2', title: 'Développement', description: 'Sites web performants avec les dernières technologies.' },
              { icon: 'Smartphone', title: 'Mobile First', description: 'Expériences optimisées pour tous les écrans.' },
              { icon: 'Zap', title: 'Performance', description: 'Core Web Vitals au top, chargement ultra-rapide.' },
              { icon: 'Globe', title: 'SEO', description: 'Visibilité maximale sur les moteurs de recherche.' },
              { icon: 'Sparkles', title: 'IA & Animation', description: 'Interactions modernes et effets visuels percutants.' },
            ],
          }),
          blockWith('testimonials', { bg: 'white' }),
          blockWith('cta',    { bg: 'blue-50', variant: 'simple',
            title: 'Vous avez un projet ?',
            subtitle: "Discutons-en ! Je suis disponible pour des missions freelance.",
            ctaLabel: 'Travailler ensemble',
            ctaSecondaryLabel: 'Télécharger mon CV',
          }),
          blockWith('footer', { bg: 'gray-50' }),
        ],
      },
    ],
  },

  // ── Restaurant — warm amber, light & inviting ─────────────────────────────
  {
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Site professionnel pour votre établissement.',
    category: 'restaurant',
    thumbnail: '',
    preview: '',
    popular: false,
    new: false,
    pages: [
      {
        id: nanoid(),
        name: 'Accueil',
        slug: '/',
        blocks: [
          blockWith('navbar', { bg: 'white', transparent: false,
            logo: 'Le Bistrot',
            links: [
              { label: 'Menu', href: '#menu' },
              { label: 'Réserver', href: '#reservation' },
              { label: 'À propos', href: '#about' },
            ],
            ctaLabel: 'Réserver une table',
          }),
          blockWith('hero', { bg: 'white', backgroundVariant: 'none',
            badge: '🍽️ Ouvert 7j/7',
            title: 'Une cuisine',
            titleGradient: 'faite avec passion',
            subtitle: "Découvrez nos plats préparés avec des produits frais et locaux. Un voyage culinaire unique au cœur de la ville.",
            ctaLabel: 'Réserver une table',
            ctaSecondaryLabel: 'Voir le menu',
            showStats: true,
            stats: [
              { value: '15 ans', label: "d'expérience" },
              { value: '200+', label: 'Couverts / jour' },
              { value: '4.9★', label: 'Note Google' },
              { value: 'Bio', label: 'Produits locaux' },
            ],
          }),
          blockWith('features', { bg: 'gray-50', cardStyle: 'outline',
            badge: 'Notre promesse', title: 'Pourquoi nous choisir ?',
            items: [
              { icon: 'Leaf', title: 'Produits frais', description: 'Sélectionnés chaque matin chez nos producteurs locaux.' },
              { icon: 'ChefHat', title: 'Chef étoilé', description: 'Une cuisine gastronomique accessible à tous.' },
              { icon: 'Wine', title: 'Cave à vins', description: 'Plus de 80 références pour sublimer votre repas.' },
              { icon: 'Calendar', title: 'Réservation facile', description: 'En ligne, 24h/24 en quelques secondes.' },
              { icon: 'Heart', title: 'Ambiance chaleureuse', description: 'Un cadre intime et cosy pour vos moments précieux.' },
              { icon: 'Star', title: 'Menu enfants', description: 'Des plats savoureux adaptés aux plus petits.' },
            ],
          }),
          blockWith('testimonials', { bg: 'white',
            badge: '⭐ Avis clients', title: 'Ils sont venus, ils ont adoré',
          }),
          blockWith('cta', { bg: 'gray-50', variant: 'simple',
            title: 'Réservez votre table',
            subtitle: "Disponible tous les jours de 12h à 14h30 et de 19h à 23h. Privatisation possible.",
            ctaLabel: 'Réserver maintenant',
            ctaSecondaryLabel: 'Voir le menu',
          }),
          blockWith('footer', { bg: 'white',
            logo: 'Le Bistrot',
            description: 'Restaurant gastronomique au cœur de Paris. Cuisine française traditionnelle revisitée.',
            copyright: `© ${new Date().getFullYear()} Le Bistrot. Tous droits réservés.`,
          }),
        ],
      },
    ],
  },
];

// ─── Sample project ───────────────────────────────────────────────────────────

export function createProject(name: string, templateId: string): Project {
  const template = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];
  const now = new Date().toISOString();
  return {
    id: nanoid(),
    name,
    description: '',
    templateId,
    theme: {
      primaryColor: (TEMPLATE_PRIMARY[templateId] ?? 'blue') as import('@/types').ThemeColor,
      fontFamily: 'Inter',
      borderRadius: 'lg',
      darkMode: true,
    },
    pages: template.pages.map((p) => ({
      ...p,
      id: nanoid(),
      blocks: p.blocks.map((b) => ({ ...b, id: nanoid() })),
    })),
    thumbnail: '',
    createdAt: now,
    updatedAt: now,
  };
}
