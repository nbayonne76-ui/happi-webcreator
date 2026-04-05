import { Project } from '@/types';
import { BG_OPTIONS } from './blockStyles';

// ─── HTML export ──────────────────────────────────────────────────────────────
//
// Generates a standalone single-file HTML that can be opened in a browser,
// deployed to Vercel static, or hosted anywhere — zero dependencies.
//
// Inspired by happi_brain.md: "HTML static → Vercel, livré en <1 jour"

// ── Text color helper (same logic as blockStyles.ts but for inline style) ────

function isLight(bg?: string): boolean {
  const light = new Set(['white', 'gray-50', 'blue-50', 'violet-50']);
  return light.has(bg ?? 'gray-950');
}

function tc(bg?: string) {
  return isLight(bg)
    ? { h: '#111827', body: '#6B7280', muted: '#9CA3AF', border: '#E5E7EB', card: '#F3F4F6' }
    : { h: '#FFFFFF', body: 'rgba(255,255,255,0.5)', muted: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.08)', card: 'rgba(255,255,255,0.03)' };
}

// ── CSS for bg preset ─────────────────────────────────────────────────────────

function bgCss(bg?: string): string {
  const found = BG_OPTIONS.find((o) => o.value === (bg ?? 'gray-950'));
  if (!found) return 'background:#030712;';
  if (found.value.startsWith('grad')) return `background:${found.swatch};`;
  return `background:${found.swatch};`;
}

// ── Padding helper ────────────────────────────────────────────────────────────

const PAD: Record<string, string> = {
  none: '0', sm: '32px', md: '64px', lg: '96px', xl: '128px',
};

function pad(p?: string): string {
  return PAD[p ?? 'md'] ?? '64px';
}

// ── Width helper ──────────────────────────────────────────────────────────────

const WIDTH: Record<string, string> = {
  narrow: '768px', boxed: '1152px', wide: '1280px', full: '100%',
};

function maxW(w?: string): string {
  return WIDTH[w ?? 'boxed'] ?? '1152px';
}

// ─── Block renderers ──────────────────────────────────────────────────────────

function renderNavbar(props: Record<string, unknown>): string {
  const p = props as { logo: string; links: { label: string; href: string }[]; ctaLabel: string; transparent: boolean; bg?: string };
  const colors = tc(p.bg);
  const bg = p.transparent ? 'transparent' : bgCss(p.bg);
  const links = (p.links ?? []).map((l) => `<a href="${l.href}" style="text-decoration:none;color:${colors.muted};font-size:14px;">${l.label}</a>`).join('');
  return `
<nav style="${bg}padding:16px 32px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid ${colors.border};">
  <div style="display:flex;align-items:center;gap:8px;">
    <div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#3B82F6,#7C3AED);display:flex;align-items:center;justify-content:center;">
      <span style="color:white;font-size:14px;font-weight:bold;">⚡</span>
    </div>
    <span style="font-weight:700;color:${colors.h};">${p.logo || 'MonSite'}</span>
  </div>
  <div style="display:flex;gap:24px;">${links}</div>
  <a href="#" style="background:#2563EB;color:white;padding:8px 16px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">${p.ctaLabel || 'Commencer'}</a>
</nav>`;
}

function renderHero(props: Record<string, unknown>): string {
  const p = props as { badge: string; title: string; titleGradient: string; subtitle: string; ctaLabel: string; ctaSecondaryLabel: string; showStats: boolean; stats: { value: string; label: string }[]; bg?: string; paddingY?: string };
  const colors = tc(p.bg);
  const stats = p.showStats && p.stats?.length
    ? `<div style="display:inline-grid;grid-template-columns:repeat(${Math.min(p.stats.length, 4)},1fr);border:1px solid ${colors.border};border-radius:12px;overflow:hidden;margin-top:40px;">
        ${p.stats.map((s) => `<div style="padding:16px 24px;text-align:center;border-right:1px solid ${colors.border};"><div style="font-size:20px;font-weight:800;color:${colors.h};">${s.value}</div><div style="font-size:12px;color:${colors.muted};">${s.label}</div></div>`).join('')}
       </div>` : '';
  return `
<section style="${bgCss(p.bg)}padding:${pad(p.paddingY)} 32px;text-align:center;position:relative;overflow:hidden;">
  <div style="max-width:900px;margin:0 auto;position:relative;z-index:1;">
    ${p.badge ? `<span style="display:inline-block;padding:6px 16px;border-radius:999px;background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);color:#60A5FA;font-size:14px;font-weight:500;margin-bottom:24px;">✦ ${p.badge}</span>` : ''}
    <h1 style="font-size:clamp(2.5rem,6vw,4rem);font-weight:800;line-height:1.1;color:${colors.h};margin:0 0 20px;">
      ${p.title} <span style="background:linear-gradient(90deg,#60A5FA,#A78BFA,#34D399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${p.titleGradient}</span>
    </h1>
    <p style="font-size:18px;color:${colors.body};max-width:700px;margin:0 auto 40px;line-height:1.7;">${p.subtitle}</p>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
      <a href="#" style="background:linear-gradient(135deg,#2563EB,#7C3AED);color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:600;font-size:16px;">✦ ${p.ctaLabel || 'Commencer'}</a>
      ${p.ctaSecondaryLabel ? `<a href="#" style="background:rgba(255,255,255,0.06);border:1px solid ${colors.border};color:${colors.h};padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:600;font-size:16px;">${p.ctaSecondaryLabel} →</a>` : ''}
    </div>
    ${stats}
  </div>
</section>`;
}

