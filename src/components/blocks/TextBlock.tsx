import { getBgClass, getPaddingClass, getWidthClass, getTextColors } from '@/lib/blockStyles';

const SIZE_MAP: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-3xl font-bold',
};
const ALIGN_MAP: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export default function TextBlock({ props }: { props: Record<string, unknown> }) {
  const p = props as { content: string; align: string; size: string; bg?: string; paddingY?: string; contentWidth?: string };

  const bgClass = getBgClass(p.bg);
  const paddingClass = getPaddingClass(p.paddingY ?? 'sm');
  const widthClass = getWidthClass(p.contentWidth);
  const tc = getTextColors(p.bg);

  return (
    <div className={`${bgClass} ${paddingClass} px-8 ${ALIGN_MAP[p.align] ?? ''}`}>
      <div className={`${widthClass} ${tc.body} leading-relaxed ${SIZE_MAP[p.size] ?? ''}`}>
        {p.content}
      </div>
    </div>
  );
}
