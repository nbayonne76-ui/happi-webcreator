import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { blockType, currentProps, instruction } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_api_key_here') {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY non configurée' }, { status: 503 });
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: `Tu es un expert copywriter et designer web. Tu améliores le contenu d'un bloc de site web.
Réponds UNIQUEMENT avec un objet JSON valide contenant les props mises à jour.
Ne modifie que les valeurs textuelles/contenu. Conserve la structure exacte des props.
Si une instruction est fournie, applique-la. Sinon, améliore simplement le contenu.`,
      messages: [
        {
          role: 'user',
          content: `Type de bloc: ${blockType}
Props actuelles: ${JSON.stringify(currentProps, null, 2)}
${instruction ? `Instruction: ${instruction}` : 'Améliore le contenu pour le rendre plus professionnel et percutant.'}

Retourne les props améliorées en JSON.`,
        },
      ],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ error: 'Réponse invalide' }, { status: 500 });

    const enhanced = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ props: enhanced });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
