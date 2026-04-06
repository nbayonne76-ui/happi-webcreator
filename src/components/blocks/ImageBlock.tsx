import { ImageIcon } from 'lucide-react';
import { getBgClass, getPaddingClass, getWidthClass, getTextColors } from '@/lib/blockStyles';

export default function ImageBlock({ props }: { props: Record<string, unknown> }) {
  const p = props as {
    src: string; alt: string; caption?: string;
    align?: 'left' | 'center' | 'right';
    maxWidth?: string;
    rounded: boolean; shadow: boolean;
    bg?: string; paddingY?: string; contentWidth?: string;
  };

  const bgClass      = getBgClass(p.bg);
  const paddingClass = getPaddingClass(p.paddingY ?? 'sm');
  const widthClass   = getWidthClass(p.contentWidth);
  const tc           = getTextColors(p.bg);

  const alignClass = p.align === 'left' ? 'mr-auto' : p.align === 'right' ? 'ml-auto' : 'mx-auto';

  if (!p.src) {
    return (
      <div className={`${bgClass} ${paddingClass} px-8`}>
        <div className={widthClass}>
          <div className="w-full aspect-video rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 text-white/20">
            <ImageIcon className="w-8 h-8" />
            <p className="text-sm">Ajoutez une URL d&apos;image dans les propriétés</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${bgClass} ${paddingClass} px-8`}>
      <div className={widthClass}>
        <figure className="m-0">
          <img
            src={p.src}
            alt={p.alt ?? ''}
            style={{ maxWidth: p.maxWidth || '100%', display: 'block' }}
            className={`w-full ${alignClass} ${p.rounded ? 'rounded-2xl' : ''} ${p.shadow ? 'shadow-2xl shadow-black/40' : ''}`}
          />
          {p.caption && (
            <figcaption className={`text-center text-sm ${tc.faint} mt-3`}>{p.caption}</figcaption>
          )}
        </figure>
      </div>
    </div>
  );
}
