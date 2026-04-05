import { getBgClass, getPaddingClass, getTextColors } from '@/lib/blockStyles';

export default function LogoWallBlock({ props }: { props: Record<string, unknown> }) {
  const p = props as { title: string; items: string[]; bg?: string; paddingY?: string };
  const doubled = [...(p.items ?? []), ...(p.items ?? [])];

  const bgClass = getBgClass(p.bg);
  const paddingClass = getPaddingClass(p.paddingY ?? 'sm');
  const tc = getTextColors(p.bg);

  return (
    <section className={`${bgClass} ${paddingClass} px-8 border-y ${tc.border}`}>
      <div className="max-w-5xl mx-auto">
        {p.title && <p className={`text-center text-sm ${tc.faint} mb-8`}>{p.title}</p>}
        <div className="relative overflow-hidden">
          <div className="flex gap-6 w-max" style={{ animation: 'marquee 25s linear infinite' }}>
            {doubled.map((item, i) => (
              <span key={i} className={`px-5 py-2 rounded-full border ${tc.border} ${tc.card} text-sm ${tc.body} font-medium whitespace-nowrap`}>
                {item}
              </span>
            ))}
          </div>
          {/* Fade gradients — these need inline style because the bg color is dynamic */}
          <div className="absolute inset-y-0 left-0 w-16 pointer-events-none" style={{ background: 'inherit' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-inherit to-transparent opacity-100" />
          </div>
          <div className="absolute inset-y-0 right-0 w-16 pointer-events-none" style={{ background: 'inherit' }}>
            <div className="absolute inset-0 bg-gradient-to-l from-inherit to-transparent opacity-100" />
          </div>
        </div>
      </div>
    </section>
  );
}