function renderFeatures(props: Record<string, unknown>): string {
  const p = props as { badge: string; title: string; subtitle: string; columns: number; cardStyle: string; items: { icon: string; title: string; description: string }[]; bg?: string; paddingY?: string; contentWidth?: string };
  const colors = tc(p.bg);
  const cols = p.columns ?? 3;
  const cardBg = isLight(p.bg) ? '#FFFFFF' : 'rgba(255,255,255,0.03)';
  const cardBorder = isLight(p.bg) ? '#E5E7EB' : 'rgba(255,255,255,0.07)';
  const items = (p.items ?? []).map((item) => `
    <div style="background:${cardBg};border:1px solid ${cardBorder};border-radius:16px;padding:24px;">
      <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,rgba(59,130,246,0.2),rgba(124,58,237,0.2));border:1px solid rgba(59,130,246,0.2);display:flex;align-items:center;justify-content:center;margin-bottom:16px;font-size:18px;">⚡</div>
      <h3 style="font-weight:600;color:${colors.h};margin:0 0 8px;">${item.title}</h3>
      <p style="font-size:14px;color:${colors.body};line-height:1.6;margin:0;">${item.description}</p>
    </div>`).join('');
  return `
<section style="${bgCss(p.bg)}padding:${pad(p.paddingY)} 32px;">
  <div style="max-width:${maxW(p.contentWidth)};margin:0 auto;">
    <div style="text-align:center;margin-bottom:56px;">
      ${p.badge ? `<span style="display:inline-block;padding:4px 12px;border-radius:999px;background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);color:#60A5FA;font-size:13px;font-weight:500;margin-bottom:16px;">${p.badge}</span>` : ''}
      <h2 style="font-size:2.25rem;font-weight:700;color:${colors.h};margin:0 0 16px;">${p.title}</h2>
      ${p.subtitle ? `<p style="color:${colors.body};max-width:600px;margin:0 auto;">${p.subtitle}</p>` : ''}
    </div>
    <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:20px;">${items}</div>
  </div>
</section>`;
}

function renderStats(props: Record<string, unknown>): string {
  const p = props as { items: { value: string; label: string; sublabel?: string }[]; variant: string; bg?: string; paddingY?: string; contentWidth?: string };
  const colors = tc(p.bg);
  const items = (p.items ?? []).map((item) => `
    <div style="text-align:center;padding:24px 16px;border-right:1px solid ${colors.border};">
      <div style="font-size:2rem;font-weight:800;color:${colors.h};margin-bottom:4px;">${item.value}</div>
      <div style="font-size:14px;color:${colors.body};">${item.label}</div>
      ${item.sublabel ? `<div style="font-size:12px;color:${colors.muted};margin-top:2px;">${item.sublabel}</div>` : ''}
    </div>`).join('');
  return `
<section style="${bgCss(p.bg)}padding:${pad(p.paddingY ?? 'sm')} 32px;border-top:1px solid ${colors.border};border-bottom:1px solid ${colors.border};">
  <div style="max-width:${maxW(p.contentWidth ?? 'wide')};margin:0 auto;">
    <div style="display:grid;grid-template-columns:repeat(${p.items?.length ?? 4},1fr);">${items}</div>
  </div>
</section>`;
}

