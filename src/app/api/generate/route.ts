import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Tu es un expert en création de sites web marketing haute conversion.
À partir d'une description, génère le contenu complet d'un site web professionnel en JSON.

RÈGLES STRICTES :
1. Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans explication
2. Tous les textes doivent être professionnels, convaincants et adaptés au secteur
3. Les titres héros doivent être percutants et différencier l'offre
4. Les stats doivent être crédibles (pas trop exagérées)
5. Les témoignages doivent sembler authentiques avec de vrais noms français
6. Si le site est une SaaS/tech → utiliser des termes techniques appropriés
7. Si le site est artisanal/restaurant → utiliser un registre chaleureux et humain
8. Génère toujours des blocs pertinents selon le secteur (ex: restaurant → pas de pricing mensuel)

FORMAT ATTENDU :
{
  "name": "Nom du projet",
  "templateId": "saas-landing | agency | startup | portfolio | restaurant | blank",
  "blocks": [
    {
      "type": "navbar",
      "props": { ...props spécifiques au type }
    },
    ...
  ]
}

CHAQUE BLOC PEUT AVOIR CES PROPRIÉTÉS DE STYLE (obligatoires dans les props) :
- bg: "gray-950|gray-900|black|slate-900|blue-950|violet-950|emerald-950|white|gray-50|blue-50|violet-50|grad-blue|grad-purple|grad-emerald|grad-sunset"
- paddingY: "none|sm|md|lg|xl"
- contentWidth: "narrow|boxed|wide|full"

RÈGLES DE BG PAR SECTEUR :
- SaaS/Tech (templateId: saas-landing) → alterne gray-950/gray-900/black, hero en grad-blue, cta en grad-blue
- Agence/Créatif (templateId: agency) → slate-900/black, hero en grad-purple, cta en grad-purple
- Startup (templateId: startup) → gray-950/gray-900, hero en grad-emerald
- Portfolio/Créateur (templateId: portfolio) → white/gray-50/blue-50 (thème CLAIR), cta en blue-50
- Restaurant/Food/Artisan (templateId: restaurant) → white/gray-50 (thème CLAIR), jamais de fond sombre
- Ne PAS mettre tous les blocs avec le même bg — alterner pour créer du rythme visuel

TYPES DE BLOCS DISPONIBLES ET LEURS PROPS :

navbar: { logo, links: [{label, href}], ctaLabel, ctaHref, transparent, bg }
hero: { badge, title, titleGradient, subtitle, ctaLabel, ctaSecondaryLabel, backgroundVariant: "mesh-blue|mesh-purple|mesh-green|dark|gradient|none", showStats, stats: [{value, label}], bg }
features: { badge, title, subtitle, columns: 2|3|4, cardStyle: "glass|border|filled|outline|gradient", items: [{icon: "Zap|Shield|Globe|Sparkles|BarChart3|Puzzle|Users|Heart|Star|Rocket|Target|Lock|Palette|Code2|Smartphone|Leaf|ChefHat|Wine|Calendar", title, description}], bg, paddingY, contentWidth }
stats: { items: [{value, label, sublabel}], variant: "row|grid", bg }
testimonials: { badge, title, items: [{name, role, company, avatar, text}], bg }
pricing: { badge, title, subtitle, billingToggle, plans: [{label, title, monthlyPrice, annualPrice, color: "blue|green|purple", popular, features: [string]}], bg }
faq: { badge, title, items: [{question, answer}], bg }
cta: { title, subtitle, ctaLabel, ctaSecondaryLabel, variant: "gradient|glass|dark|simple", bg }
logowall: { title, items: [string], bg }
text: { content, align: "left|center|right", size: "sm|md|lg|xl", bg }
footer: { logo, description, columns: [{title, links: [{label, href}]}], showStatus, copyright, bg }`;

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt requis' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_api_key_here') {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY non configurée' }, { status: 503 });
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Génère un site web complet pour : "${prompt}"\n\nCrée du contenu vraiment adapté à ce secteur/produit. Sois créatif et professionnel.`,
        },
      ],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from the response (Claude sometimes wraps in markdown)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Réponse IA invalide', raw }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
