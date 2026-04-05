const SIZE_MAP: Record<string, string> = { sm: 'text-sm', md: 'text-base', lg: 'text-xl', xl: 'text-3xl font-bold' };
const ALIGN_MAP: Record<string, string> = { left: 'text-left', center: 'text-center', right: 'text-right' };

export default function TextBlock({ props }: { props: Record<string, unknown> }) {
  const p = props as { content: string; align: string; size: string };
  return (
    <div className={`py-8 px-8 bg-gray-950 ${ALIGN_MAP[p.align] ?? ''}`}>
      <div className={`max-w-3xl mx-auto text-white/70 leading-relaxed ${SIZE_MAP[p.size] ?? ''}`}>
        {p.content}
      </div>
    </div>
  );
}
