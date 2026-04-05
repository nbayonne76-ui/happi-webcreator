import { getBgClass, getPaddingClass, getWidthClass, getTextColors } from '@/lib/blockStyles';

export default function StatsBlock({ props }: { props: Record<string, unknown> }) {
  const p = props as {
    items: { value: string; label: string; sublabel?: string }[];
    variant: string;
    bg?: string; paddingY?: string; contentWidth?: string;
  };

  const bgClass = getBgClass(p.bg);
  const paddingClass = getPaddingClass(p.paddingY ?? 'sm');
  const widthClass = getWidthClass(p.contentWidth ?? 'wide');
  const tc = getTextColors(p.bg);

  return (
    <section className={`${bgClass} ${paddingClass} px-8 border-y ${tc.border}`}>
      <div className={widthClass}>
        <div className={`grid grid-cols-2 ${p.variant === 'grid' ? 'md:grid-cols-2' : 'md:grid-cols-4'} gap-0 divide-x ${tc.divide}`}>
          {(p.items ?? []).map((item, i) => (
            <div key={i} className="text-center py-6 px-4">
              <div className={`text-3xl font-extrabold ${tc.h} mb-1`}>{item.value}</div>
              <div className={`text-sm ${tc.body}`}>{item.label}</div>
              {item.sublabel && <div className={`text-xs ${tc.faint} mt-0.5`}>{item.sublabel}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
