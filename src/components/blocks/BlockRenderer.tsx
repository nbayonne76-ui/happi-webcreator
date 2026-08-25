'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Block } from '@/types';
import NavbarBlock from './NavbarBlock';
import HeroBlock from './HeroBlock';
import FeaturesBlock from './FeaturesBlock';
import StatsBlock from './StatsBlock';
import CtaBlock from './CtaBlock';
import PricingBlock from './PricingBlock';
import FaqBlock from './FaqBlock';
import TestimonialsBlock from './TestimonialsBlock';
import LogoWallBlock from './LogoWallBlock';
import FooterBlock from './FooterBlock';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import DividerBlock from './DividerBlock';

// ─── Animation presets (Framer/Dora-inspired) ────────────────────────────────

type AnimationPreset = 'none' | 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'zoom-in' | 'flip-up';

interface AnimVariant {
  hidden:  Record<string, number | number[]>;
  visible: Record<string, number | number[]>;
  transition: Record<string, unknown>;
}

const ANIMATION_VARIANTS: Record<AnimationPreset, AnimVariant> = {
  'none':        { hidden: {},                              visible: {},                             transition: {} },
  'fade-up':     { hidden: { opacity: 0, y: 40 },          visible: { opacity: 1, y: 0 },           transition: { duration: 0.6,  ease: [0.22, 1, 0.36, 1] } },
  'fade-in':     { hidden: { opacity: 0 },                 visible: { opacity: 1 },                 transition: { duration: 0.7 } },
  'slide-left':  { hidden: { opacity: 0, x: -60 },         visible: { opacity: 1, x: 0 },           transition: { duration: 0.6,  ease: [0.22, 1, 0.36, 1] } },
  'slide-right': { hidden: { opacity: 0, x: 60 },          visible: { opacity: 1, x: 0 },           transition: { duration: 0.6,  ease: [0.22, 1, 0.36, 1] } },
  'zoom-in':     { hidden: { opacity: 0, scale: 0.88 },    visible: { opacity: 1, scale: 1 },       transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  'flip-up':     { hidden: { opacity: 0, rotateX: 20, y: 30 }, visible: { opacity: 1, rotateX: 0, y: 0 }, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

interface BlockRendererProps {
  block: Block;
  selected: boolean;
  onSelect: () => void;
  showOutlines: boolean;
}

export default function BlockRenderer({ block, selected, onSelect, showOutlines }: BlockRendererProps) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const outlineClass = selected
    ? 'ring-2 ring-blue-500 ring-inset'
    : showOutlines
    ? 'ring-1 ring-blue-500/20 ring-inset'
    : '';

  // Read animation from block props (set via PropertiesPanel)
  const animPreset = ((block.props.animation as string) ?? 'none') as AnimationPreset;
  const variant    = ANIMATION_VARIANTS[animPreset] ?? ANIMATION_VARIANTS['none'];

  const renderBlock = () => {
    switch (block.type) {
      case 'navbar':       return <NavbarBlock props={block.props} />;
      case 'hero':         return <HeroBlock props={block.props} />;
      case 'features':     return <FeaturesBlock props={block.props} />;
      case 'stats':        return <StatsBlock props={block.props} />;
      case 'cta':          return <CtaBlock props={block.props} />;
      case 'pricing':      return <PricingBlock props={block.props} />;
      case 'faq':          return <FaqBlock props={block.props} />;
      case 'testimonials': return <TestimonialsBlock props={block.props} />;
      case 'logowall':     return <LogoWallBlock props={block.props} />;
      case 'footer':       return <FooterBlock props={block.props} />;
      case 'text':         return <TextBlock props={block.props} />;
      case 'image':        return <ImageBlock props={block.props} />;
      case 'divider':      return <DividerBlock props={block.props} />;
      default:
        return (
          <div className="py-16 px-8 flex items-center justify-center text-white/30 text-sm border border-dashed border-white/10 m-4 rounded-xl">
            Section « {block.type} » — bientôt disponible
          </div>
        );
    }
  };

  return (
    <div
      ref={ref}
      className={`relative cursor-pointer transition-all ${outlineClass} group`}
      onClick={onSelect}
      style={{ perspective: '1200px' }}
    >
      <motion.div
        initial={animPreset !== 'none' ? variant.hidden : undefined}
        animate={animPreset !== 'none' ? (inView ? variant.visible : variant.hidden) : undefined}
        transition={animPreset !== 'none' ? (variant.transition as Parameters<typeof motion.div>[0]['transition']) : undefined}
      >
        {renderBlock()}
      </motion.div>

      {/* Selection indicator */}
      {selected && (
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-semibold z-10 pointer-events-none capitalize">
          {block.type}
        </div>
      )}
    </div>
  );
}
