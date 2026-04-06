import { getBgClass, getTextColors } from '@/lib/blockStyles';

const STYLE_MAP: Record<string, string> = {
  line:   'border-t',
  dashed: 'border-t border-dashed',
  dotted: 'border-t border-dotted',
  thick:  'border-t-4',
  double: 'border-t-[3px] border-double',
};

const WIDTH_MAP: Record<string, string> = {
  sm:   'w-1/4',
  md:   'w-1/2',
  lg:   'w-3/4',
  full: 'w-full',
};

export default function DividerBlock({ props }: { props: Record<string, unknown> }) {
  const p = props as {
    style?: string;
    width?: string;
    spacing?: string;
    bg?: string;
  };

  const bgClass     = getBgClass(p.bg);
  const tc          = getTextColors(p.bg);
  const lineStyle   = STYLE_MAP[p.style  ?? 'line'] ?? STYLE_MAP.line;
  const lineWidth   = WIDTH_MAP[p.width  ?? 'md']   ?? WIDTH_MAP.md;
  const spacingY    = p.spacing === 'sm' ? 'py-4' : p.spacing === 'lg' ? 'py-16' : 'py-8';

  return (
    <div className={`${bgClass} ${spacingY} px-8 flex justify-center`}>
      <hr className={`${lineStyle} ${lineWidth} ${tc.border} border-0`} style={{ borderColor: 'currentColor' }} />
    </div>
  );
}
