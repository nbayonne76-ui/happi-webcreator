'use client';

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

interface BlockRendererProps {
  block: Block;
  selected: boolean;
  onSelect: () => void;
  showOutlines: boolean;
}

export default function BlockRenderer({ block, selected, onSelect, showOutlines }: BlockRendererProps) {
  const outlineClass = selected
    ? 'ring-2 ring-blue-500 ring-inset'
    : showOutlines
    ? 'ring-1 ring-blue-500/20 ring-inset'
    : '';

  const renderBlock = () => {
    switch (block.type) {
      case 'navbar': return <NavbarBlock props={block.props} />;
      case 'hero': return <HeroBlock props={block.props} />;
      case 'features': return <FeaturesBlock props={block.props} />;
      case 'stats': return <StatsBlock props={block.props} />;
      case 'cta': return <CtaBlock props={block.props} />;
      case 'pricing': return <PricingBlock props={block.props} />;
      case 'faq': return <FaqBlock props={block.props} />;
      case 'testimonials': return <TestimonialsBlock props={block.props} />;
      case 'logowall': return <LogoWallBlock props={block.props} />;
      case 'footer': return <FooterBlock props={block.props} />;
      case 'text': return <TextBlock props={block.props} />;
      case 'image': return <ImageBlock props={block.props} />;
      case 'divider': return <hr className="border-white/10 my-8 mx-auto w-1/2" />;
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
      className={`relative cursor-pointer transition-all ${outlineClass} group`}
      onClick={onSelect}
    >
      {renderBlock()}
      {/* Selection indicator */}
      {selected && (
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-semibold z-10 pointer-events-none capitalize">
          {block.type}
        </div>
      )}
    </div>
  );
}
