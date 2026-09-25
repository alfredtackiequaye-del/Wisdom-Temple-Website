import React, { useState } from 'react';
import { optimizedImageUrl } from '../utils/optimizedImage';

interface ICGCLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'emblem-only' | 'horizontal';
  theme?: 'dark' | 'light' | 'gold';
  className?: string;
  forceWhite?: boolean;
}

export const ICGCLogo: React.FC<ICGCLogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  theme = 'dark',
  className = '',
  forceWhite = true, // Default to pure white per user directive
}) => {
  const isLight = theme === 'light' && !forceWhite;
  const isGold = theme === 'gold' && !forceWhite;

  // Authentic pure white ICGC emblem assets for dark backgrounds
  const logoSrc = isLight
    ? '/church_logo_trimmed.png'
    : isGold
      ? '/church_logo_gold.png'
      : '/church_logo_white.png'; // Pure white emblem

  const [imageError, setImageError] = useState(false);

  // Exact 580:470 (1.234) aspect ratio dimensions so emblem and full arc fit containers cleanly
  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return {
          wrapper: 'h-8 w-10 aspect-[580/470]',
          title: 'text-sm font-bold',
          tagline: 'text-[8.5px]',
        };
      case 'lg':
        return {
          wrapper: 'h-12 w-[60px] aspect-[580/470]',
          title: 'text-xl font-bold',
          tagline: 'text-[11px]',
        };
      case 'xl':
        return {
          wrapper: 'h-16 w-[80px] aspect-[580/470]',
          title: 'text-2xl font-bold',
          tagline: 'text-[13px]',
        };
      case 'md':
      default:
        return {
          wrapper: 'h-10 w-[50px] aspect-[580/470]',
          title: 'text-base sm:text-lg font-bold',
          tagline: 'text-[9.5px]',
        };
    }
  };

  const dims = getDimensions();
  // Pure white fill for vector fallback
  const svgFill = isLight ? '#063c24' : isGold ? '#f5cf72' : '#ffffff';

  const emblem = (
    <div 
      className={`relative flex items-center justify-center shrink-0 select-none ${dims.wrapper}`}
      title="Wisdom Temple"
    >
      {!imageError ? (
        <img
          src={optimizedImageUrl(logoSrc)}
          alt="Wisdom Temple Emblem"
          width={580}
          height={470}
          className="w-full h-full object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
          onError={() => setImageError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <svg 
          viewBox="0 0 580 470" 
          className="w-full h-full drop-shadow-sm transition-transform duration-200 group-hover:scale-105" 
          aria-hidden="true"
          fill="none"
        >
          <defs>
            <mask id="icgc-pillar-mask">
              <rect x="0" y="0" width="580" height="470" fill="#ffffff" />
              <circle cx="290" cy="290" r="136" fill="#000000" />
            </mask>
          </defs>

          {/* Complete Orbital Ring (Back & Front seamless 3D perspective ellipse) */}
          <path 
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 20,360 A 270 92 0 1 0 560,360 A 270 92 0 1 0 20,360 Z M 58,360 A 232 70 0 1 1 522,360 A 232 70 0 1 1 58,360 Z" 
            fill={svgFill}
          />

          {/* The Four Foundational Apostolic Pillars (Acts 2:42) */}
          <g mask="url(#icgc-pillar-mask)" fill={svgFill}>
            {/* Pillar 1: Doctrine (Far Left) */}
            <rect x="137" y="198" width="54" height="178" rx="3" />
            {/* Pillar 2: Fellowship (Center Left) */}
            <rect x="221" y="92" width="54" height="313" rx="3" />
            {/* Pillar 3: Breaking of Bread (Center Right - Highest Peak) */}
            <rect x="305" y="20" width="54" height="385" rx="3" />
            {/* Pillar 4: Prayers (Far Right) */}
            <rect x="389" y="160" width="54" height="216" rx="3" />
          </g>

          {/* Central Globe Sphere */}
          <circle cx="290" cy="290" r="114" fill={svgFill} />
        </svg>
      )}
    </div>
  );

  if (variant === 'emblem-only') {
    return <div className={`inline-flex items-center ${className}`}>{emblem}</div>;
  }

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {emblem}
      <div className="flex flex-col justify-center">
        <span className={`${dims.title} tracking-tight font-serif-title ${isLight ? 'text-[#063c24]' : 'text-white'}`}>
          WISDOM TEMPLE
        </span>
      </div>
    </div>
  );
};