function renderCta(props: Record<string, unknown>): string {
  const p = props as { title: string; subtitle: string; ctaLabel: string; ctaSecondaryLabel: string; variant: string; bg?: string; paddingY?: string };
  const colors = tc(p.bg);
  const innerBg = p.variant === 'gradient'
    ? 'background:linear-gradient(135deg,rgba(37,99,235,0.2),rgba(124,58,237,0.2));border:1px solid rgba(59,130,246,0.2);'
    : p.variant === 'dark'
    ? 'background:#111827;border:1px solid rgba(255,255,255,0.05);'
    : 'background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);';
  return `
<section style="${bgCss(p.bg)}padding:${pad(p.paddingY)} 32px;">
  <div style="max-width:800px;margin:0 auto;text-align:center;">
    <div style="${innerBg}border-radius:24px;padding:64px 48px;">
      <h2 style="font-size:2.25rem;font-weight:700;color:${colors.h};margin:0 0 16px;">${p.title}</h2>
      <p style="color:${colors.body};margin:0 0 32px;">${p.subtitle}</p>
      <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
        <a href="#" style="background:linear-gradient(135deg,#2563EB,#7C3AED);color:white;padding:12px 28px;border-radius:12px;text-decoration:none;font-weight:600;">✦ ${p.ctaLabel}</a>
        ${p.ctaSecondaryLabel ? `<a href="#" style="background:rgba(255,255,255,0.08);color:${colors.h};padding:12px 28px;border-radius:12px;text-decoration:none;font-weight:600;">${p.ctaSecondaryLabel} →</a>` : ''}
      </div>
    </div>
  </div>
</section>`;
}

