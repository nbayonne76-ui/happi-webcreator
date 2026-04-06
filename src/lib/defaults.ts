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
          createBlock('navbar'),
          createBlock('hero'),
          createBlock('stats'),
          createBlock('features'),
          createBlock('testimonials'),
          createBlock('pricing'),
          createBlock('faq'),
          createBlock('cta'),
          createBlock('footer'),
        ],
      },
    ],
  },
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
          createBlock('navbar'),
          createBlock('hero'),
          createBlock('logowall'),
          createBlock('features'),
          createBlock('testimonials'),
          createBlock('cta'),
          createBlock('footer'),
        ],
      },
    ],
  },
  {
    id: 'startup',
    name: 'Startup',
    description: 'Lancer votre startup avec une page percutante.',
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
          createBlock('navbar'),
          createBlock('hero'),
          createBlock('features'),
          createBlock('pricing'),
          createBlock('faq'),
          createBlock('footer'),
        ],
      },
    ],
  },
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
          createBlock('navbar'),
          createBlock('hero'),
          createBlock('features'),
          createBlock('testimonials'),
          createBlock('cta'),
          createBlock('footer'),
        ],
      },
    ],
  },
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
          createBlock('navbar'),
          createBlock('hero'),
          createBlock('features'),
          createBlock('testimonials'),
          createBlock('cta'),
          createBlock('footer'),
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
      primaryColor: 'blue',
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