function renderPricing(props: Record<string, unknown>): string {
  const p = props as { badge: string; title: string; subtitle: string; plans: { label: string; title: string; monthlyPrice: number; color: string; popular: boolean; features: string[] }[]; bg?: string; paddingY?: string };
  const colors = tc(p.bg);
  const colorMap: Record<string, string> = { blue: '#2563EB', green: '#10B981', purple: '#7C3AED' };
  const plans = (p.plans ?? []).map((plan) => {
    const c = colorMap[plan.color] ?? '#2563EB';
    const features = (plan.features ?? []).map((f) => `<li style="display:flex;gap:8px;align-items:flex-start;font-size:14px;color:${colors.body};margin-bottom:10px;"><span style="color:#10B981;">✓</span>${f}</li>`).join('');
    return `
    <div style="background:${isLight(p.bg) ? '#FFF' : 'rgba(255,255,255,0.03)'};border:1px solid ${c}33;border-radius:16px;padding:24px;position:relative;${plan.popular ? 'transform:scale(1.03);' : ''}">
      ${plan.popular ? `<div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:linear-gradient(90deg,#10B981,#06B6D4);color:white;font-size:12px;font-weight:700;padding:3px 12px;border-radius:999px;">⭐ Populaire</div>` : ''}
      <div style="margin-bottom:20px;"><span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;padding:2px 8px;border-radius:999px;background:${c}20;color:${c};">${plan.label}</span></div>
      <div style="margin-bottom:24px;"><span style="font-size:2.5rem;font-weight:800;color:${colors.h};">${plan.monthlyPrice}€</span><span style="color:${colors.muted};font-size:14px;">/mois</span></div>
      <ul style="list-style:none;padding:0;margin:0 0 32px;">${features}</ul>
      <a href="#" style="display:block;text-align:center;background:${c};color:white;padding:12px;border-radius:12px;text-decoration:none;font-weight:600;font-size:14px;">Commencer</a>
    </div>`;
  }).join('');
  return `
<section style="${bgCss(p.bg)}padding:${pad(p.paddingY)} 32px;">
  <div style="max-width:1100px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:56px;">
      ${p.badge ? `<span style="display:inline-block;padding:4px 12px;border-radius:999px;background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.2);color:#A78BFA;font-size:13px;font-weight:500;margin-bottom:16px;">${p.badge}</span>` : ''}
      <h2 style="font-size:2.25rem;font-weight:700;color:${colors.h};margin:0 0 12px;">${p.title}</h2>
      ${p.subtitle ? `<p style="color:${colors.body};">${p.subtitle}</p>` : ''}
    </div>
    <div style="display:grid;grid-template-columns:repeat(${Math.min(p.plans?.length ?? 3, 3)},1fr);gap:24px;">${plans}</div>
  </div>
</section>`;
}

function renderFaq(props: Record<string, unknown>): string {
  const p = props as { badge: string; title: string; items: { question: string; answer: string }[]; bg?: string; paddingY?: string };
  const colors = tc(p.bg);
  const items = (p.items ?? []).map((item, i) => `
    <details style="border-bottom:1px solid ${colors.border};padding:20px 0;" ${i === 0 ? 'open' : ''}>
      <summary style="cursor:pointer;font-weight:600;color:${colors.h};font-size:16px;list-style:none;display:flex;justify-content:space-between;">
        ${item.question}<span>▼</span>
      </summary>
      <p style="margin:12px 0 0;color:${colors.body};line-height:1.7;">${item.answer}</p>
    </details>`).join('');
  return `
<section style="${bgCss(p.bg)}padding:${pad(p.paddingY)} 32px;">
  <div style="max-width:800px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:56px;">
      ${p.badge ? `<span style="display:inline-block;padding:4px 12px;border-radius:999px;background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);color:#60A5FA;font-size:13px;font-weight:500;margin-bottom:16px;">${p.badge}</span>` : ''}
      <h2 style="font-size:2.25rem;font-weight:700;color:${colors.h};margin:0;">${p.title}</h2>
    </div>
    <div>${items}</div>
  </div>
</section>`;
}

function renderTestimonials(props: Record<string, unknown>): string {
  const p = props as { badge: string; title: string; items: { name: string; role: string; company: string; avatar: string; text: string }[]; bg?: string; paddingY?: string };
  const colors = tc(p.bg);
  const items = (p.items ?? []).map((item) => `
    <div style="background:${isLight(p.bg) ? '#FFF' : 'rgba(255,255,255,0.03)'};border:1px solid ${colors.border};border-radius:16px;padding:24px;">
      <div style="display:flex;gap:2px;margin-bottom:16px;">${'⭐'.repeat(5)}</div>
      <p style="color:${colors.body};font-size:14px;line-height:1.7;margin:0 0 16px;">"${item.text}"</p>
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#3B82F6,#7C3AED);display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:700;">${(item.avatar || item.name?.slice(0, 2) || 'AB')}</div>
        <div><p style="font-weight:600;font-size:14px;color:${colors.h};margin:0;">${item.name}</p><p style="font-size:12px;color:${colors.muted};margin:0;">${item.role}, ${item.company}</p></div>
      </div>
    </div>`).join('');
  return `
<section style="${bgCss(p.bg)}padding:${pad(p.paddingY)} 32px;">
  <div style="max-width:1100px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:56px;">
      ${p.badge ? `<span style="display:inline-block;padding:4px 12px;border-radius:999px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);color:#FBB040;font-size:13px;font-weight:500;margin-bottom:16px;">${p.badge}</span>` : ''}
      <h2 style="font-size:2.25rem;font-weight:700;color:${colors.h};margin:0;">${p.title}</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">${items}</div>
  </div>
</section>`;
}

function renderLogoWall(props: Record<string, unknown>): string {
  const p = props as { title: string; items: string[]; bg?: string; paddingY?: string };
  const colors = tc(p.bg);
  const items = (p.items ?? []).map((item) => `<span style="padding:8px 20px;border-radius:999px;background:${colors.card};border:1px solid ${colors.border};font-size:14px;color:${colors.body};font-weight:500;white-space:nowrap;">${item}</span>`).join('');
  return `
<section style="${bgCss(p.bg)}padding:${pad(p.paddingY ?? 'sm')} 32px;border-top:1px solid ${colors.border};border-bottom:1px solid ${colors.border};">
  <div style="max-width:1100px;margin:0 auto;">
    ${p.title ? `<p style="text-align:center;font-size:13px;color:${colors.muted};margin-bottom:32px;">${p.title}</p>` : ''}
    <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;">${items}</div>
  </div>
</section>`;
}

function renderFooter(props: Record<string, unknown>): string {
  const p = props as { logo: string; description: string; columns: { title: string; links: { label: string; href: string }[] }[]; showStatus: boolean; copyright: string; bg?: string };
  const colors = tc(p.bg);
  const cols = (p.columns ?? []).map((col) => `
    <div>
      <h4 style="font-size:14px;font-weight:600;color:${colors.h};margin:0 0 16px;">${col.title}</h4>
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px;">
        ${(col.links ?? []).map((l) => `<li><a href="${l.href}" style="text-decoration:none;font-size:14px;color:${colors.muted};">${l.label}</a></li>`).join('')}
      </ul>
    </div>`).join('');
  return `
<footer style="${bgCss(p.bg)}padding:64px 32px;border-top:1px solid ${colors.border};">
  <div style="max-width:1152px;margin:0 auto;">
    <div style="display:grid;grid-template-columns:2fr repeat(${p.columns?.length ?? 3},1fr);gap:40px;margin-bottom:48px;">
      <div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
          <div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#3B82F6,#7C3AED);display:flex;align-items:center;justify-content:center;"><span style="color:white;font-size:12px;">⚡</span></div>
          <span style="font-weight:700;color:${colors.h};">${p.logo}</span>
        </div>
        <p style="font-size:14px;color:${colors.muted};line-height:1.6;max-width:280px;">${p.description}</p>
      </div>
      ${cols}
    </div>
    <div style="border-top:1px solid ${colors.border};padding-top:32px;display:flex;justify-content:space-between;align-items:center;">
      <p style="font-size:14px;color:${colors.muted};margin:0;">${p.copyright}</p>
      ${p.showStatus ? `<div style="display:flex;align-items:center;gap:8px;font-size:14px;color:${colors.muted};"><span style="width:8px;height:8px;border-radius:50%;background:#10B981;display:inline-block;"></span>Tous les systèmes opérationnels</div>` : ''}
    </div>
  </div>
</footer>`;
}

function renderText(props: Record<string, unknown>): string {
  const p = props as { content: string; align: string; size: string; bg?: string; paddingY?: string };
  const colors = tc(p.bg);
  const fontSize: Record<string, string> = { sm: '14px', md: '16px', lg: '20px', xl: '30px' };
  return `
<div style="${bgCss(p.bg)}padding:${pad(p.paddingY ?? 'sm')} 32px;text-align:${p.align ?? 'left'};">
  <p style="max-width:768px;margin:0 auto;color:${colors.body};font-size:${fontSize[p.size ?? 'md'] ?? '16px'};line-height:1.7;">${p.content}</p>
</div>`;
}

function renderImage(props: Record<string, unknown>): string {
  const p = props as { src: string; alt: string; rounded: boolean; shadow: boolean; caption?: string; bg?: string; paddingY?: string };
  if (!p.src) return '';
  return `
<div style="${bgCss(p.bg)}padding:${pad(p.paddingY ?? 'sm')} 32px;text-align:center;">
  <img src="${p.src}" alt="${p.alt ?? ''}" style="max-width:100%;${p.rounded ? 'border-radius:16px;' : ''}${p.shadow ? 'box-shadow:0 25px 50px rgba(0,0,0,0.5);' : ''}" />
  ${p.caption ? `<p style="margin-top:12px;font-size:14px;color:rgba(255,255,255,0.4);">${p.caption}</p>` : ''}
</div>`;
}

function renderDivider(props: Record<string, unknown>): string {
  const p = props as { bg?: string };
  const colors = tc(p.bg);
  return `<div style="${bgCss(p.bg)}padding:16px 32px;"><hr style="border:none;border-top:1px solid ${colors.border};max-width:50%;margin:0 auto;" /></div>`;
}

// ─── Block dispatch ───────────────────────────────────────────────────────────

function renderBlock(type: string, props: Record<string, unknown>): string {
  switch (type) {
    case 'navbar':       return renderNavbar(props);
    case 'hero':         return renderHero(props);
    case 'features':     return renderFeatures(props);
    case 'stats':        return renderStats(props);
    case 'cta':          return renderCta(props);
    case 'pricing':      return renderPricing(props);
    case 'faq':          return renderFaq(props);
    case 'testimonials': return renderTestimonials(props);
    case 'logowall':     return renderLogoWall(props);
    case 'footer':       return renderFooter(props);
    case 'text':         return renderText(props);
    case 'image':        return renderImage(props);
    case 'divider':      return renderDivider(props);
    default:             return '';
  }
}

// ─── Main export function ─────────────────────────────────────────────────────

export function exportProjectToHtml(project: Project): void {
  const page   = project.pages[0];
  const blocks = page?.blocks ?? [];
  const body   = blocks.map((b) => renderBlock(b.type, b.props)).join('\n');

  const seo = (page as { seo?: { title?: string; description?: string } })?.seo;
  const title = seo?.title || project.name;
  const description = seo?.description || '';

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  ${description ? `<meta name="description" content="${description}" />` : ''}
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    img { max-width: 100%; height: auto; display: block; }
    a { transition: opacity 0.2s; }
    a:hover { opacity: 0.8; }
    details summary::-webkit-details-marker { display: none; }
    @media (max-width: 768px) {
      div[style*="grid-template-columns:repeat(3"] { grid-template-columns: 1fr !important; }
      div[style*="grid-template-columns:repeat(4"] { grid-template-columns: 1fr 1fr !important; }
      div[style*="grid-template-columns:2fr"] { grid-template-columns: 1fr !important; }
      h1 { font-size: 2rem !important; }
      h2 { font-size: 1.75rem !important; }
      section, footer, nav { padding-left: 16px !important; padding-right: 16px !important; }
    }
    @keyframes blob-float { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -20px) scale(1.05); } 66% { transform: translate(-20px, 10px) scale(0.98); } }
  </style>
</head>
<body>
${body}
<!-- Generated by Happi Web Creator — happi-webcreator.vercel.app -->
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
